import { Layout } from "../layout/Layout";
import { ResultGrid } from "./ResultGrid";
import { ResultRow } from "./ResultRow";
import {
  calculateIPv6,
  calculateSubnets,
  formatBinaryIPv6,
  type IPv6CalculationResult,
} from "../utils/ipv6";
import { Network } from "./Network";

interface TableProps {
  address: string;
  netmask: number;
  showSubnets?: number;
}

export function Table({ address, netmask, showSubnets }: TableProps) {
  const result: IPv6CalculationResult = calculateIPv6(address, netmask);
  const subnets: IPv6CalculationResult[] | null = showSubnets
    ? calculateSubnets(address, netmask, showSubnets)
    : null;

  return (
    <Layout title="IPv6 Calculation Results">
      {/* Network Details */}
      <ResultGrid title="Network Details">
        <ResultRow
          asDefinition
          label="Input Address"
          value={result.input}
          binary={formatBinaryIPv6(result.inputBin, netmask)}
        />
        <Network network={result} netmask={netmask} />
      </ResultGrid>

      {/* Subnets */}
      {subnets && showSubnets && (
        <ResultGrid title={`Subnets (/${showSubnets})`}>
          {subnets.map((subnet, index) => (
            <Network key={index} network={subnet} netmask={showSubnets} />
          ))}
        </ResultGrid>
      )}
    </Layout>
  );
}
