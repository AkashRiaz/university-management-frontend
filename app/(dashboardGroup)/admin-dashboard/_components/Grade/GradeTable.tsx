"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, Award } from "lucide-react";
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
import { getGradesByGradeScaleAction } from "../../_actions/gradeActions";
import GradeCreate from "./GradeCreate";
import GradeDelete from "./GradeDelete";

const formatGradePoint = (value: number | string | null | undefined) => {
  const gradePoint = Number(value);

  return Number.isFinite(gradePoint) ? gradePoint.toFixed(2) : "-";
};

const GradeTable = async ({
  searchParams,
  gradeScaleId,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
  gradeScaleId?: string;
}) => {
  const [result, gradeScaleResult] = await Promise.all([
    getGradesByGradeScaleAction(gradeScaleId || "", { query: searchParams }),
    getAllGradeScalesAction({ query: { limit: "100" } }),
  ]);
  const grades = result.data || [];
  const gradeScales = gradeScaleResult.data || [];
  const selectedGradeScale = gradeScales.find(
    (gradeScale) => gradeScale.id === gradeScaleId,
  );
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
          Failed to load grades
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
            Grades
          </h2>
          <p className="text-sm">
            {gradeScaleId
              ? `Grade scale: ${selectedGradeScale?.name || "Unknown"}`
              : "Manage all registered grades"}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar />
          <GradeCreate
            gradeScales={gradeScales}
            fixedGradeScaleId={gradeScaleId}
          />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="w-full min-w-225 table-fixed">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Letter
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Marks
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Point
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No grades found.
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade, index) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="size-4 text-muted-foreground" />
                      <span className="font-semibold">{grade.letter}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {grade.minMarks} - {grade.maxMarks}
                  </TableCell>
                  <TableCell>{formatGradePoint(grade.gradePoint)}</TableCell>
                  <TableCell>{grade.type.replace("_", " ")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <GradeCreate
                        grade={grade}
                        gradeScales={gradeScales}
                        fixedGradeScaleId={gradeScaleId}
                        trigger="edit"
                      />
                      <GradeDelete
                        gradeId={grade.id}
                        gradeName={grade.letter}
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

export default GradeTable;
