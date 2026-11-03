"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { budgetMessage, budgetText, parseBudget } from "../lib/budget-form";
import { usePolicies } from "./policies-provider";

/** Weekly ceiling in tomans for each active group; empty means no ceiling. */
export function BudgetTab() {
  const { groups } = useDirectory();
  const { policies, savePolicies, saving } = usePolicies();
  const active = groups.filter((g) => g.status === "active");
  const saved = (id: string) => budgetText(policies.weeklyLimits[id]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const value = (id: string) => draft[id] ?? saved(id);
  const unchanged = active.every((g) => value(g.id) === saved(g.id));

  async function save() {
    const found: Record<string, string | undefined> = {};
    const limits = { ...policies.weeklyLimits };
    for (const g of active) {
      const parsed = parseBudget(value(g.id));
      if (parsed === undefined) found[g.id] = budgetMessage;
      else limits[g.id] = parsed;
    }
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    if (await savePolicies({ ...policies, weeklyLimits: limits })) {
      setDraft({});
      toast.success("بودجه‌ی گروه‌ها ذخیره شد.");
    } else toast.error("ذخیره نشد؛ دوباره تلاش کنید.");
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        برای هر گروه سقف مصرف هفتگی را به تومان بنویسید؛ خالی یعنی بدون سقف. داشبورد باقی‌ماندهٔ هر گروه را با همین سقف نشان می‌دهد.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {active.map((g) => (
          <li key={g.id}>
            <Field data-invalid={errors[g.id] ? true : undefined}>
              <FieldLabel htmlFor={`budget-${g.id}`}>{g.name}</FieldLabel>
              <Input
                id={`budget-${g.id}`}
                inputMode="numeric"
                dir="ltr"
                className="text-start"
                placeholder="بدون سقف"
                value={value(g.id)}
                aria-invalid={errors[g.id] ? true : undefined}
                disabled={saving}
                onChange={(e) => {
                  setDraft((d) => ({ ...d, [g.id]: e.target.value }));
                  setErrors((x) => ({ ...x, [g.id]: undefined }));
                }}
              />
              <FieldDescription>سقف هفتگی (تومان)</FieldDescription>
              <FieldError>{errors[g.id]}</FieldError>
            </Field>
          </li>
        ))}
      </ul>
      <div><Button className="min-h-10" loading={saving} disabled={unchanged} onClick={save}>ذخیره</Button></div>
    </div>
  );
}
