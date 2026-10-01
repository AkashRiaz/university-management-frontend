"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import Link from "next/link";
import { ClipboardList, AlertCircle, Eye } from "lucide-react";
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
import { getAllProgramsAction } from "../../_actions/programActions";
import { getAllSemestersAction } from "../../_actions/semesterActions";
import { getAllFeeStructuresAction } from "../../_actions/feeStructureActions";
import FeeStructureCreate from "./FeeStructureCreate";
import FeeStructureDelete from "./FeeStructureDelete";

const FeeStructureTable = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const [result, programResult, semesterResult] = await Promise.all([
    getAllFeeStructuresAction({ query: searchParams }),
    getAllProgramsAction({ query: { limit: "100" } }),
    getAllSemestersAction({ query: { limit: "100" } }),
  ]);
  const feeStructures = result.data || [];
  const programs = programResult.data || [];
  const semesters = semesterResult.data || [];
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
          Failed to load fee structures
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Fee Structures
          </h2>
          <p className="text-sm">Manage all registered fee structures</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar />
          <FeeStructureCreate programs={programs} semesters={semesters} />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="w-full min-w-275 table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-56" />
            <col className="w-72" />
            <col className="w-48" />
            <col className="w-48" />
            <col className="w-40" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Program
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Semester
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeStructures.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No fee structures found.
                </TableCell>
              </TableRow>
            ) : (
              feeStructures.map((feeStructure, index) => {
                const program = programs.find(
                  (item) => item.id === feeStructure.programId,
                );
                const semester = semesters.find(
                  (item) => item.id === feeStructure.semesterId,
                );
                const selectedSemester = feeStructure.semester || semester;
                const semesterLabel = selectedSemester
                  ? `${selectedSemester.name}${selectedSemester.academicYear?.name ? ` (${selectedSemester.academicYear.name})` : ""}`
                  : "-";
                return (
                  <TableRow key={feeStructure.id}>
                    <TableCell className="font-medium text-gray-500">
                      {(currentPage - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 truncate font-medium">
                          {feeStructure.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="truncate">
                        {feeStructure.description || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="truncate">
                        {feeStructure.program?.name || program?.name || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="truncate">{semesterLabel}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <FeeStructureCreate
                          feeStructure={feeStructure}
                          programs={programs}
                          semesters={semesters}
                          trigger="edit"
                        />
                        <Link
                          href={`/admin-dashboard/fee-structures/${feeStructure.id}/items`}
                          aria-label={`View items for ${feeStructure.name}`}
                          title={`View items for ${feeStructure.name}`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-input text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <FeeStructureDelete
                          feeStructureId={feeStructure.id}
                          feeStructureName={feeStructure.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <CustomPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default FeeStructureTable;
