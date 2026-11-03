"use client";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sensitivities, sensitivityLabels, type DataSourceLevel, type PolicyModel, type Sensitivity } from "../types";

type Props = {
  sources: DataSourceLevel[];
  models: PolicyModel[];
  onLevelChange: (sourceId: string, level: Sensitivity) => void;
};

const levelItems = sensitivities.map((value) => ({ value, label: sensitivityLabels[value] }));

/** Models that may read data of this level, after the matrix and the on/off switch. */
export const allowedFor = (models: PolicyModel[], level: Sensitivity) =>
  models.filter((m) => m.enabled && m.allowed[level]);

/** Each data source has one level; the models it may reach follow from the matrix above. */
export function SourceLevels({ sources, models, onLevelChange }: Props) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="levels-title">
      <div className="flex flex-col gap-1">
        <h2 id="levels-title" className="text-h4">سطح محرمانگی منابع داده</h2>
        <p className="text-body-sm text-muted-foreground">
          هر پاسخی که از این منبع استفاده کند فقط به مدل‌های مجاز همان سطح می‌رود.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table aria-label="سطح محرمانگی منابع داده">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-label text-muted-foreground">منبع داده</TableHead>
              <TableHead className="h-11 px-4 text-label text-muted-foreground">سامانه</TableHead>
              <TableHead className="h-11 px-4 text-label text-muted-foreground">سطح</TableHead>
              <TableHead className="h-11 px-4 text-label text-muted-foreground">مدل‌های مجاز</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => {
              const allowed = allowedFor(models, source.level);
              return (
                <TableRow key={source.id} className="h-14">
                  <TableCell className="px-4 font-medium">{source.name}</TableCell>
                  <TableCell className="px-4 text-muted-foreground">{source.system}</TableCell>
                  <TableCell className="px-4">
                    <Select
                      items={levelItems}
                      value={source.level}
                      onValueChange={(v) => v && onLevelChange(source.id, v as Sensitivity)}
                    >
                      <SelectTrigger size="sm" className="w-32" aria-label={`سطح محرمانگی ${source.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {levelItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4">
                    {allowed.length === 0 ? (
                      <Badge variant="destructive">هیچ مدلی مجاز نیست</Badge>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {allowed.map((m) => (
                          <Badge key={m.id} variant="outline">
                            <bdi dir="ltr">{m.name}</bdi>
                          </Badge>
                        ))}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
