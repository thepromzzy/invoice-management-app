import { z } from "zod";

const addressSchema = z.object({
  street: z.string().trim().min(1, "can't be empty").max(120),
  city: z.string().trim().min(1, "can't be empty").max(60),
  postCode: z.string().trim().min(1, "can't be empty").max(20),
  country: z.string().trim().min(1, "can't be empty").max(60),
});

// Numbers come in from <input type="number"> as strings; we register with valueAsNumber
// in react-hook-form's register() to keep zod inference clean.
const itemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "can't be empty").max(120),
  quantity: z.number({ message: "must be a number" }).positive("must be > 0"),
  price: z.number({ message: "must be a number" }).nonnegative("must be ≥ 0"),
  total: z.number().nonnegative(),
});

export const invoiceFormSchema = z.object({
  senderAddress: addressSchema,
  clientName: z.string().trim().min(1, "can't be empty").max(120),
  clientEmail: z.string().trim().min(1, "can't be empty").email("invalid email").max(255),
  clientAddress: addressSchema,
  createdAt: z.string().min(1, "can't be empty"),
  paymentTerms: z.number().int().positive(),
  description: z.string().trim().min(1, "can't be empty").max(200),
  items: z.array(itemSchema).min(1, "- An item must be added"),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
