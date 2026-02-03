"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HistoryPageContent from "./HistoryPageContent";

export default function HistoryPage() {
  return (
    <Suspense fallback={null}>
      <HistoryPageContent />
    </Suspense>
  );
}
