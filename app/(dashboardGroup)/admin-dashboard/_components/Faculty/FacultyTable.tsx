"use server";

import { AlertCircle, Building2 } from "lucide-react";
import FacultyCreate from "./FacultyCreate";
import FacultyDelete from "./FacultyDelete";
import FacultyDescriptionCell from "./FacultyDescriptionCell";
import { getAllFaculties } from "../../_actions/facultyActions";
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

type FacultyTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const FacultyTable = async ({ searchParams }: FacultyTableProps) => {
  const result = await getAllFaculties({ query: searchParams });
  const faculties = result.data || [];
  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));
  const limit = Math.max(1, Number(result.meta?.limit ?? 10));
  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm">
        <AlertCircle className="mx-auto size-5 text-destructive" />
        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load faculties
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading faculties."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">Faculties</h2>
          <p className="text-sm">Manage all registered faculties</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar />
          <FacultyCreate />
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
                Faculty
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Code
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Total Departments
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No faculties found.
                </TableCell>
              </TableRow>
            ) : (
              faculties.map((faculty, index) => (
                <TableRow key={faculty.id} className="transition-colors">
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <p className="font-medium">{faculty.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {faculty.code || "-"}
                  </TableCell>
                  <TableCell>{faculty._count?.departments ?? 0}</TableCell>
                  <TableCell className="w-[280px] max-w-[280px] align-top whitespace-normal">
                    <FacultyDescriptionCell description={faculty.description} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <FacultyCreate faculty={faculty} trigger="edit" />
                      <FacultyDelete
                        facultyId={faculty.id}
                        facultyName={faculty.name}
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

export default FacultyTable;
