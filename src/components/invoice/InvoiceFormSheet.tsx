import { Sheet, SheetContent } from "@/components/ui/sheet";
import { InvoiceForm } from "./InvoiceForm";
import type { Invoice } from "@/types/invoice";

interface InvoiceFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  mode: "create" | "edit";
  onSubmit: (invoice: Invoice) => void;
  onSaveDraft?: (invoice: Invoice) => void;
}

export function InvoiceFormSheet({ open, onOpenChange, invoice, mode, onSubmit, onSaveDraft }: InvoiceFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-xl md:max-w-2xl lg:left-[103px] lg:rounded-r-2xl p-0 flex flex-col bg-card"
      >
        <InvoiceForm
          mode={mode}
          invoice={invoice}
          onSubmit={(inv) => {
            onSubmit(inv);
            onOpenChange(false);
          }}
          onSaveDraft={
            onSaveDraft
              ? (inv) => {
                  onSaveDraft(inv);
                  onOpenChange(false);
                }
              : undefined
          }
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
