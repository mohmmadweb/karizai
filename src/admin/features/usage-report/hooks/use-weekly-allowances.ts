"use client";

import { useMemo } from "react";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { usePolicies } from "@/admin/features/policies/components/policies-provider";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { getReportNow, getUsageRecords } from "../data/usage-records";
import { bindToModels, inRange, rowsByGroup } from "../lib/aggregate";
import { buildAllowances, type AllowanceLine } from "../lib/allowance";
import { resolvePeriod } from "../lib/periods";

/** This week's ceiling, spending and remainder of every active group, as the dashboard shows them. */
export function useWeeklyAllowances(): AllowanceLine[] {
  const { users, groups, memberships } = useDirectory();
  const { models, providers } = useModels();
  const { policies } = usePolicies();
  return useMemo(() => {
    const week = resolvePeriod("week", { from: "", to: "" }, getReportNow())!;
    const records = inRange(bindToModels(getUsageRecords(), models), week);
    const rows = rowsByGroup(records, { users, groups, memberships, models, providers });
    return buildAllowances(groups, rows, policies.weeklyLimits);
  }, [users, groups, memberships, models, providers, policies.weeklyLimits]);
}
