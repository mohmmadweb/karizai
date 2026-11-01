import { readConnections } from "@/server/provider-store";

/** Connections the admin defined. The browser keeps only those open to the user's groups. */
export async function GET() {
  const connections = await readConnections();
  return Response.json({ connections: connections.filter((item) => item.active) });
}
