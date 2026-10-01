"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, CalendarDays } from "lucide-react";
import AcademicYearCreate from "./AcademicYearCreate";
import { getAllAcademicYearsAction } from "../../_actions/academicYearActions";
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
import AcademicYearDelete from "./AcademicYearDelete";

type AcademicYearTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const AcademicYearTable = async ({ searchParams }: AcademicYearTableProps) => {
  const result = await getAllAcademicYearsAction({ query: searchParams });
  const academicYears = result.data || [];
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
          Failed to load academic years
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.message ||
            "Something went wrong while loading academic years."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Academic Years
          </h2>
          <p className="text-sm">Manage all registered academic years</p>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <AcademicYearCreate />
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
            {academicYears.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No academic years found.
                </TableCell>
              </TableRow>
            ) : (
              academicYears.map((academicYear, index) => (
                <TableRow key={academicYear.id} className="transition-colors">
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <p className="font-medium">{academicYear.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(academicYear.startDate)}</TableCell>
                  <TableCell>{formatDate(academicYear.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <AcademicYearCreate
                        academicYear={academicYear}
                        trigger="edit"
                      />
                      <AcademicYearDelete
                        academicYearId={academicYear.id}
                        academicYearName={academicYear.name}
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

export default AcademicYearTable;
