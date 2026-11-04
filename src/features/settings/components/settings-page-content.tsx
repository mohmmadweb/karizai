"use client";

import { useState } from "react";
import { FormSection } from "@/components/shared/form-section";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Account } from "@/features/user-session/types";
import { AppearanceSection } from "./appearance-section";
import { PasswordForm } from "./password-form";

export function SettingsPageContent({ account }: { account: Account }) {
  const [style, setStyle] = useState("short");

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="تنظیمات" description="اطلاعات حساب، ظاهر پنل و ترجیح‌های شما." />
      <FormSection title="حساب کاربری" description="این اطلاعات را مدیر سازمان تعیین می‌کند.">
        <dl className="grid gap-3 text-body md:col-span-2">
          <div className="flex gap-2"><dt className="text-muted-foreground">نام:</dt><dd>{account.name}</dd></div>
          <div className="flex gap-2"><dt className="text-muted-foreground">ایمیل:</dt><dd dir="ltr">{account.email}</dd></div>
          <div className="flex flex-wrap items-center gap-2"><dt className="text-muted-foreground">گروه‌ها:</dt><dd className="flex flex-wrap gap-1">{account.groups.map((group) => <Badge key={group} variant="secondary">{group}</Badge>)}</dd></div>
        </dl>
      </FormSection>
      <FormSection title="رمز عبور">
        <div className="md:col-span-2">
          {account.authType === "local" ? <PasswordForm /> : <Alert><AlertDescription>حساب شما با ورود یکپارچه‌ی سازمان (SSO) ساخته شده است. رمز عبور را از همان روش سازمان تغییر دهید.</AlertDescription></Alert>}
        </div>
      </FormSection>
      <AppearanceSection />
      <FormSection title="ترجیح پاسخ" description="طول پاسخ‌ها را دلخواه خود تنظیم کنید.">
        <div className="flex flex-col gap-3 md:col-span-2">
          <RadioGroup value={style} onValueChange={setStyle} aria-label="طول پاسخ">
            <div className="flex items-center gap-2"><RadioGroupItem id="style-short" value="short" /><Label htmlFor="style-short">کوتاه</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem id="style-long" value="long" /><Label htmlFor="style-long">مفصل</Label></div>
          </RadioGroup>
          <p className="text-body-sm text-muted-foreground">این ترجیح بر قواعد سازمان و دستورالعمل عامل اولویت ندارد.</p>
        </div>
      </FormSection>
      <FormSection title="حریم خصوصی">
        <div className="flex flex-col gap-2 text-body md:col-span-2">
          <p>ادمین سازمان، طبق سیاست سازمان، به متن گفتگوها و لاگ‌ها دسترسی دارد.</p>
          <p>حذف یک گفتگو از فهرست شخصی شما، نسخه‌ی ثبت‌شده برای ممیزی را پاک نمی‌کند.</p>
        </div>
      </FormSection>
    </div>
  );
}
