import { ContrastReading } from "./contrast-reading";
import { getChartIds, getColorPairs } from "../data/tokens";

export function TokenColorGrid() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {getColorPairs().map((pair) => {
          const isBorder = pair.target === 3;
          return (
            <div
              key={pair.id}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <div
                className="flex h-16 items-center justify-center text-label"
                style={{
                  background: `var(--${pair.background})`,
                  color: `var(--${isBorder ? "foreground" : pair.foreground})`,
                }}
              >
                {isBorder ? (
                  <span
                    className="h-8 w-24 rounded-md border-2"
                    style={{ borderColor: `var(--${pair.foreground})` }}
                  />
                ) : (
                  "متن نمونه"
                )}
              </div>
              <div className="flex flex-col gap-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label">{pair.label}</span>
                </div>
                <span dir="ltr" className="text-start text-caption text-muted-foreground">
                  {pair.foreground} / {pair.background}
                </span>
                <ContrastReading
                  background={pair.background}
                  foreground={pair.foreground}
                  target={pair.target}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label">نمودار (۱ تا ۵)</span>
        <div className="flex h-12 overflow-hidden rounded-lg border border-border">
          {getChartIds().map((n) => (
            <div
              key={n}
              className="flex-1"
              style={{ background: `var(--chart-${n})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
