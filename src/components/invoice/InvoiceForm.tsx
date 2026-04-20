import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/invoice-schema";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { addDays, generateInvoiceId } from "@/lib/invoice-utils";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (invoice: Invoice) => void;
  onSaveDraft?: (invoice: Invoice) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}

const PAYMENT_TERMS = [1, 7, 14, 30];

const blankAddress = { street: "", city: "", postCode: "", country: "" };

export function InvoiceForm({ invoice, onSubmit, onSaveDraft, onCancel, mode }: InvoiceFormProps) {
  const defaults: InvoiceFormValues = useMemo(
    () => ({
      senderAddress: invoice?.senderAddress ?? blankAddress,
      clientName: invoice?.clientName ?? "",
      clientEmail: invoice?.clientEmail ?? "",
      clientAddress: invoice?.clientAddress ?? blankAddress,
      createdAt: invoice ? format(new Date(invoice.createdAt), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      paymentTerms: invoice?.paymentTerms ?? 30,
      description: invoice?.description ?? "",
      items: invoice?.items?.length
        ? invoice.items
        : [{ id: crypto.randomUUID(), name: "", quantity: 1, price: 0, total: 0 }],
    }),
    [invoice],
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaults,
    mode: "onSubmit",
  });

  const { register, control, handleSubmit, watch, setValue, formState, getValues, trigger, reset } = form;
  const { errors } = formState;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Recalculate item totals reactively.
  const watchedItems = watch("items");
  useEffect(() => {
    watchedItems?.forEach((item, index) => {
      const total = Number(item.quantity || 0) * Number(item.price || 0);
      if (item.total !== total) setValue(`items.${index}.total`, total, { shouldValidate: false });
    });
  }, [watchedItems, setValue]);

  const buildInvoice = (values: InvoiceFormValues, status: InvoiceStatus): Invoice => {
    const id = invoice?.id ?? generateInvoiceId();
    const createdAtIso = new Date(values.createdAt).toISOString();
    const items = values.items.map((it) => ({
      ...it,
      quantity: Number(it.quantity),
      price: Number(it.price),
      total: Number(it.quantity) * Number(it.price),
    }));
    const total = items.reduce((sum, it) => sum + it.total, 0);
    return {
      id,
      createdAt: createdAtIso,
      paymentDue: addDays(createdAtIso, Number(values.paymentTerms)),
      paymentTerms: Number(values.paymentTerms),
      description: values.description,
      status,
      clientName: values.clientName,
      clientEmail: values.clientEmail,
      senderAddress: values.senderAddress,
      clientAddress: values.clientAddress,
      items,
      total,
    };
  };

  const submitFinal = handleSubmit((values) => {
    const status: InvoiceStatus = invoice && invoice.status !== "draft" ? invoice.status : "pending";
    onSubmit(buildInvoice(values, status));
  });

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    // Drafts skip strict validation. Just trigger trim on required-ish basics.
    const values = getValues();
    onSaveDraft(buildInvoice(values, "draft"));
  };

  const itemError = (errors.items as unknown as { message?: string } | undefined)?.message;
  const hasAnyError = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={submitFinal}
      noValidate
      className="flex h-full flex-col"
    >
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10 md:px-12 md:pt-12">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "create" ? "New Invoice" : <>Edit <span className="text-muted-foreground">#</span>{invoice?.id}</>}
        </h2>

        {/* Bill From */}
        <fieldset className="mt-10">
          <legend className="text-sm font-bold text-primary">Bill From</legend>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField label="Street Address" error={errors.senderAddress?.street?.message} className="md:col-span-3">
              <Input {...register("senderAddress.street")} aria-invalid={!!errors.senderAddress?.street} />
            </FormField>
            <FormField label="City" error={errors.senderAddress?.city?.message}>
              <Input {...register("senderAddress.city")} aria-invalid={!!errors.senderAddress?.city} />
            </FormField>
            <FormField label="Post Code" error={errors.senderAddress?.postCode?.message}>
              <Input {...register("senderAddress.postCode")} aria-invalid={!!errors.senderAddress?.postCode} />
            </FormField>
            <FormField label="Country" error={errors.senderAddress?.country?.message}>
              <Input {...register("senderAddress.country")} aria-invalid={!!errors.senderAddress?.country} />
            </FormField>
          </div>
        </fieldset>

        {/* Bill To */}
        <fieldset className="mt-10">
          <legend className="text-sm font-bold text-primary">Bill To</legend>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField label="Client's Name" error={errors.clientName?.message} className="md:col-span-3">
              <Input {...register("clientName")} aria-invalid={!!errors.clientName} />
            </FormField>
            <FormField label="Client's Email" error={errors.clientEmail?.message} className="md:col-span-3">
              <Input type="email" placeholder="e.g. email@example.com" {...register("clientEmail")} aria-invalid={!!errors.clientEmail} />
            </FormField>
            <FormField label="Street Address" error={errors.clientAddress?.street?.message} className="md:col-span-3">
              <Input {...register("clientAddress.street")} aria-invalid={!!errors.clientAddress?.street} />
            </FormField>
            <FormField label="City" error={errors.clientAddress?.city?.message}>
              <Input {...register("clientAddress.city")} aria-invalid={!!errors.clientAddress?.city} />
            </FormField>
            <FormField label="Post Code" error={errors.clientAddress?.postCode?.message}>
              <Input {...register("clientAddress.postCode")} aria-invalid={!!errors.clientAddress?.postCode} />
            </FormField>
            <FormField label="Country" error={errors.clientAddress?.country?.message}>
              <Input {...register("clientAddress.country")} aria-invalid={!!errors.clientAddress?.country} />
            </FormField>
          </div>
        </fieldset>

        {/* Dates + description */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label="Invoice Date" error={errors.createdAt?.message}>
            <Input type="date" {...register("createdAt")} aria-invalid={!!errors.createdAt} />
          </FormField>
          <FormField label="Payment Terms" error={errors.paymentTerms?.message}>
            <Controller
              control={control}
              name="paymentTerms"
              render={({ field }) => (
                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map((t) => (
                      <SelectItem key={t} value={String(t)}>
                        Net {t} {t === 1 ? "Day" : "Days"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField label="Project Description" error={errors.description?.message} className="md:col-span-2">
            <Input placeholder="e.g. Graphic Design Service" {...register("description")} aria-invalid={!!errors.description} />
          </FormField>
        </div>

        {/* Items */}
        <fieldset className="mt-10">
          <legend className="text-lg font-bold text-muted-foreground">Item List</legend>
          <div className="mt-4 space-y-12 md:space-y-4">
            {fields.map((field, index) => {
              const itemErr = errors.items?.[index];
              const total = Number(watch(`items.${index}.quantity`) || 0) * Number(watch(`items.${index}.price`) || 0);
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 md:grid-cols-[1fr_60px_100px_80px_auto] md:items-end"
                >
                  <FormField
                    label="Item Name"
                    hideLabelOnDesktop={index > 0}
                    error={itemErr?.name?.message}
                    className="col-span-4 md:col-span-1"
                  >
                    <Input {...register(`items.${index}.name`)} aria-invalid={!!itemErr?.name} />
                  </FormField>
                  <FormField label="Qty." hideLabelOnDesktop={index > 0} error={itemErr?.quantity?.message}>
                    <Input
                      type="number"
                      min={1}
                      step="1"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      aria-invalid={!!itemErr?.quantity}
                    />
                  </FormField>
                  <FormField label="Price" hideLabelOnDesktop={index > 0} error={itemErr?.price?.message}>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...register(`items.${index}.price`, { valueAsNumber: true })}
                      aria-invalid={!!itemErr?.price}
                    />
                  </FormField>
                  <FormField label="Total" hideLabelOnDesktop={index > 0}>
                    <p className="flex h-12 items-center text-sm font-bold text-muted-foreground">{total.toFixed(2)}</p>
                  </FormField>
                  <div className={cn("flex items-center", index > 0 ? "md:pb-4" : "md:pb-4 md:mt-6")}>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Delete item ${index + 1}`}
                      className="text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:text-destructive disabled:opacity-30"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full rounded-full"
            onClick={() => append({ id: crypto.randomUUID(), name: "", quantity: 1, price: 0, total: 0 })}
          >
            + Add New Item
          </Button>
        </fieldset>

        {hasAnyError && (
          <div role="alert" className="mt-8 text-xs font-semibold text-destructive">
            <p>- All fields must be added</p>
            {itemError && <p>{itemError}</p>}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-6 py-5 md:px-12">
        {mode === "create" ? (
          <>
            <Button type="button" variant="secondary" className="rounded-full mr-auto" onClick={onCancel}>
              Discard
            </Button>
            <Button
              type="button"
              className="rounded-full bg-[hsl(var(--total-bar))] text-[hsl(var(--total-bar-foreground))] hover:opacity-90"
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>
            <Button type="submit" className="rounded-full">Save &amp; Send</Button>
          </>
        ) : (
          <>
            <Button type="button" variant="secondary" className="rounded-full" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-full">Save Changes</Button>
          </>
        )}
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
  hideLabelOnDesktop?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, className, hideLabelOnDesktop, children }: FormFieldProps) {
  const id = useMemo(() => `field-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <Label
          htmlFor={id}
          className={cn(
            "text-xs text-muted-foreground",
            error && "text-destructive",
            hideLabelOnDesktop && "md:sr-only",
          )}
        >
          {label}
        </Label>
        {error && <span className="text-[10px] font-semibold text-destructive">{error}</span>}
      </div>
      <div id={id}>{children}</div>
    </div>
  );
}
