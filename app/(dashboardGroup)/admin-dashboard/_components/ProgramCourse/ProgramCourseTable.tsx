"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, BookOpenCheck, ListTree } from "lucide-react";
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
import { getAllCoursesAction } from "../../_actions/courseActions";
import { getAllProgramCoursesAction } from "../../_actions/programCourseActions";
import { getAllProgramsAction } from "../../_actions/programActions";
import ProgramCourseCreate from "./ProgramCourseCreate";
import ProgramCourseDelete from "./ProgramCourseDelete";

type ProgramCourseTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const ProgramCourseTable = async ({
  searchParams,
}: ProgramCourseTableProps) => {
  const [result, programResult, courseResult] = await Promise.all([
    getAllProgramCoursesAction({ query: searchParams }),
    getAllProgramsAction({ query: { limit: "100" } }),
    getAllCoursesAction({ query: { limit: "100" } }),
  ]);
  const programCourses = result.data || [];
  const programs = programResult.data || [];
  const courses = courseResult.data || [];
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
          Failed to load program courses
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
            Program Courses
          </h2>
          <p className="text-sm">Manage courses assigned to programs</p>
        </div>
        <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
          <SearchBar compact />
          <ProgramCourseCreate programs={programs} courses={courses} />
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
                Program
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Course
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Semester
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Required
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programCourses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No program courses found.
                </TableCell>
              </TableRow>
            ) : (
              programCourses.map((programCourse, index) => (
                <TableRow key={programCourse.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ListTree className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {programCourse.program?.name || programCourse.programId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="size-4 text-muted-foreground" />
                      <span>
                        {programCourse.course?.code || programCourse.courseId}
                        {programCourse.course?.title
                          ? ` - ${programCourse.course.title}`
                          : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>Semester {programCourse.semesterNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={programCourse.isRequired ? "default" : "outline"}
                    >
                      {programCourse.isRequired ? "Required" : "Elective"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ProgramCourseCreate
                        programCourse={programCourse}
                        programs={programs}
                        courses={courses}
                        trigger="edit"
                      />
                      <ProgramCourseDelete
                        programCourseId={programCourse.id}
                        programCourseName={
                          programCourse.course?.title || programCourse.courseId
                        }
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

export default ProgramCourseTable;
