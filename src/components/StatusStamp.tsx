import type { CSSProperties } from "react";
import type { ClaimStatus, ItemStatus } from "../api/client";

const tone: Record<ItemStatus | ClaimStatus, string> = {
  Recovered: "text-ok",
  "Awaiting Pickup": "text-pending",
  Claimed: "text-bad",
  Pending: "text-pending",
  Approved: "text-ok",
  Rejected: "text-bad",
};

// The rubber stamp re-plays its "thunk" whenever the status changes, because the key changes.
export default function StatusStamp({ status, delay }: { status: ItemStatus | ClaimStatus; delay?: string }) {
  return (
    <span key={status} className={`stamp shrink-0 ${tone[status]}`} style={delay ? ({ "--stamp-delay": delay } as CSSProperties) : undefined}>
      {status}
    </span>
  );
}
