"use server";

import { AlertCircle, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllAcademicYearsAction } from "../../_actions/academicYearActions";
import { getAllSemestersAction } from "../../_actions/semesterActions";
import SemesterCreate from "./SemesterCreate";
import SemesterDelete from "./SemesterDelete";

type SemesterTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const SemesterTable = async ({ searchParams }: SemesterTableProps) => {
  const [result, academicYearResult] = await Promise.all([
    getAllSemestersAction({ query: searchParams }),
    getAllAcademicYearsAction({ query: { limit: "100" } }),
  ]);
  const semesters = result.data || [];
  const academicYears = academicYearResult.data || [];
  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));
  const limit = Math.max(1, Number(result.meta?.limit ?? 10));
  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load semesters
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <h2 className="text-lg font-semibold">Semesters</h2>
          <p className="text-sm">Manage all registered semesters</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar />
          <SemesterCreate academicYears={academicYears} />
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
                Semester
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Academic Year
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Semester Dates
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Registration
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No semesters found.
                </TableCell>
              </TableRow>
            ) : (
              semesters.map((semester, index) => (
                <TableRow key={semester.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <span className="font-medium">{semester.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {semester.academicYear?.name || semester.academicYearId}
                  </TableCell>
                  <TableCell>
                    {formatDate(semester.startDate)} -{" "}
                    {formatDate(semester.endDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(semester.registrationStart)} -{" "}
                    {formatDate(semester.registrationEnd)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        semester.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {semester.status || "UPCOMING"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <SemesterCreate
                        semester={semester}
                        academicYears={academicYears}
                        trigger="edit"
                      />
                      <SemesterDelete
                        semesterId={semester.id}
                        semesterName={semester.name}
                      />
                    </div>
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

export default SemesterTable;
