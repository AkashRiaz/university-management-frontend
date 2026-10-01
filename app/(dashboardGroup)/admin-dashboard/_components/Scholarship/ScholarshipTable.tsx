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
import { getAllScholarshipsAction } from "../../_actions/scholarshipActions";
import ScholarshipCreate from "./ScholarshipCreate";
import ScholarshipDelete from "./ScholarshipDelete";

const formatBenefit = (scholarship: {
  percentage?: number | null;
  fixedAmount?: number | null;
}) => {
  if (scholarship.percentage !== null && scholarship.percentage !== undefined) {
    return `${Number(scholarship.percentage).toFixed(2)}%`;
  }
  if (
    scholarship.fixedAmount !== null &&
    scholarship.fixedAmount !== undefined
  ) {
    const amount = Number(scholarship.fixedAmount);
    return Number.isFinite(amount) ? amount.toFixed(2) : "-";
  }
  return "-";
};

const ScholarshipTable = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const result = await getAllScholarshipsAction({ query: searchParams });
  const scholarships = result.data || [];
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
          Failed to load scholarships
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
            Scholarships
          </h2>
          <p className="text-sm">Manage all registered scholarships</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar />
          <ScholarshipCreate />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="w-full min-w-275 table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-64" />
            <col className="w-40" />
            <col className="w-40" />
            <col className="w-40" />
            <col className="w-72" />
            <col className="w-40" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {[
                "#",
                "Name",
                "Type",
                "Benefit",
                "Status",
                "Description",
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
            {scholarships.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No scholarships found.
                </TableCell>
              </TableRow>
            ) : (
              scholarships.map((scholarship, index) => (
                <TableRow key={scholarship.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <BadgePercent className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate font-medium">
                        {scholarship.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {scholarship.type.replaceAll("_", " ")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatBenefit(scholarship)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {scholarship.status || "ACTIVE"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="truncate">
                      {scholarship.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <ScholarshipCreate
                        scholarship={scholarship}
                        trigger="edit"
                      />
                      <ScholarshipDelete
                        scholarshipId={scholarship.id}
                        scholarshipName={scholarship.name}
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

export default ScholarshipTable;
