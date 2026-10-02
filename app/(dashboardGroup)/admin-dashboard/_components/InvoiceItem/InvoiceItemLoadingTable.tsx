import { Skeleton } from "@/components/ui/skeleton";
import TableBackButton from "@/components/ui/TableBackButton";

export default function InvoiceItemLoadingTable() {
  return <div className="min-w-0 overflow-hidden shadow-sm"><div className="flex items-center justify-between border-b py-4"><h2 className="text-lg font-semibold"><TableBackButton /> Invoice Items</h2><Skeleton className="h-9 w-28" /></div><div className="space-y-3 p-2">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}</div></div>;
}
