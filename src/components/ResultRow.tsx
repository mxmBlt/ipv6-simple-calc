import { bigIntToBinary, bigIntToIPv6, splitIPv6Binary } from "../utils/ipv6";

export interface ResultRowProps {
  label: string;
  value: bigint;
  mask1: number; // prefix principal
  mask2?: number; // prefix secondaire (optionnel)
  withoutBinary?: boolean;
}

export function ResultRow({
  label,
  value,
  mask1,
  mask2 = mask1,
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
  const { net, subnet, host } = splitIPv6Binary(binary, mask1, mask2);

  const showSubnet = mask2 !== mask1;
  const showHost = host.length > 0;

  // 👉 espace uniquement si des bits host existent
  const hostWithSpace = showHost ? " " + host : "";

  return (
    <div className="result-row">
      <dt className="label">{label}</dt>
      <dd className="value">{ipv6}</dd>

      <dd className="binary">
        <span className="net">{net}</span>
        {showSubnet && <span className="subnet">{subnet}</span>}
        {showHost && <span className="host">{hostWithSpace}</span>}
      </dd>
    </div>
  );
}
