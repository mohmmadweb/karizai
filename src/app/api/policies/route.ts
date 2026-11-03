import { readPolicies } from "@/server/provider-store";

/** Policies the admin saved. Read-only here. */
export async function GET() {
  return Response.json({ policies: await readPolicies() });
}
