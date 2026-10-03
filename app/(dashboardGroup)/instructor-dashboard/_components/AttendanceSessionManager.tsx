"use client";

import { useActionState, useEffect, useTransition } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAttendanceSessionAction } from "../_actions/attendanceActions";

type Session = { id: string; date: string; topic?: string | null; _count?: { records?: number } };

export default function AttendanceSessionManager({ sectionId, sessions }: { sectionId: string; sessions: Session[] }) {
  const [state, action, pending] = useActionState(createAttendanceSessionAction, null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <form action={(formData) => startTransition(() => action(formData))} className="h-fit space-y-4 rounded-xl border p-5">
        <div>
          <h2 className="font-semibold">Create attendance session</h2>
          <p className="text-sm text-muted-foreground">Open a session for this assigned section.</p>
        </div>
        <input type="hidden" name="sectionId" value={sectionId} />
        <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" required /></div>
        <div className="space-y-2"><Label htmlFor="topic">Topic</Label><Input id="topic" name="topic" placeholder="Optional topic" /></div>
        <Button type="submit" disabled={pending || isPending}>{pending || isPending ? <Loader2 className="animate-spin" /> : <CalendarCheck />} Create session</Button>
      </form>
      <div className="rounded-xl border p-5">
        <h2 className="font-semibold">Attendance sessions</h2>
        <div className="mt-4 space-y-3">
          {sessions.length === 0 ? <p className="text-sm text-muted-foreground">No attendance sessions yet.</p> : sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
              <div><p className="font-medium">{new Date(session.date).toLocaleDateString()}</p><p className="text-sm text-muted-foreground">{session.topic || "No topic"} · {session._count?.records || 0} records</p></div>
              <a href={`/instructor-dashboard/attendance/${session.id}`} className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition hover:bg-accent">Take attendance</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
