interface ResultRowProps {
  label: string;
  value: string | number;
  binary?: string;
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
        <dd className="value">{value}</dd>
        {binary && <dd className="binary">{binary}</dd>}
      </div>
    );
  }

  return (
    <div className="result-row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {binary && <span className="binary">{binary}</span>}
    </div>
  );
}
