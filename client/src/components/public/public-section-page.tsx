import Link from "next/link";
import { ArrowLeft, ArrowUpRight, type LucideIcon, Package } from "lucide-react";

const sections = {
  products: {
    label: "Products",
    title: "Great journeys start with great products.",
    description: "Discover the collection and find inspiration for your next selling opportunity.",
    emptyTitle: "A new collection is on its way",
    emptyDescription: "Product listings will be available here soon. In the meantime, get to know the story behind Star Sellingz.",
    icon: Package,
  },
} satisfies Record<string, { label: string; title: string; description: string; emptyTitle: string; emptyDescription: string; icon: LucideIcon }>;

export type PublicSection = keyof typeof sections;

export function PublicSectionPage({ section }: { section: PublicSection }) {
  const { label, title, description, emptyTitle, emptyDescription, icon: Icon } = sections[section];

  return (
    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-20">
      <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ArrowLeft className="size-4" aria-hidden="true" /> Back to Home</Link>
      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{label}</p>
      <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
      <div className="mt-12 rounded-2xl border border-border bg-primary/[0.025] px-6 py-12 text-center sm:mt-16 sm:py-16">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-background text-primary"><Icon className="size-6" strokeWidth={1.5} aria-hidden="true" /></span>
        <h2 className="mt-6 font-heading text-xl font-semibold tracking-tight">{emptyTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">{emptyDescription}</p>
        <Link href="/about" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Get to know us <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
