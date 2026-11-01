import type { ReactNode } from "react";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Fields for this group. One column on phones, two at most when wide. */
  children: ReactNode;
  /** Optional action group, for example save and cancel buttons. */
  actions?: ReactNode;
  className?: string;
};

/** A titled group of related fields with an optional action row. */
export function FormSection({
  title,
  description,
  children,
  actions,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-6 border-b border-border pb-8 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 text-foreground">{title}</h2>
        {description ? (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-6">
        <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-4">{children}</FieldGroup>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
