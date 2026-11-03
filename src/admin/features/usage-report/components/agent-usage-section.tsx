"use client";

import { useMemo } from "react";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { getReportNow, getUsageRecords } from "../data/usage-records";
import { bindToModels, inRange, rowsByAgent } from "../lib/aggregate";
import { resolvePeriod } from "../lib/periods";
import { BreakdownTable } from "./breakdown-table";

/** Usage and cost per agent this month, as a standalone block (for example on the dashboard). */
export function AgentUsageSection() {
  const { users, groups, memberships } = useDirectory();
  const { models, providers } = useModels();
  const rows = useMemo(() => {
    const range = resolvePeriod("month", { from: "", to: "" }, getReportNow())!;
    const records = inRange(bindToModels(getUsageRecords(), models), range);
    return rowsByAgent(records, { users, groups, memberships, models, providers });
  }, [users, groups, memberships, models, providers]);
  return <BreakdownTable view="agent" rows={rows} unpricedCount={0} />;
}
