"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiAnswer } from "../components/ai-answer";
import { AiButton } from "../components/ai-button";
import { AiBullets } from "../components/ai-parts";
import { categoryLabels } from "../data/news";
import { formatDay } from "../lib/jalali";
import type { NewsItem } from "../types";

/** One news item with «✦ خلاصه» and «✦ ترجمه انگلیسی» shown under it. */
export function NewsCard({ item }: { item: NewsItem }) {
  const [view, setView] = useState<{ kind: "summary" | "english"; key: number } | null>(null);
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap gap-1.5"><Badge variant="secondary">{categoryLabels[item.category]}</Badge>{item.draft ? <Badge variant="warning">پیش‌نویس</Badge> : null}</div>
        <CardTitle>{item.title}</CardTitle>
        <p className="text-caption text-muted-foreground">{formatDay(item.publishedAt)}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="line-clamp-3 text-body-sm text-muted-foreground">{item.body}</p>
        <div className="flex flex-wrap gap-2">
          <AiButton label="خلاصه" size="xs" onClick={() => setView({ kind: "summary", key: Date.now() })} />
          <AiButton label="ترجمه‌ی انگلیسی" size="xs" onClick={() => setView({ kind: "english", key: Date.now() })} />
        </div>
        {view ? (
          <AiAnswer key={view.key}>
            {view.kind === "summary" ? <AiBullets items={item.summary} /> : (
              <div dir="ltr" lang="en" className="flex flex-col gap-1 text-start"><p className="font-semibold">{item.english.title}</p><p>{item.english.body}</p></div>
            )}
          </AiAnswer>
        ) : null}
      </CardContent>
    </Card>
  );
}
