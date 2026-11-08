"use server";

import { AlertCircle, CalendarDays, Clock3, DoorOpen } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import TableBackButton from "@/components/ui/TableBackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllDepartmentsAction } from "../../_actions/departmentActions";
import { getAllAcademicYearsAction } from "../../_actions/academicYearActions";
import { getAllRoomsAction } from "../../_actions/roomActions";
import { getAllSectionsAction } from "../../_actions/sectionActions";
import { getAllClassSchedulesAction } from "../../_actions/classScheduleActions";
import ClassScheduleCreate from "./ClassScheduleCreate";
import ClassScheduleDelete from "./ClassScheduleDelete";

const dayNames = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type ClassScheduleTableProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const ClassScheduleTable = async ({
  searchParams,
}: ClassScheduleTableProps) => {
  const [
    result,
    departmentResult,
    sectionResult,
    roomResult,
    academicYearResult,
  ] = await Promise.all([
    getAllClassSchedulesAction({ query: searchParams }),
    getAllDepartmentsAction({ query: { limit: "100" } }),
    getAllSectionsAction({ query: { limit: "100" } }),
    getAllRoomsAction({ query: { limit: "100" } }),
    getAllAcademicYearsAction({ query: { limit: "100" } }),
  ]);
  const schedules = result.data || [];
  const departments = departmentResult.data || [];
  const sections = sectionResult.data || [];
  const rooms = roomResult.data || [];
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
          Failed to load class schedules
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton /> Class Schedules
          </h2>
          <p className="text-sm">Manage all class schedules</p>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
          <SearchBar compact />
          <ClassScheduleCreate
            departments={departments}
            sections={sections}
            rooms={rooms}
          />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Day</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Time
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Section
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
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No class schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule, index) => {
                const department =
                  schedule.department ||
                  departments.find((item) => item.id === schedule.departmentId);
                const section =
                  schedule.section ||
                  sections.find((item) => item.id === schedule.sectionId);
                const room =
                  schedule.room ||
                  rooms.find((item) => item.id === schedule.roomId);
                const semester = section?.semester;
                const academicYear =
                  semester?.academicYear ||
                  academicYears.find(
                    (item) => item.id === semester?.academicYearId,
                  );
                const scheduleName = `${section?.name || "Section"} - ${dayNames[schedule.dayOfWeek] || "Day"}`;
                return (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium text-gray-500">
                      {(currentPage - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        {dayNames[schedule.dayOfWeek] || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock3 className="size-4 text-muted-foreground" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      {department?.name || schedule.departmentId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {section?.name || schedule.sectionId}
                    </TableCell>
                    <TableCell>
                      {section?.course
                        ? `${section.course.code} - ${section.course.title}`
                        : section?.courseId || "-"}
                    </TableCell>
                    <TableCell>
                      {semester
                        ? `${semester.name} (${academicYear?.name || "Academic year unavailable"})`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DoorOpen className="size-4 text-muted-foreground" />
                        {room ? `${room.building} ${room.roomNumber}` : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ClassScheduleCreate
                          schedule={schedule}
                          departments={departments}
                          sections={sections}
                          rooms={rooms}
                          trigger="edit"
                        />
                        <ClassScheduleDelete
                          scheduleId={schedule.id}
                          scheduleName={scheduleName}
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

export default ClassScheduleTable;
