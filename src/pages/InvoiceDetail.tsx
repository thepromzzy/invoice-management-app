import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/invoice/AppShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { DeleteInvoiceDialog } from "@/components/invoice/DeleteInvoiceDialog";
import { InvoiceFormSheet } from "@/components/invoice/InvoiceFormSheet";
import { useInvoices } from "@/hooks/use-invoices";
import { formatCurrency } from "@/lib/invoice-utils";

const InvoiceDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, update, remove, markAsPaid } = useInvoices();
  const invoice = invoices.find((i) => i.id === id);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!invoice) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Invoice not found</h1>
          <p className="mt-2 text-muted-foreground">It may have been deleted.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back to invoices</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const canEdit = true;
  const canMarkPaid = invoice.status === "pending";

  return (
    <AppShell>
      <Link
        to="/"
        className="group inline-flex items-center gap-4 text-sm font-bold transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
      >
        <ChevronLeft className="h-3 w-3 text-primary" />
        Go back
      </Link>

      {/* Status + actions bar */}
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg bg-card p-6 shadow-card">
        <div className="flex flex-1 items-center gap-5">
          <span className="text-sm text-muted-foreground">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {canEdit && (
            <Button variant="secondary" className="rounded-full" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
          )}
          <Button variant="destructive" className="rounded-full" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
          {canMarkPaid && (
            <Button className="rounded-full" onClick={() => markAsPaid(invoice.id)}>
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <article className="mt-4 rounded-lg bg-card p-6 shadow-card md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-base font-bold">
              <span className="text-muted-foreground">#</span>
              {invoice.id}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{invoice.description || "—"}</p>
          </div>
          <address className="not-italic text-sm text-muted-foreground md:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 md:mt-12 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Invoice Date</p>
            <p className="mt-3 text-base font-bold">{format(new Date(invoice.createdAt), "dd MMM yyyy")}</p>
            <p className="mt-8 text-xs text-muted-foreground">Payment Due</p>
            <p className="mt-3 text-base font-bold">{format(new Date(invoice.paymentDue), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bill To</p>
            <p className="mt-3 text-base font-bold">{invoice.clientName || "—"}</p>
            <address className="not-italic mt-2 text-sm text-muted-foreground">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-muted-foreground">Sent to</p>
            <p className="mt-3 text-base font-bold break-all">{invoice.clientEmail || "—"}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-10 overflow-hidden rounded-t-lg bg-muted">
          {/* Desktop */}
          <table className="hidden w-full md:table">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-8 py-8 font-normal">Item Name</th>
                <th className="py-8 text-center font-normal">QTY.</th>
                <th className="py-8 text-right font-normal">Price</th>
                <th className="px-8 py-8 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="text-sm font-bold">
                  <td className="px-8 pb-8">{item.name}</td>
                  <td className="pb-8 text-center text-muted-foreground">{item.quantity}</td>
                  <td className="pb-8 text-right text-muted-foreground">{formatCurrency(item.price)}</td>
                  <td className="px-8 pb-8 text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="mt-2 text-sm font-bold text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-b-lg bg-total-bar p-6 text-total-bar-foreground md:px-8 md:py-6">
          <p className="text-xs">Amount Due</p>
          <p className="text-xl font-bold md:text-2xl">{formatCurrency(invoice.total)}</p>
        </div>
      </article>

      {/* Mobile sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-end gap-2 border-t border-border bg-card p-5 md:hidden">
        {canEdit && (
          <Button variant="secondary" className="rounded-full" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        )}
        <Button variant="destructive" className="rounded-full" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
        {canMarkPaid && (
          <Button className="rounded-full" onClick={() => markAsPaid(invoice.id)}>
            Mark as Paid
          </Button>
        )}
      </div>

      <DeleteInvoiceDialog
        invoiceId={invoice.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          remove(invoice.id);
          navigate("/");
        }}
      />

      <InvoiceFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        invoice={invoice}
        mode="edit"
        onSubmit={(updated) => update(invoice.id, updated)}
      />
    </AppShell>
  );
};

export default InvoiceDetail;
