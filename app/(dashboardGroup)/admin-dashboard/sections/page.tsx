import React, { Suspense } from "react";
import SectionLoadingTable from "../_components/Section/SectionLoadingTable";
import SectionTable from "../_components/Section/SectionTable";

type SectionPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SectionPage = async ({ searchParams }: SectionPageProps) => (
  <div className="flex flex-col gap-6">
    <Suspense fallback={<SectionLoadingTable />}>
      <SectionTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default SectionPage;
