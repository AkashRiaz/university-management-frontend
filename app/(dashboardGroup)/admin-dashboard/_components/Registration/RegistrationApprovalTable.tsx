"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IRegistration } from "@/types/registration.type";
import { approveRegistrationAction, rejectRegistrationAction } from "../../../_actions/registrationActions";

export default function RegistrationApprovalTable({ initialRegistrations }: { initialRegistrations: IRegistration[] }) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [loadingId, setLoadingId] = useState("");
  const [message, setMessage] = useState("");

  const updateStatus = async (registrationId: string, action: "approve" | "reject") => {
    setLoadingId(registrationId);
    setMessage("");
    const result = action === "approve"
      ? await approveRegistrationAction(registrationId)
      : await rejectRegistrationAction(registrationId);
    if (!result.success) setMessage(result.message);
    else setRegistrations((current) => current.map((item) => item.id === registrationId ? { ...item, status: action === "approve" ? "APPROVED" : "REJECTED" } : item));
    setLoadingId("");
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {message && <p className="border-b bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b bg-muted/40 text-left"><th className="p-3">Registration</th><th className="p-3">Student</th><th className="p-3">Semester</th><th className="p-3">Courses</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {registrations.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No registrations found.</td></tr> : registrations.map((registration) => {
              const busy = loadingId === registration.id;
              return <tr key={registration.id} className="border-b last:border-0"><td className="p-3 font-medium">{registration.registrationNumber}</td><td className="p-3">{registration.student?.user?.name || registration.student?.user?.email || registration.studentId}</td><td className="p-3">{registration.semester?.name || registration.semesterId}</td><td className="p-3">{registration.courses?.length || 0}</td><td className="p-3"><Badge variant={registration.status === "REJECTED" ? "destructive" : registration.status === "APPROVED" ? "secondary" : "outline"}>{registration.status}</Badge></td><td className="p-3 text-right">{registration.status === "PENDING" ? <div className="flex justify-end gap-2"><Button size="sm" onClick={() => updateStatus(registration.id, "approve")} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}Approve</Button><Button size="sm" variant="destructive" onClick={() => updateStatus(registration.id, "reject")} disabled={busy}><X className="size-4" />Reject</Button></div> : <span className="text-muted-foreground">No action</span>}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
