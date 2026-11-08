"use client";

import { memo, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Mail, Phone, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Student } from "../../_actions/studentActions";
import StudentDelete from "./StudentDelete";
import StudentRestore from "./StudentRestore";

export type VirtualStudent = Student & { isDemo?: boolean };

const ROW_HEIGHT = 64;
// One grid template shared by the header and the rows keeps the columns aligned.
const GRID =
  "grid grid-cols-[56px_minmax(220px,1.6fr)_minmax(150px,1fr)_120px_110px_120px_170px] items-center gap-3 px-3";

const StudentRow = memo(function StudentRow({
  student,
  index,
  isDeleted,
}: {
  student: VirtualStudent;
  index: number;
  isDeleted: boolean;
}) {
  const name = student.user?.name || "Unknown Student";
  return (
    <div className={`${GRID} h-full border-b text-sm transition-colors hover:bg-muted/50`}>
      <span className="font-medium text-gray-500">{index + 1}</span>
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {student.user?.email || "-"}
        </p>
      </div>
      <span className="flex items-center gap-2 truncate">
        <Phone className="h-4 w-4 shrink-0" />
        {student.phone || "-"}
      </span>
      <span className="font-medium">{student.admissionYear || "-"}</span>
      <span>
        <Badge variant="secondary" className="font-medium">
          {student.department?.code || "-"}
        </Badge>
      </span>
      <span>
        <Badge variant="outline" className="font-medium">
          {student.program?.code || "-"}
        </Badge>
      </span>
      <div className="flex justify-end gap-2">
        {student.isDemo ? (
          <span className="text-xs text-muted-foreground">demo row</span>
        ) : (
          <>
            <Link
              href={`/admin-dashboard/students/${student.id}`}
              className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
            >
              Edit
            </Link>
            {isDeleted ? (
              <StudentRestore studentId={student.id} studentName={name} />
            ) : (
              <StudentDelete studentId={student.id} studentName={name} />
            )}
          </>
        )}
      </div>
    </div>
  );
});

/**
 * Virtualized "all students" list. With 1,000+ records the DOM only ever holds
 * the ~15 visible rows plus an overscan of 8 above/below, instead of 1,000+ <tr>s.
 */
export default function VirtualStudentList({
  students,
  isDeleted,
  totalOnServer,
}: {
  students: VirtualStudent[];
  isDeleted: boolean;
  totalOnServer?: number;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [
        student.user?.name,
        student.user?.email,
        student.phone,
        student.department?.code,
        student.program?.code,
      ].some((field) => field?.toLowerCase().includes(term)),
    );
  }, [students, debouncedQuery]);

  const scrollReference = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollReference.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    getItemKey: (index) => filtered[index].id,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length.toLocaleString()} of {students.length.toLocaleString()} loaded students
          {totalOnServer && totalOnServer > students.length
            ? ` (${totalOnServer.toLocaleString()} on the server)`
            : ""}
        </p>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter loaded students..."
            aria-label="Filter loaded students"
            className="h-8 pl-9"
          />
        </div>
      </div>

      <div
        ref={scrollReference}
        className="max-h-[70vh] overflow-auto rounded-md border"
        role="table"
        aria-label="All students"
        aria-rowcount={filtered.length}
      >
        <div className="min-w-[960px]">
          {/* Sticky header */}
          <div
            role="row"
            className={`${GRID} sticky top-0 z-10 h-10 border-b bg-gray-50 text-sm font-semibold text-gray-700 dark:bg-muted dark:text-foreground`}
          >
            <span>#</span>
            <span>Student</span>
            <span>Contact</span>
            <span>Admission Year</span>
            <span>Department</span>
            <span>Program</span>
            <span className="text-right">Action</span>
          </div>

          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No students match your filter.
            </p>
          ) : (
            <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
              {virtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  role="row"
                  aria-rowindex={virtualRow.index + 1}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <StudentRow
                    student={filtered[virtualRow.index]}
                    index={virtualRow.index}
                    isDeleted={isDeleted}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
