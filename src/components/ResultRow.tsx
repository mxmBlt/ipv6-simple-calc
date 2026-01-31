import { bigIntToBinary, bigIntToIPv6 } from "../utils/ipv6";

interface ResultRowProps {
  label: string;
  value: bigint;
  withoutBinary?: boolean; // true for <dt>/<dd>, false for <span>
}

export function ResultRow({
  label,
  value,
  withoutBinary = false,
}: ResultRowProps) {
  if (withoutBinary) {
    return (
      <div className="result-row">
        <dt className="label">{label}</dt>
        <dd className="value">{value}</dd>
      </div>
    );
  }
  return (
    <div className="result-row">
      <dt className="label">{label}</dt>
      <dd className="value">{bigIntToIPv6(value)}</dd>
      <dd className="binary">{bigIntToBinary(value)}</dd>
    </div>
  );
}
