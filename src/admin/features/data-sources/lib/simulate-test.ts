import { simulateRequest } from "@/lib/simulate-request";
import type { DataSource, TestResult } from "../types";

/**
 * Stand-in for trying a connection; no request is made. A host that starts
 * with `error.` fails, so the failure message can be seen.
 */
export async function simulateConnectionTest(
  source: Pick<DataSource, "host">,
): Promise<Exclude<TestResult, "untested">> {
  await simulateRequest(1200);
  return source.host.trim().toLowerCase().startsWith("error.") ? "failed" : "success";
}
