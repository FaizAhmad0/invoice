import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "./public-navigation";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1360px] px-5 pt-12 sm:px-8 lg:pt-16">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Link href="/" aria-label="Star Sellingz home" className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Image src="/logo.png" alt="Star Sellingz" width={846} height={290} sizes="200px" className="h-auto w-[200px]" />
            </Link>
            <p className="mt-4 max-w-64 text-sm leading-7 text-muted-foreground">
              Bridging local artisans to global markets. A world of possibility, built together.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Explore</h2>
            <ul className="mt-5 space-y-3">
              {PUBLIC_NAV_ITEMS.slice(1, 5).map((item) => (
                <li key={item.href}><Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Discover Star Sellingz</h2>
            <ul className="mt-5 space-y-3">
              {[PUBLIC_NAV_ITEMS[0], ...PUBLIC_NAV_ITEMS.slice(5)].map((item) => (
                <li key={item.href}><Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-primary/10 bg-primary/5 p-5">
            <Globe2 className="size-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            <h2 className="mt-4 font-heading text-lg font-semibold tracking-tight">Your next step starts here.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Access your workspace and keep your selling journey moving.</p>
            <Link href="/login" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Go to My Work <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Star Sellingz. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" aria-hidden="true" /> Local roots. Global ambitions.</p>
        </div>
      </div>
    </footer>
  );
}
