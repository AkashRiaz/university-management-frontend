"use server";

import { AlertCircle, ClipboardList } from "lucide-react";
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
import { getAllDepartmentsAction } from "../../_actions/departmentActions";
import { getAllRoomsAction } from "../../_actions/roomActions";
import { getAllSectionsAction } from "../../_actions/sectionActions";
import { getAllSemestersAction } from "../../_actions/semesterActions";
import { getAllSectionInstructorsAction } from "../../_actions/sectionInstructorActions";
import { getAllInstructorsActionForAdmin } from "../../_actions/instructorActions";
import SectionCreate from "./SectionCreate";
import SectionDelete from "./SectionDelete";
import SectionInstructorTable from "../SectionInstructor/SectionInstructorTable";

type SectionTableProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const SectionTable = async ({ searchParams }: SectionTableProps) => {
  const [
    result,
    departmentResult,
    courseResult,
    semesterResult,
    roomResult,
    sectionInstructorResult,
    instructorResult,
  ] =
    await Promise.all([
      getAllSectionsAction({ query: searchParams }),
      getAllDepartmentsAction({ query: { limit: "100" } }),
      getAllCoursesAction({ query: { limit: "100" } }),
      getAllSemestersAction({ query: { limit: "100" } }),
      getAllRoomsAction({ query: { limit: "100" } }),
      getAllSectionInstructorsAction(),
      getAllInstructorsActionForAdmin({ query: { limit: "100" } }),
    ]);
  const sections = result.data || [];
  const departments = departmentResult.data || [];
  const courses = courseResult.data || [];
  const semesters = semesterResult.data || [];
  const rooms = roomResult.data || [];
  const sectionInstructors = sectionInstructorResult.data || [];
  const instructors = instructorResult?.data || [];
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
          Failed to load sections
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">Sections</h2>
          <p className="text-sm">Manage all course sections</p>
        </div>
        <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
          <SearchBar compact />
          <SectionCreate
            departments={departments}
            courses={courses}
            semesters={semesters}
            rooms={rooms}
          />
        </div>
      </div>

      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-245">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Section
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Course
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Semester
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Room
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Capacity
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Instructors
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No sections found.
                </TableCell>
              </TableRow>
            ) : (
              sections.map((section, index) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="size-4 text-muted-foreground" />
                      <span className="font-medium">{section.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {section.department?.name || section.departmentId}
                  </TableCell>
                  <TableCell>
                    {section.course?.code || section.courseId}
                  </TableCell>
                  <TableCell>
                    {section.semester?.name || section.semesterId}
                  </TableCell>
                  <TableCell>
                    {section.room
                      ? `${section.room.building} ${section.room.roomNumber}`
                      : "-"}
                  </TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        section.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {section.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SectionInstructorTable
                      sectionId={section.id}
                      sectionName={section.name}
                      assignments={sectionInstructors}
                      instructors={instructors}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <SectionCreate
                        section={section}
                        departments={departments}
                        courses={courses}
                        semesters={semesters}
                        rooms={rooms}
                        trigger="edit"
                      />
                      <SectionDelete
                        sectionId={section.id}
                        sectionName={section.name}
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

export default SectionTable;
