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
        label="Netmask Address"
        value={block.netmask}
        prefix={block.prefixLength}
      />
      <ResultRow
        label="Start Address"
        value={block.start}
        prefix={block.prefixLength}
      />

      <ResultRow
        label="End Address"
        value={block.end}
        prefix={block.prefixLength}
      />

      <ResultRow
        withoutBinary
        label="Total Hosts"
        value={block.size}
        prefix={block.prefixLength}
      />
    </>
  );
}
