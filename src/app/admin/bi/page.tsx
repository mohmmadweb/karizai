import { redirect } from "next/navigation";

/** The BI dashboard now lives inside the main dashboard. */
export default function BiPage() {
  redirect("/admin/dashboard");
}
