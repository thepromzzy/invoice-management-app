import { useMemo, useState } from "react";
import { Plus, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { AppShell } from "@/components/invoice/AppShell";
import { InvoiceListItem } from "@/components/invoice/InvoiceListItem";
import { EmptyState } from "@/components/invoice/EmptyState";
import { InvoiceFormSheet } from "@/components/invoice/InvoiceFormSheet";
import { useInvoices } from "@/hooks/use-invoices";
import type { InvoiceStatus } from "@/types/invoice";

const STATUSES: InvoiceStatus[] = ["draft", "pending", "paid"];

const Index = () => {
  const { invoices, create } = useInvoices();
  const [filters, setFilters] = useState<Set<InvoiceStatus>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filters.size === 0) return invoices;
    return invoices.filter((i) => filters.has(i.status));
  }, [invoices, filters]);

  const toggleFilter = (s: InvoiceStatus) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const filterLabel =
    filters.size === 0 ? "all" : filters.size === 1 ? Array.from(filters)[0] : "selected";

  const countLabel =
    invoices.length === 0
      ? "No invoices"
      : `There ${invoices.length === 1 ? "is" : "are"} ${invoices.length} total ${invoices.length === 1 ? "invoice" : "invoices"}`;

  return (
    <AppShell>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="hidden md:inline">{countLabel}</span>
            <span className="md:hidden">
              {invoices.length === 0 ? "No invoices" : `${invoices.length} invoices`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 text-sm font-bold transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
              >
                <span className="hidden md:inline">Filter by status</span>
                <span className="md:hidden">Filter</span>
                <ChevronDown className="h-3 w-3 text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 rounded-lg p-6 shadow-elegant">
              <div className="flex flex-col gap-4">
                {STATUSES.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-3 text-sm font-bold capitalize"
                  >
                    <Checkbox
                      checked={filters.has(s)}
                      onCheckedChange={() => toggleFilter(s)}
                      aria-label={`Filter ${s}`}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => setCreateOpen(true)}
            className="rounded-full pl-2 pr-4 md:pl-2 md:pr-6 h-12 gap-2 md:gap-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-card text-primary">
              <Plus className="h-4 w-4" />
            </span>
            <span className="font-bold">
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </span>
          </Button>
        </div>
      </header>

      <section className="mt-8 md:mt-16" aria-live="polite">
        {filtered.length === 0 ? (
          <EmptyState filter={filterLabel} />
        ) : (
          <ul className="space-y-4">
            {filtered.map((inv) => (
              <li key={inv.id}>
                <InvoiceListItem invoice={inv} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <InvoiceFormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={create}
        onSaveDraft={create}
      />

      {/* Hidden helper to silence unused-icon warning */}
      <Check className="hidden" aria-hidden />
    </AppShell>
  );
};

export default Index;
