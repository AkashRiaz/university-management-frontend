"use server";

import { Suspense } from "react";
import InvoiceLoadingTable from "../_components/Invoice/InvoiceLoadingTable";
import InvoiceTable from "../_components/Invoice/InvoiceTable";

const InvoicePage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => (
  <div className="flex flex-col gap-6">
    <Suspense fallback={<InvoiceLoadingTable />}>
      <InvoiceTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default InvoicePage;
