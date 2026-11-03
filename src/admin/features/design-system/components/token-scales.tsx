import {
  getRadii,
  getShadows,
  getSpacingScale,
  getTypeRoles,
} from "../data/tokens";
import { PreviewGroup } from "./preview-section";

export function TokenScales() {
  return (
    <>
      <PreviewGroup title="نقش‌های متن (اندازه/ارتفاع خط · وزن)">
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {getTypeRoles().map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className={`${role.className} min-w-0 truncate`}>
                {role.label}
              </span>
              <span className="shrink-0 text-caption text-muted-foreground">
                {role.spec}
              </span>
            </div>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="فاصله‌ها (واحد پایه ۴px)">
        <div className="flex flex-col gap-2">
          {getSpacingScale().map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span
                dir="ltr"
                className="w-12 text-end text-caption text-muted-foreground"
              >
                {item.label}
              </span>
              <span
                className="h-3 rounded-sm bg-primary"
                style={{ width: item.value }}
              />
            </div>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="گوشه‌ها و حاشیه">
        <div className="flex flex-wrap gap-4">
          {getRadii().map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <span
                className="size-16 border border-border bg-accent"
                style={{ borderRadius: item.value }}
              />
              <span className="text-caption text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="سایه‌ها">
        <div className="grid gap-4 sm:grid-cols-3">
          {getShadows().map((item) => (
            <div
              key={item.id}
              className="flex h-20 items-center justify-center rounded-xl border border-border bg-card text-caption"
              style={{ boxShadow: item.value }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="حلقه فوکوس (برای همه‌ی کنترل‌ها یکسان)">
        <div className="flex h-10 w-fit items-center rounded-lg border border-ring bg-background px-4 text-body-sm ring-3 ring-ring/50">
          کنترل در حالت فوکوس
        </div>
      </PreviewGroup>
    </>
  );
}
