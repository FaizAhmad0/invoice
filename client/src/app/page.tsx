"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { HomeHero } from "@/components/public/home-hero";
import { PublicLayout } from "@/components/public/public-layout";
import { ROLE_DASHBOARD } from "@/components/public/public-navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const dashboard = ROLE_DASHBOARD[user.role] ?? "/dashboard";
      router.replace(dashboard);
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <PublicLayout>
      <HomeHero />
      {/* here */}
    </PublicLayout>
  );
}
