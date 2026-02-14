import { ResultRow } from "./ResultRow";
import type { IPv6Result } from "../utils/ipv6";

interface NetworkProps {
  result: IPv6Result;
  prefix: number; // mask1
  subPrefix?: number; // mask2 (optionnel)
}

export function Network({ result, prefix, subPrefix }: NetworkProps) {
  const block = result.mainBlock;

  return (
    <>
      <ResultRow
        label="Network Address"
        value={block.network}
        mask1={prefix}
        mask2={subPrefix}
      />

      <ResultRow
        label="Netmask Address"
        value={block.netmask}
        mask1={prefix}
        mask2={subPrefix}
      />

      <ResultRow
        label="Start Address"
        value={block.start}
        mask1={prefix}
        mask2={subPrefix}
      />

      <ResultRow
        label="End Address"
        value={block.end}
        mask1={prefix}
        mask2={subPrefix}
      />

      <ResultRow
        withoutBinary
        label="Total Hosts"
        value={block.size}
        mask1={prefix}
        mask2={subPrefix}
      />
    </>
  );
}
