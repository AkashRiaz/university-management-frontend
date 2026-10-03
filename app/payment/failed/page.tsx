import PaymentResult from "../_components/PaymentResult";

export default function PaymentFailedPage() {
  return (
    <PaymentResult
      title="Payment failed"
      description="bKash could not complete the payment. Please try again."
      tone="error"
    />
  );
}
