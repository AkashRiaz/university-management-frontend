import { CreditCard, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyPaymentsAction } from "../_actions/paymentActions";

type Payment = {
  id: string;
  transactionId?: string;
  amount?: number | string;
  status?: string;
  createdAt?: string;
};

export default async function PaymentHistoryPage() {
  const result = await getMyPaymentsAction();
  const payments = Array.isArray(result.data) ? (result.data as Payment[]) : [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CreditCard className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Payment history</h1>
          <p className="text-sm text-muted-foreground">Review your bKash payment transactions and statuses.</p>
        </div>
      </header>
      {!result.success && <p className="text-sm text-destructive">{result.message}</p>}
      {result.success && payments.length === 0 && (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">No payment transactions found.</CardContent></Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base"><ReceiptText className="size-4" />{payment.transactionId || payment.id}</CardTitle>
              <Badge variant={payment.status === "COMPLETED" ? "secondary" : payment.status === "FAILED" ? "destructive" : "outline"}>{payment.status || "UNKNOWN"}</Badge>
            </CardHeader>
            <CardContent className="flex justify-between text-sm text-muted-foreground">
              <span>Amount: ৳{payment.amount ?? "unknown"}</span>
              {payment.createdAt && <span>{new Date(payment.createdAt).toLocaleDateString()}</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
