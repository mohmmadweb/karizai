"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAssignments, permissionMatrix, roleLabels, roleScopes, type AdminRole, type OrgUnit } from "../data/org";

const roles = Object.keys(roleLabels) as AdminRole[];

/** The three admin roles, what each may do, and who holds them. */
export function RolesTab({ units }: { units: OrgUnit[] }) {
  const [list, setList] = useState(getAssignments);
  const [person, setPerson] = useState("");
  const [role, setRole] = useState<AdminRole>("unit");
  const [unitId, setUnitId] = useState(units[1]?.id ?? "");
  const roleItems = roles.map((r) => ({ value: r, label: roleLabels[r] }));
  const unitItems = units.map((u) => ({ value: u.id, label: u.name }));
  const unitName = (id: string | null) => units.find((u) => u.id === id)?.name;

  function add() {
    if (!person.trim()) return toast.error("نام فرد را بنویسید.");
    setList((l) => [...l, { id: `ra-${Date.now()}`, person: person.trim(), role, unitId: role === "unit" ? unitId : null }]);
    setPerson("");
    toast.success("نقش داده شد.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table aria-label="دامنه‌ی هر نقش">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">توانایی</TableHead>
              {roles.map((r) => <TableHead key={r} className="px-4">{roleLabels[r]}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionMatrix.map((row) => (
              <TableRow key={row.capability} className="h-12">
                <TableCell className="px-4 font-medium">{row.capability}</TableCell>
                {roles.map((r) => <TableCell key={r} className="px-4">{row[r] === "—" ? <span className="text-muted-foreground">ندارد</span> : <Badge variant={row[r] === "کامل" ? "success" : row[r] === "واحد" ? "info" : "secondary"}>{row[r] === "واحد" ? "فقط واحد خود" : row[r]}</Badge>}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {roles.map((r) => (
          <Card key={r}>
            <CardHeader><CardTitle>{roleLabels[r]}</CardTitle><p className="text-body-sm text-muted-foreground">{roleScopes[r]}</p></CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y divide-border">
                {list.filter((a) => a.role === r).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-body-sm">
                    <span>{a.person}{a.unitId ? <span className="text-muted-foreground"> · {unitName(a.unitId)}</span> : null}</span>
                    <Button variant="ghost" size="icon-sm" aria-label={`گرفتن نقش از ${a.person}`} onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}><Trash2Icon aria-hidden /></Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <form noValidate onSubmit={(e) => { e.preventDefault(); add(); }} className="flex flex-wrap items-end gap-3 rounded-xl border border-border p-4">
        <label className="flex flex-col gap-1 text-label">فرد<Input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="مثلاً سارا کریمی" className="w-48" /></label>
        <label className="flex flex-col gap-1 text-label">نقش
          <Select items={roleItems} value={role} onValueChange={(v) => v && setRole(v as AdminRole)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{roleItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </label>
        {role === "unit" ? (
          <label className="flex flex-col gap-1 text-label">واحد
            <Select items={unitItems} value={unitId} onValueChange={(v) => v && setUnitId(v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{unitItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </label>
        ) : null}
        <Button type="submit"><PlusIcon aria-hidden />دادن نقش</Button>
      </form>
    </div>
  );
}
