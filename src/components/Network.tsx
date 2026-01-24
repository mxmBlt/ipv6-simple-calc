import { formatBinaryIPv6 } from "../utils/ipv6";
import { ResultRow } from "./ResultRow";
import type { IPv6CalculationResult } from "../utils/ipv6";

interface NetworkProps {
  network: IPv6CalculationResult;
  netmask: number;
}

export function Network({ network, netmask }: NetworkProps) {
  return (
    <dl className="result-grid">
      <ResultRow
        asDefinition
        label="Prefix Length"
        value={`/${netmask}`}
        binary={formatBinaryIPv6(
          "1".repeat(netmask) + "0".repeat(128 - netmask),
          netmask,
        )}
      />

      <ResultRow
        asDefinition
        label="Network Address"
        value={network.network}
        binary={formatBinaryIPv6(network.networkBin, netmask)}
      />

      <ResultRow
        asDefinition
        label="First Host"
        value={network.firstHost}
        binary={formatBinaryIPv6(network.firstHostBin, netmask)}
      />

      <ResultRow
        asDefinition
        label="Last Host"
        value={network.lastHost}
        binary={formatBinaryIPv6(network.lastHostBin, netmask)}
      />

      <ResultRow asDefinition label="Total Hosts" value={network.hostCount} />
    </dl>
  );
}
