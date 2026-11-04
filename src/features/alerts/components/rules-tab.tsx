"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { frequencyLabels, sensitivityLabels } from "../data/alerts";
import type { AlertRule } from "../types";
import { useAlerts } from "./alerts-provider";
import { RuleDialog } from "./rule-dialog";

/** The list of alert rules with the form to add or change one. */
export function RulesTab() {
  const { rules, saveRule, removeRule } = useAlerts();
  const [editing, setEditing] = useState<AlertRule | "new" | null>(null);
  return (
    <section aria-label="قواعد هشدار" className="flex min-w-0 flex-col gap-4">
      <div className="flex justify-end"><Button type="button" onClick={() => setEditing("new")}><PlusIcon aria-hidden />هشدار تازه</Button></div>
      {rules.length === 0 ? (
        <EmptyState title="هنوز هشداری تعریف نشده" description="برای داده‌ای که مهم است یک هشدار بسازید تا رفتار غیرعادی آن را بدون پرسیدن خبر بگیرید." />
      ) : (
        <Table>
          <TableHeader><TableRow><TableHead>هشدار</TableHead><TableHead>حساسیت</TableHead><TableHead>گیرنده</TableHead><TableHead>تناوب</TableHead><TableHead>فعال</TableHead><TableHead><span className="sr-only">عملیات</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell><span className="block text-label">{rule.name}</span><span className="text-caption text-muted-foreground">{rule.metric}</span></TableCell>
                <TableCell><Badge variant={rule.sensitivity === "high" ? "warning" : "secondary"}>{sensitivityLabels[rule.sensitivity]}</Badge></TableCell>
                <TableCell>{rule.recipient}</TableCell>
                <TableCell>{frequencyLabels[rule.frequency]}</TableCell>
                <TableCell><Switch checked={rule.enabled} aria-label={`فعال بودن «${rule.name}»`} onCheckedChange={(enabled) => saveRule({ ...rule, enabled })} /></TableCell>
                <TableCell>
                  <span className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" aria-label={`ویرایش «${rule.name}»`} onClick={() => setEditing(rule)}><PencilIcon aria-hidden /></Button>
                    <Button type="button" variant="ghost" size="icon" aria-label={`حذف «${rule.name}»`} onClick={() => removeRule(rule.id)}><Trash2Icon aria-hidden /></Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <RuleDialog open={editing !== null} rule={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={saveRule} />
    </section>
  );
}
