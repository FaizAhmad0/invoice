import { ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AccountantTransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      <EmptyState
        icon={<ReceiptText className="size-10 text-muted-foreground" />}
        title="Transaction history"
        message="Transactions will appear here."
      />
    </div>
  );
}
