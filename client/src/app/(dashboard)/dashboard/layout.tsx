"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { UserSidebar } from "@/components/dashboard/user-sidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    const body = document.body;
    body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <DashboardNavbar onMenuToggle={() => setIsSidebarOpen(true)} />
      <UserSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        logoutAction={async () => logoutMutation.mutate()}
        enrollmentIdAmazon={user?.enrollmentIdAmazon}
        enrollmentIdWebsite={user?.enrollmentIdWebsite}
      />

      <div className="pt-[72px] lg:pl-[240px]">
        <main className="h-[calc(100vh-72px)] overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  );
}