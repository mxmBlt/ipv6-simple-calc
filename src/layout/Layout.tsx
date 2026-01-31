import type { ReactNode } from "react";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <main className="ipv6-calculator">
      <header>
        <h1>{title}</h1>
      </header>
      {children}
    </main>
  );
}
