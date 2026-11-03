import { redirect } from "next/navigation";

/** The usage report now lives inside the dashboard. */
export default function UsagePage() {
  redirect("/admin/dashboard");
}
