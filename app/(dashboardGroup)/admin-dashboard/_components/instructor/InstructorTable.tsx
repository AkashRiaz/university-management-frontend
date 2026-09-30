"use server";

import { getAllInstructorsActionForAdmin } from "../../_actions/instructorActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DoorOpen, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getAllProgramsAction } from "../../_actions/programActions";

type InstructorTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const InstructorTable = async ({ searchParams }: InstructorTableProps) => {
  const result = await getAllInstructorsActionForAdmin({ query: searchParams });

  const instructors = result?.data || [];

  const currentPage = Math.max(1, Number(result?.meta?.page ?? 1));

  const limit = Math.max(1, Number(result?.meta?.limit ?? 10));

  const totalPages = Math.max(1, Number(result?.meta?.totalPages ?? 1));

  if (!result?.success) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load instructors
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result?.message || "Something went wrong while loading instructors."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">Instructors</h2>
          <p className="text-sm">Manage all registered instructors</p>
        </div>

        <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
          <div>
            <SearchBar compact />
          </div>
          <div>
            <Link
              href="/admin-dashboard/instructor-registration"
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition hover:bg-primary/90"
            >
              Add Instructor
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Instructor
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Contact
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Designation
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Office Room
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {instructors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No instructors found.
                </TableCell>
              </TableRow>
            ) : (
              instructors.map((instructor, index) => (
                <TableRow key={instructor.id} className="transition-colors">
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {instructor.user?.name || "Unknown Instructor"}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs">
                        <Mail className="h-3.5 w-3.5" />
                        {instructor.user?.email || "-"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {instructor.phone || "-"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {instructor.designation?.replaceAll("_", " ") || "-"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {instructor.department?.code || "-"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <DoorOpen className="h-4 w-4" />
                      {instructor.officeRoom || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <button className="rounded-md border px-3 py-1.5 text-sm font-medium transition">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default InstructorTable;
