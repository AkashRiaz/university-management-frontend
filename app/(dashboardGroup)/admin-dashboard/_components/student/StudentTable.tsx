"use server";
import TableBackButton from "@/components/ui/TableBackButton";
import React from "react";
import { getAllStudentsActionForAdmin } from "../../_actions/studentActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import Link from "next/link";
import { CustomPagination } from "@/components/ui/CustomPagination";
import StudentDelete from "./StudentDelete";
import StudentRestore from "./StudentRestore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VirtualStudentList from "./VirtualStudentListLazy";
import type { VirtualStudent } from "./VirtualStudentList";
import { makeDemoStudents, parseDemoCount } from "@/lib/demo-data";

// "All students" view: loads up to this many records into a virtualized list.
const ALL_VIEW_LIMIT = "1000";

type StudentTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const StudentTable = async ({ searchParams }: StudentTableProps) => {
  const query = await searchParams;
  const isAllView = query?.view === "all";
  // `?view=all&demo=1000` adds representative rows to test virtualization.
  const demoCount = isAllView ? parseDemoCount(query?.demo) : 0;
  const result = await getAllStudentsActionForAdmin({
    query: isAllView ? { ...query, page: "1", limit: ALL_VIEW_LIMIT } : query,
  });
  const isDeleted = query?.isDeleted === "true";
  const tabUrl = (deleted: boolean, all = false) => {
    const params = new URLSearchParams();
    const searchTerm = query?.searchTerm;

    if (typeof searchTerm === "string" && searchTerm) {
      params.set("searchTerm", searchTerm);
    }

    const sortBy = query?.sortBy;
    const sortOrder = query?.sortOrder;

    if (typeof sortBy === "string" && sortBy) {
      params.set("sortBy", sortBy);
    }

    if (
      typeof sortOrder === "string" &&
      (sortOrder === "asc" || sortOrder === "desc")
    ) {
      params.set("sortOrder", sortOrder);
    }

    params.set("isDeleted", deleted ? "true" : "false");
    params.set("page", "1");
    if (all) params.set("view", "all");

    return `/admin-dashboard/students?${params.toString()}`;
  };

  const students = result?.data || [];

  const currentPage = Math.max(1, Number(result?.meta?.page ?? 1));

  const limit = Math.max(1, Number(result?.meta?.limit ?? 10));

  const totalPages = Math.max(1, Number(result?.meta?.totalPages ?? 1));

  if (!result?.success) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-10 text-center">
        <h3 className="font-semibold text-destructive">Failed to load students</h3>

        <p className="mt-1 text-sm text-destructive/90">
          {result?.message || "Something went wrong while loading students."}
        </p>
      </div>
    );
  }

  return (
    <div className="data-panel">
      {/* Table Header / Title */}
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            {isDeleted ? "Deleted Students" : "Students"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isDeleted
              ? "View deleted student records"
              : "Manage all registered students"}
          </p>
        </div>

        <div className="flex min-w-0 w-full flex-nowrap items-center gap-4 sm:w-auto sm:justify-end">
          <div>
            <SearchBar compact />
          </div>
          <div>
            <Link
              href="/admin-dashboard/student-registration"
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Add Student
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-1 my-4 sm:mx-2 md:mx-0">
        <Tabs>
        <TabsList className="p-1 flex gap-2">
          <TabsTrigger href={tabUrl(false)} active={!isDeleted && !isAllView}>
            Active Students
          </TabsTrigger>
          <TabsTrigger href={tabUrl(true)} active={isDeleted && !isAllView}>
            Deleted Students
          </TabsTrigger>
          <TabsTrigger href={tabUrl(isDeleted, true)} active={isAllView}>
            All (scroll view)
          </TabsTrigger>
        </TabsList>
      </Tabs>
      </div>

      {isAllView ? (
        <div className="mx-1 sm:mx-2 md:mx-0">
          <VirtualStudentList
            students={[
              ...(students as VirtualStudent[]),
              ...makeDemoStudents(demoCount),
            ]}
            isDeleted={isDeleted}
            totalOnServer={Number(result?.meta?.total ?? 0) || undefined}
          />
        </div>
      ) : (
      <>
      {/* Responsive Table */}
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">
                #
              </TableHead>

              <TableHead>
                Student
              </TableHead>

              <TableHead>
                Contact
              </TableHead>

              <TableHead>
                Admission Year
              </TableHead>

              <TableHead>
                Department
              </TableHead>

              <TableHead>
                Program
              </TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student, index) => {
              const name = student?.user?.name || "Unknown Student";
              const email = student?.user?.email || "-";

              return (
                <TableRow key={student.id} className="transition-colors ">
                  {/* Number */}
                  <TableCell className="font-medium text-muted-foreground">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium ">{name}</p>

                        <div className="mt-0.5 flex items-center gap-1 text-xs">
                          <Mail className="h-3.5 w-3.5" />
                          {email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm ">
                      <Phone className="h-4 w-4 " />
                      {student?.phone || "-"}
                    </div>
                  </TableCell>

                  {/* Admission Year */}
                  <TableCell>
                    <span className="font-medium ">
                      {student?.admissionYear || "-"}
                    </span>
                  </TableCell>

                  {/* Department */}
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {student?.department?.code || "-"}
                    </Badge>
                  </TableCell>

                  {/* Program */}
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {student?.program?.code || "-"}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin-dashboard/students/${student.id}`}
                        className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
                      >
                        Edit
                      </Link>
                      {isDeleted ? (
                        <StudentRestore
                          studentId={student.id}
                          studentName={name}
                        />
                      ) : (
                        <StudentDelete
                          studentId={student.id}
                          studentName={name}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div>
        <CustomPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      </>
      )}
    </div>
  );
};

export default StudentTable;
