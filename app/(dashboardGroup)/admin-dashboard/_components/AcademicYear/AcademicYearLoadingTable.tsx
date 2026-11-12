import React from "react";
import TableBackButton from "@/components/ui/TableBackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/ui/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";

const AcademicYearLoadingTable = () => {
  return (
    <div className="data-panel">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Academic Years
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage all registered academic years
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>

      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">
                #
              </TableHead>
              <TableHead>
                Academic Year
              </TableHead>
              <TableHead>
                Start Date
              </TableHead>
              <TableHead>
                End Date
              </TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-16 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default AcademicYearLoadingTable;
