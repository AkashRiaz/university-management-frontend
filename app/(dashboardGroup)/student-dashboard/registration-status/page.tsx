import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyRegistrationsAction } from "../_actions/registrationActions";
import type { IRegistration } from "@/types/registration.type";

const statusIcon = (status: IRegistration["status"]) => {
  if (status === "APPROVED" || status === "COMPLETED") return <CheckCircle2 className="size-5 text-emerald-500" />;
  if (status === "REJECTED" || status === "CANCELLED" || status === "DROPPED") return <XCircle className="size-5 text-destructive" />;
  return <Clock3 className="size-5 text-amber-500" />;
};

export default async function RegistrationStatusPage() {
  const result = await getMyRegistrationsAction({ limit: "100" });
  const registrations = Array.isArray(result.data) ? (result.data as IRegistration[]) : [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Registration status</h1>
          <p className="text-sm text-muted-foreground">Track your semester registration requests and approval progress.</p>
        </div>
      </header>
      {!result.success && <p className="text-sm text-destructive">{result.message}</p>}
      {result.success && registrations.length === 0 && (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">You have no registrations yet. Start one from Course Registration.</CardContent></Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {registrations.map((registration) => (
          <Card key={registration.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">{registration.registrationNumber}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {registration.semester?.name || registration.semesterId} · Program semester {registration.programSemesterNumber}
                </p>
              </div>
              <Badge variant={registration.status === "REJECTED" ? "destructive" : registration.status === "APPROVED" ? "secondary" : "outline"}>
                {registration.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              {statusIcon(registration.status)}
              <span>{registration.courses?.length || 0} selected course(s)</span>
              <span className="ml-auto">{new Date(registration.updatedAt).toLocaleDateString()}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
