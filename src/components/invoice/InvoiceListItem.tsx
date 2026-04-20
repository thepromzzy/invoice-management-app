import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Invoice } from "@/types/invoice";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/invoice-utils";

interface InvoiceListItemProps {
  invoice: Invoice;
}

export function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="group block rounded-lg border border-transparent bg-card shadow-card transition-all hover:border-primary focus-visible:outline-none focus-visible:border-primary"
      aria-label={`Open invoice ${invoice.id}`}
    >
      {/* Mobile layout */}
      <div className="grid grid-cols-2 gap-4 p-6 md:hidden">
        <p className="text-sm font-bold">
          <span className="text-muted-foreground">#</span>
          {invoice.id}
        </p>
        <p className="justify-self-end text-sm text-muted-foreground">{invoice.clientName}</p>
        <div>
          <p className="text-xs text-muted-foreground">Due {format(new Date(invoice.paymentDue), "dd MMM yyyy")}</p>
          <p className="mt-2 text-base font-bold">{formatCurrency(invoice.total)}</p>
        </div>
        <div className="justify-self-end self-end">
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid items-center gap-4 px-8 py-5 md:grid-cols-[100px_140px_1fr_120px_120px_16px]">
        <p className="text-sm font-bold">
          <span className="text-muted-foreground">#</span>
          {invoice.id}
        </p>
        <p className="text-sm text-muted-foreground">
          Due {format(new Date(invoice.paymentDue), "dd MMM yyyy")}
        </p>
        <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
        <p className="text-base font-bold">{formatCurrency(invoice.total)}</p>
        <StatusBadge status={invoice.status} />
        <ChevronRight className="h-3 w-3 text-primary" />
      </div>
    </Link>
  );
}
