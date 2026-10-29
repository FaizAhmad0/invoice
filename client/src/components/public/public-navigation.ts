export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Margins", href: "/margins" },
  { label: "Achievements", href: "/achievements" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Social Media Content", href: "/social-media-content" },
  { label: "About Us", href: "/about" },
] as const;

export const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  supervisor: "/supervisor",
  accountant: "/accountant",
  user: "/dashboard",
};
