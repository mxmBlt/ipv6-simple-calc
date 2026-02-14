export interface IPv6Result {
  mainBlock: IPv6Block;
  subnets?: IPv6Block[];
}

export interface IPv6Input {
  address: string;
  prefix: number;
  subnetsPrefix?: number;
}

export interface IPv6Block {
  network: bigint;
  netmask: bigint;
  start: bigint;
  end: bigint;
  size: bigint;
}

export interface SubnetPageResult {
  subnets: IPv6Result[];
  total: bigint;
  page: number;
  pageSize: number;
  error?: string;
}
/**
 * Expand an IPv6 address to its full 8-block representation.
 * Example: "211::" -> ["0211", "0000", ..., "0000"]
 */
export function expandIPv6(address: string): string[] {
  if (address === "::") return Array(8).fill("0000");

  const [left, right] = address.split("::");

  const leftParts = left ? left.split(":") : [];
  const rightParts = right ? right.split(":") : [];

  const missing = 8 - (leftParts.length + rightParts.length);

  const middle = Array(missing).fill("0000");

  return [
    ...leftParts.map((p) => p.padStart(4, "0")),
    ...middle,
    ...rightParts.map((p) => p.padStart(4, "0")),
  ];
}

/**
 * Convert an IPv6 address string to a 128-bit binary string.
 */
export function toBinary(address: string): string {
  const blocks = expandIPv6(address);

  return blocks
    .map((block) => parseInt(block, 16).toString(2).padStart(16, "0"))
    .join("");
}

/**
 * Convert a 128-bit binary string to an uncompressed IPv6 string.
 */
export function fromBinary(bin: string): string {
  const blocks: string[] = [];

  for (let i = 0; i < 128; i += 16) {
    const chunk = bin.slice(i, i + 16);
    const hexValue = parseInt(chunk, 2).toString(16);
    blocks.push(hexValue);
  }

  return blocks.join(":");
}

/**
 * Format a 128-bit binary IPv6 string into 16-bit groups separated by dots.
 * Optionally inserts a visual split at the prefix length.
 */
export function formatBinaryIPv6(bin: string, netmask?: number): string {
  const parts: string[] = [];

  for (let i = 0; i < 128; i += 16) {
    parts.push(bin.slice(i, i + 16));
  }

  const formatted = parts.join(".");

  if (netmask === undefined) {
    return formatted;
  }

  const groupsComplete = Math.floor(netmask / 16);
  const remainingBits = netmask % 16;

  // Each full group = 16 bits + 1 dot = 17 characters
  let insertPosition = groupsComplete * 17 + remainingBits;

  return (
    formatted.slice(0, insertPosition) + "  " + formatted.slice(insertPosition)
  );
}

export function formatBinaryIPv6WithNetmask(
  bin: string,
  netmask: number,
): string {
  return formatBinaryIPv6(bin, netmask);
}

export function normalizeIPv6(address: string): string {
  const bin = toBinary(address);
  const bigint = BigInt("0b" + bin);
  return bigIntToIPv6(bigint);
}
/**
 * Convert a bigint to IPv6 format (hex format)
 */
export function bigIntToIPv6(value: bigint): string {
  // 1. Convertir en 8 groupes de 16 bits
  const bin = value.toString(2).padStart(128, "0");
  const groups = bin.match(/.{1,16}/g)!.map((b) => parseInt(b, 2).toString(16));

  // 2. Supprimer les zéros initiaux dans chaque groupe
  const noLeadingZeros = groups.map((g) => g.replace(/^0+/, "") || "0");

  // 3. Trouver la plus longue séquence de "0"
  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;

  noLeadingZeros.forEach((g, i) => {
    if (g === "0") {
      if (curStart === -1) curStart = i;
      curLen++;
    } else {
      if (curLen > bestLen) {
        bestStart = curStart;
        bestLen = curLen;
      }
      curStart = -1;
      curLen = 0;
    }
  });

  // Dernière séquence
  if (curLen > bestLen) {
    bestStart = curStart;
    bestLen = curLen;
  }

  // 4. Si aucune compression possible
  if (bestLen < 2) {
    return noLeadingZeros.join(":");
  }

  // 5. Construire l’adresse compressée
  const before = noLeadingZeros.slice(0, bestStart);
  const after = noLeadingZeros.slice(bestStart + bestLen);

  // Cas :: (tous les groupes sont 0)
  if (before.length === 0 && after.length === 0) {
    return "::";
  }

  // Cas compression en début
  if (before.length === 0) {
    return "::" + after.join(":");
  }

  // Cas compression en fin
  if (after.length === 0) {
    return before.join(":") + "::";
  }

  // Cas compression au milieu
  return before.join(":") + "::" + after.join(":");
}

/**
 * Convert a bigint to binary format (128-bit string)
 */
export function bigIntToBinary(value: bigint): string {
  return value.toString(2).padStart(128, "0");
}

export function prefixToMaskBigInt(prefix: number): bigint {
  return BigInt("0b" + "1".repeat(prefix) + "0".repeat(128 - prefix));
}

export function toHextets(str: string): string {
  return str.length === 0 ? "" : str.match(/.{1,16}/g)!.join(".");
}

export function bitIndexToCharIndex(prefix: number): number {
  // Chaque bloc = 16 bits + 1 point, sauf le dernier
  // Exemple : 16 bits → 16 chars, puis un point → 17 chars
  const fullBlocks = Math.floor(prefix / 16);
  const offsetInBlock = prefix % 16;

  return fullBlocks * 17 + offsetInBlock;
}

