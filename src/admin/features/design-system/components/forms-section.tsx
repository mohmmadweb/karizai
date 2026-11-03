import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSelectOptions } from "../data/reference";
import { SearchableSelectDemo } from "./searchable-select-demo";
import { FormChoiceControls } from "./form-choice-controls";
import { PreviewGroup, PreviewSection } from "./preview-section";

function SelectDemo({ id, disabled, invalid }: { id: string; disabled?: boolean; invalid?: boolean }) {
  return (
    <Select items={getSelectOptions()} disabled={disabled}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder="انتخاب کنید" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {getSelectOptions().map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function FormsSection() {
  return (
    <PreviewSection
      id="forms"
      title="فرم‌ها"
    >
      <PreviewGroup title="کنترل‌های متنی و انتخاب">
        <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-6">
          <Field>
            <FieldLabel htmlFor="ds-input">برچسب (اختیاری)</FieldLabel>
            <Input id="ds-input" placeholder="مثال: متن نمونه" />
            <FieldDescription>راهنمای کوتاه زیر کنترل.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-focus">حالت فوکوس</FieldLabel>
            <Input id="ds-focus" defaultValue="مقدار نمونه" className="border-ring ring-3 ring-ring/50" />
            <FieldDescription>همان حلقه‌ی فوکوس مشترک.</FieldDescription>
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ds-disabled">غیرفعال</FieldLabel>
            <Input id="ds-disabled" disabled defaultValue="مقدار نمونه" />
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="ds-invalid">نامعتبر</FieldLabel>
            <Input id="ds-invalid" aria-invalid defaultValue="مقدار نادرست" />
            <FieldError>مقدار واردشده درست نیست. لطفاً دوباره بررسی کنید.</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-ltr">ایمیل (متن لاتین)</FieldLabel>
            <Input id="ds-ltr" type="email" dir="ltr" className="text-start" placeholder="name@example.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-select">انتخاب از فهرست</FieldLabel>
            <SelectDemo id="ds-select" />
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-select-search">انتخاب با جست‌وجو</FieldLabel>
            <SearchableSelectDemo id="ds-select-search" />
            <FieldDescription>برای فهرست‌های بلند؛ زیر یا بالای کنترل بسته به فضا باز می‌شود.</FieldDescription>
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ds-select-disabled">انتخاب غیرفعال</FieldLabel>
            <SelectDemo id="ds-select-disabled" disabled />
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="ds-select-invalid">انتخاب نامعتبر</FieldLabel>
            <SelectDemo id="ds-select-invalid" invalid />
            <FieldError>یکی از گزینه‌ها را انتخاب کنید.</FieldError>
          </Field>
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="ds-textarea">متن چندخطی</FieldLabel>
            <Textarea id="ds-textarea" placeholder="مثال: توضیح نمونه" />
          </Field>
        </FieldGroup>
      </PreviewGroup>
      <FormChoiceControls />
    </PreviewSection>
  );
}
