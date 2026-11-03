import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Stat = { label: string; value: string; hint?: string };

/** Row of summary numbers, the same look as the usage report. */
export function StatCards({ items }: { items: Stat[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-body-sm font-normal text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-h3 text-foreground tabular-nums">{item.value}</p>
              {item.hint ? <p className="text-caption text-muted-foreground">{item.hint}</p> : null}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
