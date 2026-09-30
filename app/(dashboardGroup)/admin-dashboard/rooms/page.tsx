import React, { Suspense } from "react";
import RoomLoadingTable from "../_components/Room/RoomLoadingTable";
import RoomTable from "../_components/Room/RoomTable";

type RoomPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const RoomPage = async ({ searchParams }: RoomPageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<RoomLoadingTable />}>
      <RoomTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default RoomPage;
