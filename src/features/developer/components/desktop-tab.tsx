"use client";

import { useEffect, useState } from "react";
import { AppleIcon, DownloadIcon, MonitorIcon, TerminalIcon, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** The browser's install prompt (Chromium); not in the standard DOM types. */
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const platforms: { id: string; name: string; detail: string; icon: LucideIcon }[] = [
  { id: "windows", name: "Windows", detail: "ویندوز ۱۰ و ۱۱ · نصب‌کننده‌ی MSI برای استقرار با Group Policy", icon: MonitorIcon },
  { id: "macos", name: "macOS", detail: "macOS 13 به بعد · Apple Silicon و Intel", icon: AppleIcon },
  { id: "linux", name: "Linux", detail: "بسته‌های deb و AppImage", icon: TerminalIcon },
];

/** Desktop apps (coming) and installing Kariz as an app from the browser now. */
export function DesktopTab() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) {
      toast.info("نصب از منوی مرورگر", { description: "در Chrome یا Edge از منوی ⋮ گزینه‌ی «نصب کاریز» و در Safari «افزودن به صفحه‌ی اصلی» را بزنید." });
      return;
    }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setPrompt(null);
    if (choice.outcome === "accepted") toast.success("کاریز به‌عنوان اپ نصب شد.");
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">نصب به‌عنوان اپ{installed ? <Badge variant="success">نصب شده</Badge> : null}</CardTitle>
          <CardDescription>کاریز را همین حالا از مرورگر مثل یک برنامه نصب کنید: پنجره‌ی جدا، آیکون در منوی شروع و نوار وظیفه.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => void install()} disabled={installed}><DownloadIcon aria-hidden />{installed ? "نصب شده است" : "نصب کاریز روی این دستگاه"}</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {platforms.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><item.icon className="size-5" aria-hidden />{item.name}<Badge variant="outline">به‌زودی</Badge></CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={() => toast.info(`اپ ${item.name} به‌زودی منتشر می‌شود.`, { description: "تا آن زمان از «نصب به‌عنوان اپ» استفاده کنید." })}><DownloadIcon aria-hidden />دریافت</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
