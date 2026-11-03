import { redirect } from "next/navigation";
import { getColleagues } from "@/features/messenger/data/colleagues";

/** The messenger opens on the first colleague's chat, not on a bot. */
export default function MessengerPage() {
  redirect(`/messenger/${getColleagues()[0].id}`);
}
