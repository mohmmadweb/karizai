import type { ReactNode } from "react";

type PreviewSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** Titled block used by every part of the design-system reference page. */
export function PreviewSection({
  id,
  title,
  children,
}: PreviewSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-6 flex-col gap-6"
    >
      <div className="flex flex-col gap-1 border-b border-border pb-3">
        <h2 id={`${id}-title`} className="text-h3 text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function PreviewGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label text-foreground">{title}</h3>
      {children}
    </div>
  );
}
