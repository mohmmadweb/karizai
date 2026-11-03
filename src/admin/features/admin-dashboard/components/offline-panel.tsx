import { GlobeIcon, WifiOffIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const unavailable = ["مدل‌های بیرونی", "وب‌سرچ", "ابزارهای بیرونی"];
const working = ["ورود", "دسترسی‌ها", "لاگ", "پنل مدیریت", "چت با مدل‌های سلف‌هاست"];

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-1">
    <p className="font-medium text-foreground">{title}</p>
    <ul className="list-disc ps-5 text-foreground">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </div>
);

/** Online: a small badge. Offline: what stops and what keeps working. */
export function OfflinePanel({ offline }: { offline: boolean }) {
  if (!offline) {
    return (
      <div>
        <Badge variant="success"><GlobeIcon aria-hidden />اینترنت بین‌الملل وصل است</Badge>
      </div>
    );
  }
  return (
    <Alert variant="warning">
      <WifiOffIcon aria-hidden />
      <AlertTitle>اینترنت بین‌الملل قطع است و سامانه با مدل‌های داخلی کار می‌کند</AlertTitle>
      <AlertDescription className="mt-2 grid gap-4 sm:grid-cols-2">
        <List title="فعلاً در دسترس نیست" items={unavailable} />
        <List title="کار می‌کند" items={working} />
      </AlertDescription>
    </Alert>
  );
}
