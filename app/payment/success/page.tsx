import PaymentResult from "../_components/PaymentResult";

export default function PaymentSuccessPage() {
  return (
    <PaymentResult
      title="Payment successful"
      description="bKash has returned a successful payment result."
      tone="success"
    />
  );
}
