import { Suspense } from "react";
import InvoiceItemLoadingTable from "../../_components/InvoiceItem/InvoiceItemLoadingTable";
import InvoiceItemTable from "../../_components/InvoiceItem/InvoiceItemTable";

export default async function InvoiceItemsPage({ params, searchParams }: { params: Promise<{ invoiceId: string }>; searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { invoiceId } = await params;
  return <div className="flex flex-col gap-6"><Suspense fallback={<InvoiceItemLoadingTable />}><InvoiceItemTable invoiceId={invoiceId} searchParams={await searchParams} /></Suspense></div>;
}
