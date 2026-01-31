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
        asDefinition
        label="Network Address"
        value={block.network}
        binary={block.network}
      />

      <ResultRow
        asDefinition
        label="Start Address"
        value={block.start}
        binary={block.start}
      />

      <ResultRow
        asDefinition
        label="End Address"
        value={block.end}
        binary={block.end}
      />

      <ResultRow asDefinition label="Total Hosts" value={block.size} />
    </>
  );
}
