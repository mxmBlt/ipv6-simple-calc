import type { ReactNode } from "react";

interface ResultGridProps {
  title: string;
  children: ReactNode;
}

export function ResultGrid({ title, children }: ResultGridProps) {
  return (
    <section className="ipv6-results">
      <h2>{title}</h2>
      <div className="result-grid">{children}</div>
    </section>
  );
}
