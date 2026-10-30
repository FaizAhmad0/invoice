import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
      <EmptyState
        icon={<CreditCard className="size-10 text-muted-foreground" />}
        title="Payment details"
        message="Your payment information will appear here."
      />
    </div>
  );
}
