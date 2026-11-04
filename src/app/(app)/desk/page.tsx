import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { DeskPageContent } from "@/features/desk/components/desk-page-content";

export const metadata: Metadata = { title: "میز کار | کاریز" };

/** The desk shows today's date and events, so it is built on each visit, not at build time. */
async function Today() {
  await connection();
  return <DeskPageContent />;
}

export default function DeskPage() {
  return <Suspense fallback={null}><Today /></Suspense>;
}
