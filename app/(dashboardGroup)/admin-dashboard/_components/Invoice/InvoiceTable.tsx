"use server";

import TableBackButton from "@/components/ui/TableBackButton";
import { AlertCircle, CalendarClock, Eye, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { CustomPagination } from "@/components/ui/CustomPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllStudentsActionForAdmin } from "../../_actions/studentActions";
import { getAllSemestersAction } from "../../_actions/semesterActions";
import { getAllInvoicesAction } from "../../_actions/invoiceActions";
import InvoiceCreate from "./InvoiceCreate";
import InvoiceDelete from "./InvoiceDelete";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
};

const InvoiceTable = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const [result, studentResult, semesterResult] = await Promise.all([
    getAllInvoicesAction({ query: searchParams }),
    getAllStudentsActionForAdmin({ query: { limit: "100", isDeleted: "false" } }),
    getAllSemestersAction({ query: { limit: "100" } }),
  ]);
  const invoices = result.data || [];
  const students = studentResult?.data || [];
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
          Failed to load invoices
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  const studentName = (studentId: string) => {
    const student = students.find((item) => item.id === studentId);
    return student?.user?.name || student?.user?.email || studentId;
  };
  const semesterName = (semesterId: string) => {
    const semester = semesters.find((item) => item.id === semesterId);
    return semester
      ? `${semester.name}${semester.academicYear?.name ? ` (${semester.academicYear.name})` : ""}`
      : semesterId;
  };

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Invoices
          </h2>
          <p className="text-sm">Manage all student invoices</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar compact />
          <InvoiceCreate students={students} semesters={semesters} />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">Invoice</TableHead>
              <TableHead className="font-semibold text-gray-700">Student</TableHead>
              <TableHead className="font-semibold text-gray-700">Semester</TableHead>
              <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Total</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice, index) => (
                <TableRow key={invoice.id}>
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ReceiptText className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {invoice.invoiceNumber || invoice.id.slice(0, 8)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.student?.user?.name || studentName(invoice.studentId)}</TableCell>
                  <TableCell>{invoice.semester ? `${invoice.semester.name}${invoice.semester.academicYear?.name ? ` (${invoice.semester.academicYear.name})` : ""}` : semesterName(invoice.semesterId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarClock className="size-4" />
                      {formatDate(invoice.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.totalAmount ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "PAID" ? "secondary" : "outline"}>
                      {invoice.status || "UNPAID"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <InvoiceCreate
                        invoice={invoice}
                        students={students}
                        semesters={semesters}
                        trigger="edit"
                      />
                      <Link
                        href={`/admin-dashboard/invoices/${invoice.id}`}
                        aria-label={`View items for ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`}
                        title="View invoice items"
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <InvoiceDelete
                        invoiceId={invoice.id}
                        invoiceName={invoice.invoiceNumber || invoice.id.slice(0, 8)}
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

export default InvoiceTable;
