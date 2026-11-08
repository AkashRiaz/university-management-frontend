"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, Building2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import FacultyDescriptionCell from "../Faculty/FacultyDescriptionCell";
import { getAllDepartmentsAction } from "../../_actions/departmentActions";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import DepartmentDelete from "./DepartmentDelete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DepartmentTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const DepartmentTable = async ({ searchParams }: DepartmentTableProps) => {
  const result = await getAllDepartmentsAction({ query: searchParams });
  const departments = result.data || [];
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
          Failed to load departments
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading departments."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Departments
          </h2>
          <p className="text-sm">Manage all registered departments</p>
        </div>

        <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
          <div>
            <SearchBar compact />
          </div>
          <div>
            <Link
              href="/admin-dashboard/create-department"
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition hover:bg-primary/90"
            >
              Add Department
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-20 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Code
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Contact
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Location
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Faculty
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No departments found.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department, index) => (
                <TableRow key={department.id} className="transition-colors">
                  <TableCell className="w-20 font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{department.name}</p>
                        <FacultyDescriptionCell
                          description={department.description || undefined}
                          limit={50}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {department.code}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5" />
                        {department.email || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5" />
                        {department.phone || "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4" />
                      {department.building || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{department.faculty?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin-dashboard/departments/${department.id}`}
                        className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
                      >
                        Edit
                      </Link>
                      <DepartmentDelete
                        departmentId={department.id}
                        departmentName={department.name}
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

export default DepartmentTable;
