import Link from "next/link";
import { getMyInvoicesAction } from "../../(dashboardGroup)/student-dashboard/_actions/paymentActions";
import type { IInvoice } from "@/types/invoice.type";

type PaymentResultProps = {
  title: string;
  description: string;
  tone: "success" | "warning" | "error";
};

export default async function PaymentResult({
  title,
  description,
  tone,
}: PaymentResultProps) {
  const result = await getMyInvoicesAction();
  const invoices = Array.isArray(result.data) ? (result.data as IInvoice[]) : [];
  const paidInvoice = invoices.find(
    (invoice) => invoice.status === "PAID" && Number(invoice.dueAmount ?? 1) === 0,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-5 p-6">
      <div className={`rounded-lg border p-6 ${tone === "success" ? "border-emerald-500/40 bg-emerald-500/10" : tone === "warning" ? "border-amber-500/40 bg-amber-500/10" : "border-destructive/30 bg-destructive/10"}`}>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {tone === "success" && (
          <p className="mt-4 text-sm font-medium">
            {paidInvoice ? "Invoice verified as paid in full." : "Payment is still being verified. Please refresh shortly."}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/student-dashboard/course-registration" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Return to course registration
        </Link>
        {tone !== "success" && (
          <Link href="/student-dashboard/course-registration" className="rounded-md border px-4 py-2 text-sm font-medium">
            Try again
          </Link>
        )}
      </div>
    </main>
  );
}
