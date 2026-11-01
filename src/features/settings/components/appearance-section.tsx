"use client";

import { useEffect, useState } from "react";
import { FormSection } from "@/components/shared/form-section";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLayoutStyle } from "@/lib/use-layout-style";
import { useTheme } from "@/lib/use-theme";

type Mode = "light" | "dark" | "system";
const options: { value: Mode; label: string }[] = [
  { value: "light", label: "روشن" },
  { value: "dark", label: "تیره" },
  { value: "system", label: "پیروی از دستگاه" },
];

/** The light or dark choice and the panel design are temporary: a reload returns to the starting values. */
export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const { classic, setClassic } = useLayoutStyle();
  const [mode, setMode] = useState<Mode>(theme);

  useEffect(() => {
    if (mode !== "system") {
      setTheme(mode);
      return;
    }
    const query = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setTheme(query.matches ? "dark" : "light");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <FormSection title="ظاهر" description="طرح و حالت نمایش پنل را انتخاب کنید.">
      <div className="flex flex-col gap-6 md:col-span-2">
        <div className="flex flex-col gap-2">
          <p className="text-label">طرح پنل</p>
          <RadioGroup value={classic ? "classic" : "messenger"} onValueChange={(value) => setClassic(value === "classic")} aria-label="طرح پنل">
            <div className="flex items-center gap-2"><RadioGroupItem id="design-messenger" value="messenger" /><Label htmlFor="design-messenger">طرح جدید (هماهنگ با پیام‌رسان سازمانی)</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem id="design-classic" value="classic" /><Label htmlFor="design-classic">طرح قبلی</Label></div>
          </RadioGroup>
          <p className="text-body-sm text-muted-foreground">این انتخاب موقتی است و با باز کردن دوباره‌ی صفحه به طرح جدید برمی‌گردد.</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-label">حالت نمایش</p>
          <RadioGroup value={mode} onValueChange={(value) => setMode(value as Mode)} aria-label="حالت نمایش">
            {options.map((item) => (
              <div key={item.value} className="flex items-center gap-2">
                <RadioGroupItem id={`mode-${item.value}`} value={item.value} />
                <Label htmlFor={`mode-${item.value}`}>{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </FormSection>
  );
}
