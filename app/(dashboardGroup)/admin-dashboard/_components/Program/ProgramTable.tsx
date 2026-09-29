"use server";

import {
  AlertCircle,
  BookOpen,
  Building2,
  Clock,
  CreditCard,
} from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProgramsAction } from "../../_actions/programActions";
import Link from "next/link";

type ProgramTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const ProgramTable = async ({ searchParams }: ProgramTableProps) => {
  const result = await getAllProgramsAction({ query: searchParams });
  const programs = result.data || [];
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
          Failed to load programs
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading programs."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <h2 className="text-lg font-semibold">Programs</h2>
          <p className="text-sm">Manage all registered programs</p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <SearchBar />
          </div>
          <div>
            <Link
              href="/admin-dashboard/create-program"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Add Program
            </Link>
          </div>
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
                Program
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Department
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Duration
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Credits
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {programs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              programs.map((program, index) => (
                <TableRow key={program.id} className="transition-colors">
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {program.name || "Unnamed program"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {program.code || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <Badge variant="outline">
                        {program.department?.code || "-"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4" />
                      {program.durationYears
                        ? `${program.durationYears} years`
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="size-4" />
                      {program.totalCredits || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="rounded-md border px-3 py-1.5 text-sm font-medium transition">
                      View
                    </button>
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

export default ProgramTable;
