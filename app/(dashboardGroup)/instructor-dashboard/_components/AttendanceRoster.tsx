"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  saveAttendanceAction,
  type AttendanceStudent,
} from "../_actions/attendanceActions";

const statuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

export default function AttendanceRoster({
  sessionId,
  students,
}: {
  sessionId: string;
  students: AttendanceStudent[];
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      students.map((student) => [
        student.id,
        student.attendanceRecord?.status || "PRESENT",
      ]),
    ),
  );
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const result = await saveAttendanceAction(
        sessionId,
        students.map((student) => ({
          courseRegistrationId: student.id,
          status: values[student.id] || "PRESENT",
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
          </p>
        </div>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save attendance"}
        </Button>
      </div>
      <div className="divide-y">
        {students.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">
            No students found for this session.
          </p>
        ) : (
          students.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium">
                  {student.student?.user?.name || `Student ${index + 1}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {student.student?.user?.email ||
                    student.student?.rollNumber ||
                    ""}
                </p>
              </div>
              <Select
                value={values[student.id]}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    [student.id]: value || "PRESENT",
                  }))
                }
              >
                <SelectTrigger className="w-32">
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
          ))
        )}
      </div>
    </div>
  );
}
