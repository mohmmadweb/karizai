import { sdkExamples } from "../lib/snippets";
import { CodeBlock } from "./code-block";

/** SDKs and sample code for the internal team or a contractor building on Kariz. */
export function SdkTab() {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">SDKها روی همان API نسخه‌ی ۱ ساخته شده‌اند: احراز هویت با کلید، تلاش دوباره‌ی خودکار، جریان پاسخ (stream) و تأیید امضای webhook. در جریان‌ها هم می‌توانید گام «کد یا اسکریپت» بگذارید.</p>
      {sdkExamples.map((item) => (
        <section key={item.id} className="flex flex-col gap-2 rounded-xl border p-4" aria-labelledby={`sdk-${item.id}`}>
          <h3 id={`sdk-${item.id}`} className="text-h4">{item.title}</h3>
          <CodeBlock code={item.install} label="دستور نصب" />
          <CodeBlock code={item.code} label={`نمونه‌کد ${item.title}`} />
        </section>
      ))}
    </div>
  );
}
