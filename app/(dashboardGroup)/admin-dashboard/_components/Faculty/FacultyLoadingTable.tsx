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
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/ui/SearchBar";
const FacultyLoadingTable = () => {
  return (
    <div className="overflow-hidden shadow-sm">
      {/* Header */}
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Instructors
          </h2>

          <p className="text-sm text-muted-foreground">Manage all Faculty</p>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />
        </div>
      </div>

      {/* Table */}
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">
                #
              </TableHead>
              <TableHead>
                Faculty Name
              </TableHead>
              <TableHead>
                Faculty Code
              </TableHead>
              <TableHead>
                Total Departments
              </TableHead>
              <TableHead>
                Total Departments
              </TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                {/* Number */}
                <TableCell>
                  <Skeleton className="h-4 w-5" />
                </TableCell>

                {/* Student */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <Skeleton className="h-4 w-32" />

                      <Skeleton className="mt-2 h-3 w-44" />
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>

                {/* Admission Year */}
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                {/* Department */}
                <TableCell>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-16 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="py-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLoadingTable;
