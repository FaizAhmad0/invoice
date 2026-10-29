"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_ITEMS, ROLE_DASHBOARD } from "./public-navigation";

export function PublicNavbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const workHref = user
    ? (ROLE_DASHBOARD[user.role] ?? "/dashboard")
    : "/login";

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    }

    const desktop = window.matchMedia("(min-width: 1280px)");
    function handleResize() {
      if (desktop.matches) setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    desktop.addEventListener("change", handleResize);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      desktop.removeEventListener("change", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Star Sellingz home"
          onClick={() => setIsMenuOpen(false)}
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={40}
            className="h-11 w-auto object-contain sm:h-12"
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-5 xl:flex"
        >
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap py-2 text-[14px] font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                pathname === item.href
                  ? "text-primary after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-foreground/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={workHref}
            className="hidden min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:inline-flex"
          >
            My Work <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            aria-controls="public-mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary xl:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="public-mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-4rem-2px)] overflow-y-auto border-t border-border bg-background px-5 py-4 sm:px-8 xl:hidden"
        >
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary",
                pathname === item.href
                  ? "bg-primary/5 text-primary"
                  : "text-foreground/75",
              )}
            >
              {item.label}{" "}
              <ArrowUpRight className="size-4 opacity-50" aria-hidden="true" />
            </Link>
          ))}
          <Link
            href={workHref}
            onClick={() => setIsMenuOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-between rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
          >
            My Work <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </nav>
      )}
    </header>
  );
}
