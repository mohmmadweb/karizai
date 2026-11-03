import { useId, type ReactNode } from "react";

type Props = { title: string; description?: string; action?: ReactNode; children: ReactNode };

/** One titled block of the dashboard. */
export function DashboardSection({ title, description, action, children }: Props) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={id} className="text-h3 text-foreground">{title}</h2>
          {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
