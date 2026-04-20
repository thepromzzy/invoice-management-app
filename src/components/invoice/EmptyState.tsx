import emptyImg from "@/assets/empty-state.svg";

export function EmptyState({ filter }: { filter: string }) {
  const isFiltered = filter !== "all";
  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center md:mt-24">
      <img src={emptyImg} alt="" className="w-60 max-w-full" />
      <h2 className="mt-12 text-2xl font-bold tracking-tight">There is nothing here</h2>
      <p className="mt-6 text-sm text-muted-foreground">
        {isFiltered ? (
          <>No <span className="font-bold text-foreground">{filter}</span> invoices to show. Try another filter.</>
        ) : (
          <>Create an invoice by clicking the <span className="font-bold text-foreground">New Invoice</span> button and get started.</>
        )}
      </p>
    </div>
  );
}