export function splitIPv6Binary(binary: string, mask1: number, mask2: number) {
  const netBits = binary.slice(0, mask1);
  const subnetBits = binary.slice(mask1, mask2);
  const hostBits = binary.slice(mask2);

  return {
    net: toHextets(netBits),
    subnet: toHextets(subnetBits),
    host: toHextets(hostBits),
  };
}

/**
 * Calculate basic IPv6 network information from an address and prefix.
 */
export function calculateIPv6(address: string, prefix: number): IPv6Result {
  const bin = toBinary(address);
  const networkBin = bin.slice(0, prefix) + "0".repeat(128 - prefix);
  const networkBigInt = BigInt("0b" + networkBin);

  const hostCount = BigInt(1) << BigInt(128 - prefix);
  const endBigInt = networkBigInt + hostCount - BigInt(1);

  const mainBlock: IPv6Block = {
    network: networkBigInt,
    start: networkBigInt,
    end: endBigInt,
    size: hostCount,
    netmask: prefixToMaskBigInt(prefix),
  };

  return {
    mainBlock,
  };
}

/**
 * Calculate all subnets between currentPrefix and subnetPrefix.
 */
export function calculateSubnets(
  address: string,
  currentPrefix: number,
  subnetPrefix: number,
): IPv6Result[] {
  if (subnetPrefix <= currentPrefix) {
    return [];
  }

  const bin = toBinary(address);
  const networkBin =
    bin.slice(0, currentPrefix) + "0".repeat(128 - currentPrefix);

  const subnetBits = subnetPrefix - currentPrefix;
  const subnetsCount = 2 ** subnetBits;
  const subnets: IPv6Result[] = [];

  for (let i = 0; i < subnetsCount; i++) {
    const subnetIndex = i.toString(2).padStart(subnetBits, "0");

    const subnetBin =
      networkBin.slice(0, currentPrefix) +
      subnetIndex +
      "0".repeat(128 - subnetPrefix);

    const subnetNetworkBigInt = BigInt("0b" + subnetBin);
    const hostCount = BigInt(1) << BigInt(128 - subnetPrefix);
    const endBigInt = subnetNetworkBigInt + hostCount - BigInt(1);

    const mainBlock: IPv6Block = {
      network: subnetNetworkBigInt,
      netmask: prefixToMaskBigInt(subnetPrefix),
      start: subnetNetworkBigInt,
      end: endBigInt,
      size: hostCount,
    };

    subnets.push({
      mainBlock,
    });
  }

  return subnets;
}

export function calculateSubnetsPage(
  address: string,
  currentPrefix: number,
  subnetPrefix: number,
  page: number,
  pageSize: number,
): SubnetPageResult {
  if (subnetPrefix <= currentPrefix) {
    return { subnets: [], total: 0n, page, pageSize };
  }

  if (page < 1 || pageSize <= 0) {
    return {
      subnets: [],
      total: 0n,
      page,
      pageSize,
      error: "page hors limites",
    };
  }

  const bin = toBinary(address);
  const networkBin =
    bin.slice(0, currentPrefix) + "0".repeat(128 - currentPrefix);
  const baseNetwork = BigInt("0b" + networkBin);

  const subnetBits = subnetPrefix - currentPrefix;
  const totalSubnets = 1n << BigInt(subnetBits);
  const subnetSize = 1n << BigInt(128 - subnetPrefix);

  const offset = BigInt(page - 1) * BigInt(pageSize);
  if (offset >= totalSubnets) {
    return {
      subnets: [],
      total: totalSubnets,
      page,
      pageSize,
      error: "page hors limites",
    };
  }

  const subnets: IPv6Result[] = [];
  for (let i = 0; i < pageSize; i++) {
    const idx = offset + BigInt(i);
    if (idx >= totalSubnets) break;

    const subnetNetworkBigInt =
      baseNetwork + (idx << BigInt(128 - subnetPrefix));
    const endBigInt = subnetNetworkBigInt + subnetSize - 1n;

    const mainBlock: IPv6Block = {
      network: subnetNetworkBigInt,
      netmask: prefixToMaskBigInt(subnetPrefix),
      start: subnetNetworkBigInt,
      end: endBigInt,
      size: subnetSize,
    };

    subnets.push({ mainBlock });
  }

  return { subnets, total: totalSubnets, page, pageSize };
}

/**
 * Validate an IPv6 address format
 * Supports both full and compressed (::) notation
 */
export function isValidIPv6(address: string): boolean {
  // Trim whitespace
  address = address.trim();

  // Check if address is empty
  if (!address) return false;

  // IPv6 regex pattern that supports:
  // - Full format: 8 groups of 1-4 hex digits separated by :
  // - Compressed format: with :: (can appear only once)
  // - Mixed formats
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv6Regex.test(address);
}

/**
 * Get validation error message for IPv6 address
 */
export function getIPv6ErrorMessage(address: string): string | null {
  if (!address.trim()) {
    return "Adresse IPv6 requise";
  }

  if (address.includes(":::")) {
    return "Format invalide: '::' ne peut apparaître qu'une seule fois";
  }

  if ((address.match(/::/g) || []).length > 1) {
    return "Format invalide: '::' ne peut apparaître qu'une seule fois";
  }

  const groups = address.split(":");
  for (const group of groups) {
    if (group && group.length > 4) {
      return "Format invalide: chaque groupe doit contenir au maximum 4 caractères hexadécimaux";
    }
    if (group && !/^[0-9a-fA-F]*$/.test(group)) {
      return "Format invalide: utiliser uniquement les chiffres 0-9 et les lettres a-f (ou A-F)";
    }
  }

  if (!isValidIPv6(address)) {
    return "Format IPv6 invalide";
  }

  return null;
}
