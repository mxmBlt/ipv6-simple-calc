import { ResultRow } from "./ResultRow";
import type { IPv6Result } from "../utils/ipv6";

interface NetworkProps {
  result: IPv6Result;
}

export function Network({ result }: NetworkProps) {
  const block = result.mainBlock;

  return (
    <>
      <ResultRow
        label="Network Address"
        value={block.network}
        prefix={block.prefixLength}
      />

      <ResultRow
        label="Prefix length"
        value={block.netmask}
        prefix={block.prefixLength}
      />
      <ResultRow
        label="First Address"
        value={block.start}
        prefix={block.prefixLength}
      />

      <ResultRow
        label="Last Address"
        value={block.end}
        prefix={block.prefixLength}
      />

      <ResultRow
        withoutBinary
        label="Total Addresses"
        value={block.size}
        prefix={block.prefixLength}
      />
    </>
  );
}
