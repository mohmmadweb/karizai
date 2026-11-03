import { InboxIcon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSection } from "@/components/shared/form-section";
import { PageHeader } from "@/components/shared/page-header";
import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AccessGrantsDemo } from "./access-grants-demo";
import { PreviewGroup, PreviewSection } from "./preview-section";
import { SearchFieldDemo } from "./search-field-demo";

export function PagePatternsSection() {
  return (
    <PreviewSection
      id="page-patterns"
      title="الگوهای صفحه"
    >
      <PreviewGroup title="سرصفحه (PageHeader)">
        <div className="rounded-xl border border-border bg-card p-4">
          <PageHeader
            title="عنوان صفحه"
            action={
              <Button>
                <PlusIcon data-icon="inline-start" />
                اقدام اصلی
              </Button>
            }
          />
        </div>
      </PreviewGroup>
      <PreviewGroup title="بخش فرم (FormSection)">
        <div className="rounded-xl border border-border bg-card p-4">
          <FormSection
            title="عنوان گروه"
            description="فیلدهای مرتبط با هم کنار هم قرار می‌گیرند."
            actions={
              <>
                <Button>ذخیره</Button>
                <Button variant="outline">انصراف</Button>
              </>
            }
          >
            <Field>
              <FieldLabel htmlFor="pp-first">فیلد اول</FieldLabel>
              <Input id="pp-first" />
            </Field>
            <Field>
              <FieldLabel htmlFor="pp-second">فیلد دوم</FieldLabel>
              <Input id="pp-second" />
            </Field>
          </FormSection>
        </div>
      </PreviewGroup>
      <PreviewGroup title="صفحه‌ی خالی (EmptyState)">
        <div className="rounded-xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<InboxIcon />}
            title="هنوز چیزی اینجا نیست"
            description="با اقدام زیر می‌توانید اولین مورد را اضافه کنید."
            action={<Button>اقدام بعدی</Button>}
          />
        </div>
      </PreviewGroup>
      <PreviewGroup title="جست‌وجو و رمز عبور (SearchField، PasswordField)">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <SearchFieldDemo />
          <Field>
            <FieldLabel htmlFor="pp-password">رمز عبور</FieldLabel>
            <PasswordField id="pp-password" />
          </Field>
        </div>
      </PreviewGroup>
      <PreviewGroup title="تعیین دسترسی (AccessGrantsPanel)">
        <div className="rounded-xl border border-border bg-card p-4">
          <AccessGrantsDemo />
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}
