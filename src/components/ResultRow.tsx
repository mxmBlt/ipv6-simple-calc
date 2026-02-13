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
  const formattedDecimal = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const ipv6 = bigIntToIPv6(value);
  const exponent = 128 - mask2;
  if (withoutBinary) {
    return (
      <div className="result-row">
        <dt className="label">{label}</dt>
        <dd className="value">
          2<sup>(128-{mask2})</sup> = 2<sup>{exponent}</sup> ={" "}
          {formattedDecimal}
        </dd>
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
        <span className="magenta">{net}</span>
        {showSubnet && <span className="cyan">{subnet}</span>}
        {showHost && <span className="honey">{hostWithSpace}</span>}
      </dd>
    </div>
  );
}
