import { z } from "zod";

const addressSchema = z.object({
  street: z.string().trim().min(1, "can't be empty").max(120),
  city: z.string().trim().min(1, "can't be empty").max(60),
  postCode: z.string().trim().min(1, "can't be empty").max(20),
  country: z.string().trim().min(1, "can't be empty").max(60),
});

const itemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "can't be empty").max(120),
  quantity: z.coerce.number().positive("must be > 0"),
  price: z.coerce.number().nonnegative("must be ≥ 0"),
  total: z.coerce.number().nonnegative(),
});

export const invoiceFormSchema = z.object({
  senderAddress: addressSchema,
  clientName: z.string().trim().min(1, "can't be empty").max(120),
  clientEmail: z.string().trim().min(1, "can't be empty").email("invalid email").max(255),
  clientAddress: addressSchema,
  createdAt: z.string().min(1, "can't be empty"),
  paymentTerms: z.coerce.number().int().positive(),
  description: z.string().trim().min(1, "can't be empty").max(200),
  items: z.array(itemSchema).min(1, "- An item must be added"),
});

// Looser schema for drafts — only require an id-like shape, allow blanks.
export const invoiceDraftSchema = z.object({
  senderAddress: addressSchema.partial(),
  clientName: z.string().trim().max(120).optional(),
  clientEmail: z.string().trim().max(255).optional(),
  clientAddress: addressSchema.partial(),
  createdAt: z.string(),
  paymentTerms: z.coerce.number().int().positive(),
  description: z.string().trim().max(200).optional(),
  items: z.array(itemSchema),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
