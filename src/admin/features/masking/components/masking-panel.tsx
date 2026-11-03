"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { usePolicies, type MaskField } from "@/lib/policy-store";
import { Button } from "@/components/ui/button";
import { MaskTester } from "./mask-tester";
import { RuleDialog, type RuleInput } from "./rule-dialog";
import { RulesTable } from "./rules-table";

/** Masking rules (shared with the user chat through the policy store) and the test box. */
export function MaskingPanel() {
  const { maskFields, setMaskFields } = usePolicies();
  const [editing, setEditing] = useState<MaskField | "new" | null>(null);

  function save(input: RuleInput) {
    if (editing === "new") {
      const next = Math.max(0, ...maskFields.map((f) => Number(f.id.replace(/\D/g, "")) || 0)) + 1;
      setMaskFields((list) => [...list, { ...input, id: `mask-${next}`, enabled: true }]);
      toast.success("قاعده اضافه شد.");
    } else if (editing) {
      const id = editing.id;
      setMaskFields((list) => list.map((f) => (f.id === id ? { ...f, ...input } : f)));
      toast.success("قاعده به‌روز شد.");
    }
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4" aria-labelledby="mask-rules-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="mask-rules-title" className="text-h4">قاعده‌های پوشاندن</h2>
            <p className="text-body-sm text-muted-foreground">پیش از هر درخواست به مدل بیرونی، این داده‌ها در متن پیدا و پوشانده می‌شوند.</p>
          </div>
          <Button onClick={() => setEditing("new")}>
            <PlusIcon aria-hidden />
            افزودن قاعده
          </Button>
        </div>
        <RulesTable
          rules={maskFields}
          onEdit={setEditing}
          onDelete={(rule) => {
            setMaskFields((list) => list.filter((f) => f.id !== rule.id));
            toast.success("قاعده حذف شد.");
          }}
          onEnabledChange={(rule, enabled) => setMaskFields((list) => list.map((f) => (f.id === rule.id ? { ...f, enabled } : f)))}
        />
      </section>
      <MaskTester />
      <RuleDialog
        open={editing !== null}
        rule={editing === "new" || editing === null ? undefined : editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={save}
      />
    </div>
  );
}
