import { readRouters } from "@/server/provider-store";

/** Smart routers the admin set up; the browser keeps only those that apply to the user's groups. */
export async function GET() {
  return Response.json({ routers: await readRouters() });
}
