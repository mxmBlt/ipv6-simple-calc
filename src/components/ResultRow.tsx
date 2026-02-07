import {
  bigIntToBinary,
  bigIntToIPv6,
  splitBinaryForSubnet,
} from "../utils/ipv6";

interface ResultRowProps {
  label: string;
  value: bigint;
  prefix: number;
  withoutBinary?: boolean; // true for <dt>/<dd>, false for <span>
}

export function ResultRow({
  label,
  value,
  prefix,
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
  const binary = bigIntToBinary(value);
  const { networkPart, violetPart, redPart } = splitBinaryForSubnet(
    binary,
    prefix,
  );

  return (
    <div className="result-row">
      <dt className="label">{label}</dt>
      <dd className="value">{bigIntToIPv6(value)}</dd>
      <dd className="binary">
        <span>{networkPart}</span>
        <span className="green">{violetPart}</span>
        <span className="red">{redPart}</span>
      </dd>
    </div>
  );
}
