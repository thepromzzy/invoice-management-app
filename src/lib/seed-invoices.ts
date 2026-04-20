import type { Invoice } from "@/types/invoice";

function isoDaysFromNow(days: number, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const seedInvoices: Invoice[] = [
  {
    id: "RT3080",
    createdAt: isoDaysFromNow(-12),
    paymentDue: isoDaysFromNow(18),
    paymentTerms: 30,
    description: "Re-branding",
    status: "paid",
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "106 Kendell Street", city: "Sharrington", postCode: "NR24 5WQ", country: "United Kingdom" },
    items: [{ id: crypto.randomUUID(), name: "Brand Guidelines", quantity: 1, price: 1800.9, total: 1800.9 }],
    total: 1800.9,
  },
  {
    id: "XM9141",
    createdAt: isoDaysFromNow(-8),
    paymentDue: isoDaysFromNow(22),
    paymentTerms: 30,
    description: "Graphic Design",
    status: "pending",
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    items: [
      { id: crypto.randomUUID(), name: "Banner Design", quantity: 1, price: 156.0, total: 156.0 },
      { id: crypto.randomUUID(), name: "Email Design", quantity: 2, price: 200.0, total: 400.0 },
    ],
    total: 556.0,
  },
  {
    id: "RG0314",
    createdAt: isoDaysFromNow(-3),
    paymentDue: isoDaysFromNow(25),
    paymentTerms: 30,
    description: "Website Redesign",
    status: "paid",
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "79 Dover Road", city: "Westhall", postCode: "IP19 3PF", country: "United Kingdom" },
    items: [{ id: crypto.randomUUID(), name: "Website Redesign", quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33,
  },
  {
    id: "FV2353",
    createdAt: isoDaysFromNow(-1),
    paymentDue: isoDaysFromNow(6),
    paymentTerms: 7,
    description: "Logo Re-design",
    status: "draft",
    clientName: "Anita Wainwright",
    clientEmail: "",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    items: [{ id: crypto.randomUUID(), name: "Logo Re-design", quantity: 1, price: 3102.04, total: 3102.04 }],
    total: 3102.04,
  },
];
