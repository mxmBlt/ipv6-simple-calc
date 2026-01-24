export interface IPv6CalculationResult {
  input: string;
  inputBin: string;
  network: string;
  networkBin: string;
  firstHost: string;
  firstHostBin: string;
  lastHost: string;
  lastHostBin: string;
  hostCount: string;
  prefix: number;
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
export function ipv6ToBinaryRaw(address: string): string {
  const blocks = expandIPv6(address);

  return blocks
    .map((block) => parseInt(block, 16).toString(2).padStart(16, "0"))
    .join("");
}

/**
 * Convert a 128-bit binary string to an uncompressed IPv6 string.
 */
export function binaryToIPv6Raw(bin: string): string {
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
 * Calculate basic IPv6 network information from an address and prefix.
 */
export function calculateIPv6(
  address: string,
  prefix: number,
): IPv6CalculationResult {
  const bin = ipv6ToBinaryRaw(address);
  const networkBin = bin.slice(0, prefix) + "0".repeat(128 - prefix);

  const firstHostBin = networkBin.slice(0, 127) + "1";

  const hostCount = BigInt(1) << BigInt(128 - prefix);
  const lastHostInt = BigInt("0b" + networkBin) + hostCount - BigInt(1);
  const lastHostBin = lastHostInt.toString(2).padStart(128, "0");

  return {
    input: address,
    inputBin: bin,
    network: binaryToIPv6Raw(networkBin),
    networkBin,
    firstHost: binaryToIPv6Raw(firstHostBin),
    firstHostBin,
    lastHost: binaryToIPv6Raw(lastHostBin),
    lastHostBin,
    hostCount: hostCount.toString(),
    prefix,
  };
}

/**
 * Calculate all subnets between currentPrefix and subnetPrefix.
 */
export function calculateSubnets(
  address: string,
  currentPrefix: number,
  subnetPrefix: number,
): IPv6CalculationResult[] {
  if (subnetPrefix <= currentPrefix) {
    return [];
  }

  const bin = ipv6ToBinaryRaw(address);
  const networkBin =
    bin.slice(0, currentPrefix) + "0".repeat(128 - currentPrefix);

  const subnetBits = subnetPrefix - currentPrefix;
  const subnetsCount = 2 ** subnetBits;
  const subnets: IPv6CalculationResult[] = [];

  for (let i = 0; i < subnetsCount; i++) {
    const subnetIndex = i.toString(2).padStart(subnetBits, "0");

    const subnetBin =
      networkBin.slice(0, currentPrefix) +
      subnetIndex +
      "0".repeat(128 - subnetPrefix);

    subnets.push(calculateIPv6(binaryToIPv6Raw(subnetBin), subnetPrefix));
  }

  return subnets;
}
