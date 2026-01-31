import { ResultRow } from "./ResultRow";
import type { IPv6Result } from "../utils/ipv6";

interface NetworkProps {
  result: IPv6Result;
}

export function Network({ result }: NetworkProps) {
  const block = result.mainBlock;

  return (
    <>
      <ResultRow label="Network Address" value={block.network} />

      <ResultRow label="Start Address" value={block.start} />

      <ResultRow label="End Address" value={block.end} />

      <ResultRow withoutBinary label="Total Hosts" value={block.size} />
    </>
  );
}
