import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AccountantUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <EmptyState
        icon={<Users className="size-10 text-muted-foreground" />}
        title="User directory"
        message="Users will appear here."
      />
    </div>
  );
}
