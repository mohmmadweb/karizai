"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useDirectory } from "../../hooks/use-directory";
import { simulateRequest } from "@/lib/simulate-request";
import { validateGroupCode, validateGroupName } from "../../lib/validation";
import { useModelOptions } from "./group-models-picker";
import { GroupFields, type GroupFieldErrors, type GroupFieldValues } from "./group-fields";

function AddGroupForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { addGroup } = useDirectory();
  const { grant } = useAccess();
  const modelOptions = useModelOptions();
  const [modelIds, setModelIds] = useState<string[]>([]);
  const [values, setValues] = useState<GroupFieldValues>({ name: "", description: "", code: "" });
  const [errors, setErrors] = useState<GroupFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const name = validateGroupName(values.name);
    const code = validateGroupCode(values.code ?? "");
    setErrors({ name, code });
    if (name || code) return;
    setSubmitting(true);
    await simulateRequest();
    const result = addGroup({
      name: values.name,
      description: values.description,
      code: values.code ?? "",
    });
    setSubmitting(false);
    if (!result.ok) {
      setErrors(result.error.includes("کد") ? { code: result.error } : { name: result.error });
      return;
    }
    modelIds.forEach((resourceId) =>
      grant({ resourceType: "model", resourceId, subjectType: "group", subjectId: result.id }),
    );
    toast.success("گروه ساخته شد.");
    onCreated(result.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <GroupFields
          idPrefix="add-group"
          values={values}
          errors={errors}
          disabled={submitting}
          showCode
          onChange={setValues}
          onErrors={setErrors}
        />
        <Field>
          <FieldLabel htmlFor="add-group-models">دسترسی به مدل‌ها</FieldLabel>
          <SearchableMultiSelect
            id="add-group-models"
            items={modelOptions}
            value={modelIds}
            disabled={submitting || modelOptions.length === 0}
            onValueChange={setModelIds}
            placeholder="انتخاب مدل (اختیاری)"
            searchPlaceholder="جست‌وجوی مدل"
            emptyText="مدلی پیدا نشد."
          />
          <FieldDescription>
            {modelOptions.length === 0 ? "هنوز مدلی نیست." : "گروه همین حالا به مدل‌های انتخاب‌شده دسترسی می‌گیرد."}
          </FieldDescription>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" loading={submitting}>
          ساخت
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onClose}>
          انصراف
        </Button>
      </DialogFooter>
    </form>
  );
}

type AddGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
};

export function AddGroupDialog({ open, onOpenChange, onCreated }: AddGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ساخت گروه</DialogTitle>
          <DialogDescription>
            برای گروه تازه یک نام و یک کد بنویسید و در صورت نیاز مدل‌هایش را انتخاب کنید. اعضا را بعداً اضافه می‌کنید.
          </DialogDescription>
        </DialogHeader>
        <AddGroupForm onClose={() => onOpenChange(false)} onCreated={onCreated} />
      </DialogContent>
    </Dialog>
  );
}
