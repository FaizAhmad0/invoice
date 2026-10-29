import { PublicNavbar } from "./public-navbar";
import { PublicFooter } from "./public-footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicNavbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      <PublicFooter />
    </div>
  );
}
