"use client";

import {
  memo,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  saveAttendanceAction,
  type AttendanceStudent,
} from "../_actions/attendanceActions";

const statuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
const ROW_HEIGHT = 73; // estimated row height in px (measured precisely after render)

/* ------------------------------------------------------------------ */
/* Attendance store: selective subscriptions per student              */
/* ------------------------------------------------------------------ */
// Before: all statuses lived in one `useState` object in the roster, so
// changing ONE student's status re-rendered the roster and EVERY row.
// Now values live outside React; each row subscribes only to its own key, so a
// change re-renders exactly one row and the roster itself does not re-render.
type AttendanceStore = ReturnType<typeof createAttendanceStore>;

function createAttendanceStore(initial: Record<string, string>) {
  const values = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<() => void>>();
  return {
    get: (id: string) => values.get(id) || "PRESENT",
    set(id: string, value: string) {
      if (values.get(id) === value) return;
      values.set(id, value);
      listeners.get(id)?.forEach((listener) => listener());
    },
    subscribe(id: string, listener: () => void) {
      if (!listeners.has(id)) listeners.set(id, new Set());
      listeners.get(id)!.add(listener);
      return () => listeners.get(id)?.delete(listener);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Row                                                                */
/* ------------------------------------------------------------------ */
const AttendanceRow = memo(function AttendanceRow({
  student,
  index,
  store,
}: {
  student: AttendanceStudent;
  index: number;
  store: AttendanceStore;
}) {
  const value = useSyncExternalStore(
    (listener) => store.subscribe(student.id, listener),
    () => store.get(student.id),
    () => store.get(student.id),
  );

  return (
    <div className="flex items-center justify-between gap-4 border-b p-4">
      <div className="min-w-0">
        <p className="truncate font-medium">
          {student.student?.user?.name || `Student ${index + 1}`}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {student.student?.user?.email || student.student?.rollNumber || ""}
        </p>
      </div>
      <Select
        value={value}
        onValueChange={(next) => store.set(student.id, next || "PRESENT")}
      >
        <SelectTrigger className="w-32 shrink-0" aria-label={`Attendance for ${student.student?.user?.name || `student ${index + 1}`}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Roster                                                             */
/* ------------------------------------------------------------------ */
export default function AttendanceRoster({
  sessionId,
  students,
  isDemo = false,
}: {
  sessionId: string;
  students: AttendanceStudent[];
  /** Generated representative data (?demo=N): saving is disabled. */
  isDemo?: boolean;
}) {
  // Created once (lazy initializer) – not on every render.
  const [store] = useState(() =>
    createAttendanceStore(
      Object.fromEntries(
        students.map((student) => [
          student.id,
          student.attendanceRecord?.status || "PRESENT",
        ]),
      ),
    ),
  );
  const [pending, startTransition] = useTransition();

  // Debounced filter: the input updates instantly, filtering waits 250 ms.
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  // Expensive filtering is memoized and only re-runs when the debounced query
  // or the data changes – not on every render or every keystroke.
  const filteredStudents = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [
        student.student?.user?.name,
        student.student?.user?.email,
        student.student?.rollNumber,
      ].some((field) => field?.toLowerCase().includes(term)),
    );
  }, [students, debouncedQuery]);

  // Virtualization: only the visible rows (+ overscan) exist in the DOM.
  const scrollReference = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: filteredStudents.length,
    getScrollElement: () => scrollReference.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    getItemKey: (index) => filteredStudents[index].id,
  });

  const save = () =>
    startTransition(async () => {
      const result = await saveAttendanceAction(
        sessionId,
        students.map((student) => ({
          courseRegistrationId: student.id,
          status: store.get(student.id),
        })),
      );
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });

  return (
    <div className="rounded-xl border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h1 className="text-xl font-semibold">Attendance roster</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} enrolled students
            {debouncedQuery && ` · ${filteredStudents.length} shown`}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter students..."
              aria-label="Filter students"
              className="pl-9"
            />
          </div>
          <Button onClick={save} disabled={pending || isDemo}>
            {pending ? "Saving..." : "Save attendance"}
          </Button>
        </div>
      </div>

      {isDemo && (
        <p className="border-b bg-muted/40 px-5 py-2 text-xs text-muted-foreground">
          Performance demo: {students.length.toLocaleString()} generated students. Saving is disabled.
        </p>
      )}

      {filteredStudents.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          {students.length === 0
            ? "No students found for this session."
            : "No students match your filter."}
        </p>
      ) : (
        <div
          ref={scrollReference}
          className="max-h-[70vh] overflow-y-auto"
          role="list"
          aria-label="Students"
        >
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const student = filteredStudents[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  role="listitem"
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <AttendanceRow
                    student={student}
                    index={virtualRow.index}
                    store={store}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
