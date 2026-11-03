import type { ReactNode } from "react";

type Props = { title: string; description: string; children: ReactNode };

/** One titled block of the usage part of the dashboard. */
export function UsageBlock({ title, description, children }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3 text-foreground">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
