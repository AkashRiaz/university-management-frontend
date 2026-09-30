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
import Link from "next/link";

const StudentLoadingTable = () => {
  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Students
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage all registered students
          </p>
        </div>

        <div className="flex w-full flex-nowrap items-center gap-4 sm:w-auto sm:justify-end">
          <SearchBar compact />
        </div>
      </div>

      {/* Table */}
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Student
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Contact
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Admission Year
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Program
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700">
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

                {/* Program */}
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
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

export default StudentLoadingTable;
