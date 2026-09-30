"use server";

import { AlertCircle, BookOpenCheck } from "lucide-react";
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
import { getAllDepartmentsAction } from "../../_actions/departmentActions";
import { getAllCoursesAction } from "../../_actions/courseActions";
import CourseCreate from "./CourseCreate";
import CourseDelete from "./CourseDelete";

type CourseTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const CourseTable = async ({ searchParams }: CourseTableProps) => {
  const [result, departmentResult] = await Promise.all([
    getAllCoursesAction({ query: searchParams }),
    getAllDepartmentsAction({ query: { limit: "100" } }),
  ]);
  const courses = result.data || [];
  const departments = departmentResult.data || [];
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
          Failed to load courses
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <h2 className="text-lg font-semibold">Courses</h2>
          <p className="text-sm">Manage all registered courses</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar />
          <CourseCreate departments={departments} />
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
                Course
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Credit
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Level
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{course.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.department?.name || course.departmentId}
                  </TableCell>
                  <TableCell>{course.credit}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.courseType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.courseLevel}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CourseCreate
                        course={course}
                        departments={departments}
                        trigger="edit"
                      />
                      <CourseDelete
                        courseId={course.id}
                        courseName={course.title}
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

export default CourseTable;
