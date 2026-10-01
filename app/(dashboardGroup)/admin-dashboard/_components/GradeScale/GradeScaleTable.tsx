"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import Link from "next/link";
import { AlertCircle, Eye, FileText } from "lucide-react";
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
import { getAllGradeScalesAction } from "../../_actions/gradeScaleActions";
import GradeScaleCreate from "./GradeScaleCreate";
import GradeScaleDelete from "./GradeScaleDelete";

const GradeScaleTable = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const result = await getAllGradeScalesAction({ query: searchParams });
  const gradeScales = result.data || [];
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
          Failed to load grade scales
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Grade Scales
          </h2>
          <p className="text-sm">Manage all registered grade scales</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar />
          <GradeScaleCreate />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-175">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Grade Scale
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
            {gradeScales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No grade scales found.
                </TableCell>
              </TableRow>
            ) : (
              gradeScales.map((gradeScale, index) => (
                <TableRow key={gradeScale.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium">{gradeScale.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {gradeScale.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <GradeScaleCreate
                        gradeScale={gradeScale}
                        trigger="edit"
                      />
                      <Link
                        href={`/admin-dashboard/grade-scales/${gradeScale.id}`}
                        aria-label={`View grades for ${gradeScale.name}`}
                        title={`View grades for ${gradeScale.name}`}
                        className="inline-flex size-7 items-center justify-center rounded-md border border-input text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <GradeScaleDelete
                        gradeScaleId={gradeScale.id}
                        gradeScaleName={gradeScale.name}
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

export default GradeScaleTable;
