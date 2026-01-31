import { bigIntToBinary, bigIntToIPv6 } from "../utils/ipv6";

interface ResultRowProps {
  label: string;
  value: bigint;
  binary?: bigint;
  asDefinition?: boolean; // true for <dt>/<dd>, false for <span>
}

export function ResultRow({
  label,
  value,
  binary,
  asDefinition = false,
}: ResultRowProps) {
  if (asDefinition) {
    return (
      <div className="result-row">
        <dt className="label">{label}</dt>
        <dd className="value">{bigIntToIPv6(value)}</dd>
        {binary && <dd className="binary">{bigIntToBinary(binary)}</dd>}
      </div>
    );
  }

  return (
    <div className="result-row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {binary && <span className="binary">{bigIntToBinary(binary)}</span>}
    </div>
  );
}
