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
  prefixLength: number;
  network: bigint;
  start: bigint;
  end: bigint;
  size: bigint;
}
/**
 * Expand an IPv6 address to its full 8-block representation.
 * Example: "211::" -> ["0211", "0000", ..., "0000"]
 */
function expandIPv6(address: string): string[] {
  if (address.includes("::")) {
    const [left, right] = address.split("::");
    const leftParts = left ? left.split(":").filter(Boolean) : [];
    const rightParts = right ? right.split(":").filter(Boolean) : [];
    const missingParts = 8 - leftParts.length - rightParts.length;

    return [...leftParts, ...Array(missingParts).fill("0"), ...rightParts].map(
      (block) => block || "0",
    );
  }

  return address
    .split(":")
    .filter(Boolean)
    .map((block) => block || "0");
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

/**
 * Convert a bigint to IPv6 format (hex format)
 */
export function bigIntToIPv6(value: bigint): string {
  return fromBinary(value.toString(2).padStart(128, "0"));
}

/**
 * Convert a bigint to binary format (128-bit string)
 */
export function bigIntToBinary(value: bigint): string {
  return value.toString(2).padStart(128, "0");
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
    prefixLength: prefix,
    network: networkBigInt,
    start: networkBigInt,
    end: endBigInt,
    size: hostCount,
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
      prefixLength: subnetPrefix,
      network: subnetNetworkBigInt,
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
