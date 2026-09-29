import React from "react";
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
    <div className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <h2 className="text-lg font-semibold">Academic Years</h2>
          <p className="text-sm text-muted-foreground">
            Manage all registered academic years
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Academic Year
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Start Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                End Date
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
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
