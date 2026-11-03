import { BrandLogo } from "@/components/brand/brand-logo";

const variants = [
  { id: "full", label: "آیکون و نام (زیر هم)", sizes: ["w-20", "w-32", "w-48"] },
  { id: "icon", label: "فقط آیکون", sizes: ["w-8", "w-12", "w-20"] },
  { id: "text", label: "فقط نام", sizes: ["w-20", "w-32", "w-48"] },
] as const;

/** Each logo follows the theme: regular in light, white in dark. */
export function BrandLogoGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {variants.map((variant) => (
        <div key={variant.id} className="flex flex-col gap-2">
          <span className="text-body-sm text-muted-foreground">{variant.label}</span>
          <div className="flex flex-wrap items-end gap-6 rounded-xl border border-border bg-card p-6">
            {variant.sizes.map((size) => (
              <BrandLogo
                key={size}
                variant={variant.id}
                alt={`لوگوی موشکاف، ${variant.label}`}
                className={size}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
