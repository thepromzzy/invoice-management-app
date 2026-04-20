import { useCallback, useEffect, useState } from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { seedInvoices } from "@/lib/seed-invoices";

const STORAGE_KEY = "invoicely-invoices-v1";
const SEEDED_KEY = "invoicely-seeded-v1";

function load(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Invoice[];
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInvoices));
      localStorage.setItem(SEEDED_KEY, "1");
      return seedInvoices;
    }
    return [];
  } catch {
    return [];
  }
}

function save(invoices: Invoice[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

// Simple cross-component pub/sub so all consumers stay in sync.
const listeners = new Set<() => void>();
let cache: Invoice[] | null = null;

function getAll(): Invoice[] {
  if (cache === null) cache = load();
  return cache;
}

function setAll(next: Invoice[]) {
  cache = next;
  save(next);
  listeners.forEach((l) => l());
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getAll());

  useEffect(() => {
    const listener = () => setInvoices([...(cache ?? [])]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const create = useCallback((invoice: Invoice) => {
    setAll([invoice, ...getAll()]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Invoice>) => {
    setAll(getAll().map((inv) => (inv.id === id ? { ...inv, ...patch } : inv)));
  }, []);

  const remove = useCallback((id: string) => {
    setAll(getAll().filter((inv) => inv.id !== id));
  }, []);

  const getById = useCallback((id: string) => getAll().find((i) => i.id === id), []);

  const markAsPaid = useCallback((id: string) => {
    setAll(getAll().map((inv) => (inv.id === id ? { ...inv, status: "paid" as InvoiceStatus } : inv)));
  }, []);

  return { invoices, create, update, remove, getById, markAsPaid };
}
