import TableBackButton from "@/components/ui/TableBackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/ui/SearchBar";

const InvoiceLoadingTable = () => (
  <div className="min-w-0 overflow-hidden shadow-sm">
    <div className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold"><TableBackButton /> Invoices</h2>
        <p className="text-sm text-muted-foreground">Manage all invoices</p>
      </div>
      <div className="flex items-center gap-2"><SearchBar compact /><Skeleton className="h-8 w-32" /></div>
    </div>
    <div className="space-y-3 p-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

export default InvoiceLoadingTable;
