"use server";

import TableBackButton from "@/components/ui/TableBackButton";
import { AlertCircle, BadgePercent } from "lucide-react";
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
import { getAllStudentsActionForAdmin } from "../../_actions/studentActions";
import { getAllScholarshipsAction } from "../../_actions/scholarshipActions";
import { getAllSemestersAction } from "../../_actions/semesterActions";
import { getAllStudentScholarshipsAction } from "../../_actions/studentScholarshipActions";
import StudentScholarshipCreate from "./StudentScholarshipCreate";
import StudentScholarshipDelete from "./StudentScholarshipDelete";
import { IStudentScholarshipStudent } from "@/types/student-scholarship.type";

const StudentScholarshipTable = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const [result, studentResult, scholarshipResult, semesterResult] =
    await Promise.all([
      getAllStudentScholarshipsAction({ query: searchParams }),
      getAllStudentsActionForAdmin({ query: { limit: "100" } }),
      getAllScholarshipsAction({ query: { limit: "100" } }),
      getAllSemestersAction({ query: { limit: "100" } }),
    ]);
  const records = result.data || [];
  const students = (studentResult?.data || []) as IStudentScholarshipStudent[];
  const scholarships = scholarshipResult.data || [];
  const semesters = semesterResult.data || [];
  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));
  const limit = Math.max(1, Number(result.meta?.limit ?? 10));
  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success)
    return (
      <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load student scholarships
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );

  const getStudentLabel = (record: (typeof records)[number]) =>
    record.student?.user?.name ||
    record.student?.user?.email ||
    students.find((student) => student.id === record.studentId)?.user?.name ||
    students.find((student) => student.id === record.studentId)?.user?.email ||
    "Unknown student";
  const getScholarshipLabel = (record: (typeof records)[number]) =>
    record.scholarship?.name ||
    scholarships.find((scholarship) => scholarship.id === record.scholarshipId)
      ?.name ||
    "Unknown scholarship";
  const getSemesterLabel = (record: (typeof records)[number]) => {
    const semester =
      record.semester ||
      semesters.find((item) => item.id === record.semesterId);
    return semester
      ? `${semester.name}${semester.academicYear?.name ? ` (${semester.academicYear.name})` : ""}`
      : "Unknown semester";
  };

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Student Scholarships
          </h2>
          <p className="text-sm">Manage scholarship assignments</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar />
          <StudentScholarshipCreate
            students={students}
            scholarships={scholarships}
            semesters={semesters}
          />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="w-full min-w-275 table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-72" />
            <col className="w-64" />
            <col className="w-48" />
            <col className="w-40" />
            <col className="w-40" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {[
                "#",
                "Student",
                "Scholarship",
                "Semester",
                "Status",
                "Action",
              ].map((heading) => (
                <TableHead
                  key={heading}
                  className="font-semibold text-gray-700"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No student scholarships found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <BadgePercent className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {getStudentLabel(record)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate">
                    {getScholarshipLabel(record)}
                  </TableCell>
                  <TableCell className="truncate">
                    {getSemesterLabel(record)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {record.status || "PENDING"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <StudentScholarshipCreate
                        students={students}
                        scholarships={scholarships}
                        semesters={semesters}
                        record={record}
                        trigger="edit"
                      />
                      <StudentScholarshipDelete
                        recordId={record.id}
                        recordName={getStudentLabel(record)}
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

export default StudentScholarshipTable;
