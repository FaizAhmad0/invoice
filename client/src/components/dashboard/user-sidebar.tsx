"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Globe,
  X,
  Lock,
} from "lucide-react";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logoutAction: () => Promise<void>;
  enrollmentIdAmazon?: string;
  enrollmentIdWebsite?: string;
}

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: NavSubItem[];
  enrollmentId?: string;
}

const amazonItems: NavSubItem[] = [
  { label: "Account", href: "/dashboard/amazon/account" },
  { label: "Orders", href: "/dashboard/amazon/orders" },
  { label: "Products", href: "/dashboard/amazon/products" },
];

const websiteItems: NavSubItem[] = [
  { label: "Work Status", href: "/dashboard/website/work-status" },
  { label: "Payment Status", href: "/dashboard/website/payment-status" },
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
  enrollmentIdAmazon,
  enrollmentIdWebsite,
}: UserSidebarProps) {
  const pathname = usePathname();
  const [expandedAmazon, setExpandedAmazon] = useState(true);
  const [expandedWebsite, setExpandedWebsite] = useState(true);

  const navigation: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "Amazon",
      icon: ShoppingCart,
      subItems: amazonItems,
      enrollmentId: enrollmentIdAmazon,
    },
    {
      label: "Website",
      icon: Globe,
      subItems: websiteItems,
      enrollmentId: enrollmentIdWebsite,
    },
  ];

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

        <nav className="flex-1 overflow-y-auto px-0 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isLocked = item.label !== "Dashboard" && !item.enrollmentId;
            const isClickable = !isLocked;

            if (item.subItems) {
              const isExpanded = item.label === "Amazon" ? expandedAmazon : expandedWebsite;
              const setExpanded = item.label === "Amazon" ? setExpandedAmazon : setExpandedWebsite;
              const active = item.subItems.some(sub => isActivePath(pathname, sub.href));

              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    onClick={() => isClickable && setExpanded(!isExpanded)}
                    className={`group relative flex items-center justify-between px-5 py-[11px] text-[10px] font-semibold uppercase tracking-[0.1em] transition ${
                      isLocked
                        ? "cursor-not-allowed text-slate-400 opacity-60"
                        : active
                          ? "bg-blue-50 text-blue-700"
                          : isExpanded
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {isLocked && <Lock className="h-3 w-3 text-slate-400" />}
                    </div>
                    {isClickable && (
                      isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden bg-slate-50/50"
                      >
                        <div className="py-1">
                          {item.subItems.map((sub, subIndex) => {
                            const subActive = isActivePath(pathname, sub.href);
                            return (
                              <motion.div
                                key={sub.href}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: subIndex * 0.06,
                                  ease: "easeOut",
                                }}
                              >
                                <Link
                                  href={isClickable ? sub.href : "#"}
                                  onClick={isClickable ? onClose : (e) => e.preventDefault()}
                                  className={`flex items-center px-12 py-2 text-[9px] font-bold uppercase tracking-[0.05em] transition ${
                                    isLocked
                                      ? "cursor-not-allowed text-slate-300 opacity-60"
                                      : subActive
                                        ? "text-blue-700"
                                        : "text-slate-500 hover:text-slate-950"
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const active = item.href
              ? isActivePath(
                  pathname,
                  item.href,
                  item.label === "Dashboard"
                )
              : false;
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
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