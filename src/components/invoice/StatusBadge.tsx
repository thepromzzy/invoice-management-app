import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  draft: "Draft",
};

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  paid: "bg-status-paid-bg text-status-paid",
  pending: "bg-status-pending-bg text-status-pending",
  draft: "bg-status-draft-bg text-status-draft",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold min-w-[104px] justify-center",
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "paid" && "bg-status-paid",
          status === "pending" && "bg-status-pending",
          status === "draft" && "bg-status-draft",
        )}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
