import { ResultGrid } from "./ResultGrid";
import { ResultRow } from "./ResultRow";
import {
  calculateIPv6,
  calculateSubnets,
  type IPv6Result,
  type IPv6Input,
} from "../utils/ipv6";
import { Network } from "./Network";

interface TableProps {
  input: IPv6Input;
}

export function Table({ input }: TableProps) {
  const result: IPv6Result = calculateIPv6(input.address, input.prefix);
  const subnets: IPv6Result[] | null = input.subnetsPrefix
    ? calculateSubnets(input.address, input.prefix, input.subnetsPrefix)
    : null;

  return (
    <>
      {/* Network Details */}
      <ResultGrid title={`Network`}>
        <ResultRow
          label="Input Address"
          value={result.mainBlock.network}
          prefix={result.mainBlock.prefixLength}
        />
        <Network result={result} />
      </ResultGrid>

      {/* Subnets */}
      {subnets && input.subnetsPrefix && (
        <ResultGrid title={`Subnets (/${input.subnetsPrefix})`}>
          {subnets.map((subnet, index) => (
            <Network key={index} result={subnet} />
          ))}
        </ResultGrid>
      )}
    </>
  );
}
