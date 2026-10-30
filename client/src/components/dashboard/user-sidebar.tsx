"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  X,
} from "lucide-react";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logoutAction: () => Promise<void>;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payment", href: "/dashboard/payment", icon: CreditCard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ReceiptText },
];

function isActivePath(
  pathname: string,
  href: string,
  exact = false
) {
  return exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function UserSidebar({
  isOpen,
  onClose,
  logoutAction,
}: UserSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-20 z-50 flex h-[calc(100vh-80px)] w-[240px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-[3.5px] inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-950 lg:hidden"
          aria-label="Close sidebar menu"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-slate-200 px-5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            User Workspace
          </p>
        </div>

        <nav aria-label="User navigation" className="flex-1 overflow-y-auto px-0 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href, item.href === "/dashboard");
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-5 py-[11px] text-[10px] font-semibold uppercase tracking-[0.1em] transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span
                  className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${
                    active ? "bg-blue-600" : "bg-transparent"
                  }`}
                />
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-4 py-5">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 hover:cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
