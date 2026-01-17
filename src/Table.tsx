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
        </div>
        <div className="result-row">
          <span className="label">Prefix Length</span>
          <span className="value">/{netmask}</span>
        </div>
        <div className="result-row">
          <span className="label">Network Address</span>
          <span className="value">{result.network}</span>
        </div>
        <div className="result-row">
          <span className="label">First Host</span>
          <span className="value">{result.firstHost}</span>
        </div>
        <div className="result-row">
          <span className="label">Last Host</span>
          <span className="value">{result.lastHost}</span>
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
    // Convert the raw IPv6 string directly to binary
    const bin = ipv6ToBinaryRaw(address);

    // Network bits + zeroed host bits
    const networkBin =
        bin.slice(0, prefix) + "0".repeat(128 - prefix);

    // First host = network + 1
    const firstHostBin =
        networkBin.slice(0, 127) + "1";

    // Total hosts = 2^(128 - prefix)
    const hostCount =
        BigInt(1) << BigInt(128 - prefix);

    // Last host = network + hostCount - 1
    const lastHostInt =
        BigInt("0b" + networkBin) + hostCount - BigInt(1);

    const lastHostBin =
        lastHostInt.toString(2).padStart(128, "0");

    return {
        input: address,
        network: binaryToIPv6Raw(networkBin),
        firstHost: binaryToIPv6Raw(firstHostBin),
        lastHost: binaryToIPv6Raw(lastHostBin),
        hostCount: hostCount.toString()
    };
}
export function ipv6ToBinaryRaw(address: string): string {
    return address
        .split(":")
        .map(block => parseInt(block || "0", 16)
            .toString(2)
            .padStart(16, "0"))
        .join("");
}
export function binaryToIPv6Raw(bin: string): string {
    const blocks = [];

    for (let i = 0; i < 128; i += 16) {
        const chunk = bin.slice(i, i + 16);
        blocks.push(parseInt(chunk, 2).toString(16));
    }

    return blocks.join(":");
}
