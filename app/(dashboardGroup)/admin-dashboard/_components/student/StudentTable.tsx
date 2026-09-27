import React from "react";
import { getAllStudentsActionForAdmin } from "../../_actions/studentActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import Link from "next/link";
import { CustomPagination } from "@/components/ui/CustomPagination";

type StudentTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const StudentTable = async ({ searchParams }: StudentTableProps) => {
  const query = await searchParams;
  const result = await getAllStudentsActionForAdmin({ query });

  const students = result?.data || [];

  const currentPage = Math.max(1, Number(result?.meta?.page ?? 1));

  const limit = Math.max(1, Number(result?.meta?.limit ?? 10));

  const totalPages = Math.max(1, Number(result?.meta?.totalPages ?? 1));

  if (!result?.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
        <h3 className="font-semibold text-red-700">Failed to load students</h3>

        <p className="mt-1 text-sm text-red-600">
          {result?.message || "Something went wrong while loading students."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-sm">
      {/* Table Header / Title */}
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-sm">Manage all registered students</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <SearchBar />
          </div>
          <div>
            <Link
              href="/admin-dashboard/student-registration"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Add Student
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table>
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
            {students.map((student, index) => {
              const name = student?.user?.name || "Unknown Student";
              const email = student?.user?.email || "-";

              return (
                <TableRow key={student.id} className="transition-colors ">
                  {/* Number */}
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium ">{name}</p>

                        <div className="mt-0.5 flex items-center gap-1 text-xs">
                          <Mail className="h-3.5 w-3.5" />
                          {email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm ">
                      <Phone className="h-4 w-4 " />
                      {student?.phone || "-"}
                    </div>
                  </TableCell>

                  {/* Admission Year */}
                  <TableCell>
                    <span className="font-medium ">
                      {student?.admissionYear || "-"}
                    </span>
                  </TableCell>

                  {/* Department */}
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {student?.department?.code || "-"}
                    </Badge>
                  </TableCell>

                  {/* Program */}
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {student?.program?.code || "-"}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <button className="rounded-md border px-3 py-1.5 text-sm font-medium  transition ">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div>
        <CustomPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default StudentTable;
