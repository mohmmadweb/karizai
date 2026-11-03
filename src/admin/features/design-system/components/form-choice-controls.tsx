import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { PreviewGroup } from "./preview-section";

export function FormChoiceControls() {
  return (
    <PreviewGroup title="چک‌باکس، گزینه‌ی تکی و سوئیچ">
      <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-6">
        <FieldSet>
          <FieldLegend variant="label">انتخاب مستقل</FieldLegend>
          <Field orientation="horizontal">
            <Checkbox id="ds-check-1" defaultChecked />
            <FieldLabel htmlFor="ds-check-1">انتخاب‌شده</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="ds-check-2" />
            <FieldLabel htmlFor="ds-check-2">انتخاب‌نشده</FieldLabel>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <Checkbox id="ds-check-3" disabled />
            <FieldLabel htmlFor="ds-check-3">غیرفعال</FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid="true">
            <Checkbox id="ds-check-4" aria-invalid />
            <FieldLabel htmlFor="ds-check-4">نامعتبر</FieldLabel>
          </Field>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">یک گزینه از چند گزینه</FieldLegend>
          <RadioGroup defaultValue="a">
            <Field orientation="horizontal">
              <RadioGroupItem id="ds-radio-a" value="a" />
              <FieldLabel htmlFor="ds-radio-a">گزینه اول</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem id="ds-radio-b" value="b" />
              <FieldLabel htmlFor="ds-radio-b">گزینه دوم</FieldLabel>
            </Field>
            <Field orientation="horizontal" data-disabled="true">
              <RadioGroupItem id="ds-radio-c" value="c" disabled />
              <FieldLabel htmlFor="ds-radio-c">غیرفعال</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Switch id="ds-switch-1" defaultChecked />
          <FieldLabel htmlFor="ds-switch-1">سوئیچ روشن</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-disabled="true">
          <Switch id="ds-switch-2" disabled />
          <FieldLabel htmlFor="ds-switch-2">سوئیچ غیرفعال</FieldLabel>
        </Field>
        <Field data-invalid="true">
          <FieldDescription>نمونه‌ی خطای گروه گزینه‌ها:</FieldDescription>
          <FieldError>حداقل یک گزینه را انتخاب کنید.</FieldError>
        </Field>
      </FieldGroup>
    </PreviewGroup>
  );
}
