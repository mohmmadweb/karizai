import { CircleAlertIcon, CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatNumber } from "@/admin/lib/format";

type Props = {
  status: "healthy" | "slow" | "down";
  slow: number;
  down: number;
  unknown: number;
};

const content = {
  healthy: { title: "همه‌ی اجزا سالم‌اند", variant: "success", Icon: CircleCheckIcon },
  slow: { title: "برخی اجزا کند هستند", variant: "warning", Icon: TriangleAlertIcon },
  down: { title: "برخی اجزا قطع هستند", variant: "destructive", Icon: CircleAlertIcon },
} as const;

/** Overall state in words and an icon, never by color alone. */
export function StatusBanner({ status, slow, down, unknown }: Props) {
  const { title, variant, Icon } = content[status];
  const parts = [
    down > 0 ? `${formatNumber(down)} جزء قطع` : null,
    slow > 0 ? `${formatNumber(slow)} جزء کند` : null,
    unknown > 0 ? `${formatNumber(unknown)} جزء نامشخص` : null,
  ].filter(Boolean);
  return (
    <Alert variant={variant} role="status">
      <Icon aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      {parts.length > 0 ? <AlertDescription>{parts.join("، ")}</AlertDescription> : null}
    </Alert>
  );
}
