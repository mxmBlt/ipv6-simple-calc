interface TableProps {
  address: string;
  netmask: number;
}
export function Table({ address, netmask }: TableProps) {
  const result = calculateIPv6(address, netmask);
  return (
    <section className="ipv6-results">
      <h2>IPv6 Calculation Results</h2>
      <div className="result-grid">
        <div className="result-row">
          <span className="label">Input Address</span>
          <span className="value">{result.input}</span>
          <span className="binary">{formatBinaryIPv6(result.inputBin, netmask)}</span>
        </div>
        <div className="result-row">
          <span className="label">Prefix Length</span>
          <span className="value">/{netmask}</span>
          <span className="binary">{formatBinaryIPv6("1".repeat(netmask) + "0".repeat(128 - netmask), netmask)}</span>
        </div>
        <div className="result-row">
          <span className="label">Network Address</span>
          <span className="value">{result.network}</span>
          <span className="binary">{formatBinaryIPv6(result.networkBin, netmask)}</span>
        </div>
        <div className="result-row">
          <span className="label">First Host</span>
          <span className="value">{result.firstHost}</span>
          <span className="binary">{formatBinaryIPv6(result.firstHostBin, netmask)}</span>
        </div>
        <div className="result-row">
          <span className="label">Last Host</span>
          <span className="value">{result.lastHost}</span>
          <span className="binary">{formatBinaryIPv6(result.lastHostBin, netmask)}</span>
        </div>
        <div className="result-row">
          <span className="label">Total Hosts</span>
          <span className="value">{result.hostCount}</span>
        </div>
      </div>
    </section>
  );
}


export function calculateIPv6(address: string, prefix: number) {
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
    networkBin: networkBin,
    firstHost: binaryToIPv6Raw(firstHostBin),
    firstHostBin: firstHostBin,
    lastHost: binaryToIPv6Raw(lastHostBin),
    lastHostBin: lastHostBin,
    hostCount: hostCount.toString(),
    prefix: prefix,
  };
}
export function ipv6ToBinaryRaw(address: string): string {
  // Handle :: expansion for abbreviated IPv6 addresses
  if (address.includes("::")) {
    const parts = address.split("::");
    const leftParts = parts[0] ? parts[0].split(":").filter(p => p) : [];
    const rightParts = parts[1] ? parts[1].split(":").filter(p => p) : [];
    const missingParts = 8 - leftParts.length - rightParts.length;
    
    const expanded = [
      ...leftParts,
      ...Array(missingParts).fill("0"),
      ...rightParts
    ];
    
    return expanded
      .map(block => parseInt(block || "0", 16).toString(2).padStart(16, "0"))
      .join("");
  }
  
  // No :: expansion needed, split normally
  return address
    .split(":")
    .map(block => parseInt(block || "0", 16).toString(2).padStart(16, "0"))
    .join("");
}
export function binaryToIPv6Raw(bin: string): string {
  const blocks = [];

  for (let i = 0; i < 128; i += 16) {
    const chunk = bin.slice(i, i + 16);
    const hexValue = parseInt(chunk, 2).toString(16);
    blocks.push(hexValue);
  }

  return blocks.join(":");
}

export function formatBinaryIPv6(bin: string, netmask?: number): string {
  const parts = [];
  for (let i = 0; i < 128; i += 16) {
    parts.push(bin.slice(i, i + 16));
  }
  const formatted = parts.join(".");
  
  // Si netmask est fourni, insérer des espaces à la bonne position
  if (netmask !== undefined) {
    const groupsComplete = Math.floor(netmask / 16);
    const remainingBits = netmask % 16;
    
    // Chaque groupe complet = 16 bits + 1 point = 17 caractères
    let insertPosition = groupsComplete * 17 + remainingBits;
    
    return formatted.slice(0, insertPosition) + "  " + formatted.slice(insertPosition);
  }
  
  return formatted;
}

export function formatBinaryIPv6WithNetmask(bin: string, netmask: number): string {
  return formatBinaryIPv6(bin, netmask);
}
