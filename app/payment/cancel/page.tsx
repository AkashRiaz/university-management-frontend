import PaymentResult from "../_components/PaymentResult";

export default function PaymentCancelPage() {
  return (
    <PaymentResult
      title="Payment cancelled"
      description="The bKash payment was cancelled. Your invoice remains unpaid."
      tone="warning"
    />
  );
}
