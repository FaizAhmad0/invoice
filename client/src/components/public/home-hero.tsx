"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Package,
  Pause,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { apiGet } from "@/lib/axios";

type Catalog = {
  banners: { image: string; product: string }[];
  products: { _id: string; title: string }[];
};

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (broken || !/^(https?:\/\/|\/(?!\/))/.test(src)) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Package className="size-12 text-primary/30" aria-label={alt} />
      </div>
    );
  }

  // Featured image hosts come from the catalog, just as on /products.
  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
      onError={() => setBroken(true)}
    />
  );
  /* eslint-enable @next/next/no-img-element */
}

function SellingIllustration() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["catalog", ""],
    queryFn: ({ signal }) =>
      apiGet<{ data: Catalog }>("/products?", { signal }),
    staleTime: 60000,
  });
  const slides = (data?.data.banners ?? []).slice(0, 5);
  const count = slides.length;
  const activeIndex = count ? index % count : 0;

  useEffect(() => {
    if (count < 2 || paused || interacting) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    function syncTimer() {
      clearInterval(timer);
      if (!reducedMotion.matches) {
        timer = setInterval(
          () => setIndex((current) => (current + 1) % count),
          1000,
        );
      }
    }
    syncTimer();
    reducedMotion.addEventListener("change", syncTimer);
    return () => {
      clearInterval(timer);
      reducedMotion.removeEventListener("change", syncTimer);
    };
  }, [count, paused, interacting]);

  return (
    <section
      aria-label="Featured products"
      aria-roledescription="carousel"
      aria-busy={isPending}
      className="relative order-1 mx-auto w-full min-w-0 max-w-[460px] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-border/80 sm:bg-card sm:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)] lg:order-2"
    >
      <div className="relative hidden h-12 items-center justify-between border-b border-border/70 bg-muted/40 px-4 sm:flex">
        <div className="invisible flex items-center gap-1.5 sm:visible" aria-hidden="true">
          <span className="size-2.5 rounded-full border border-black/5 bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full border border-black/5 bg-[#febc2e]" />
          <span className="size-2.5 rounded-full border border-black/5 bg-[#28c840]" />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
          The Star Sellingz Edit
        </p>
        <Package
          className="size-3.5 text-muted-foreground/50"
          aria-hidden="true"
        />
      </div>
      {isPending ? (
        <div
          role="status"
          className="mx-4 grid aspect-[4/3] grid-cols-5 items-center gap-2"
        >
          <span className="sr-only">Loading featured products...</span>
          {Array.from({ length: 5 }, (_, position) => (
            <div
              key={position}
              className="aspect-[3/4] w-full -skew-y-3 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : isError || !count ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-muted-foreground" role="status">
            {isError
              ? "Unable to load featured products."
              : "Featured products are coming soon."}
          </p>
          {isError ? (
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Try again
            </button>
          ) : (
            <Link
              href="/products"
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              Explore products
            </Link>
          )}
        </div>
      ) : (
        <div
          className="sm:bg-gradient-to-b sm:from-muted/20 sm:via-background sm:to-primary/[0.04]"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setInteracting(false);
          }}
        >
          <div className="relative mx-4 aspect-[4/3] isolate">
            {slides.map((slide, position) => {
              const offset =
                ((position - activeIndex + count + Math.floor(count / 2)) %
                  count) -
                Math.floor(count / 2);
              const title =
                data?.data.products.find(
                  (product) => product._id === slide.product,
                )?.title ?? `Featured product ${position + 1}`;

              return (
                <Link
                  key={`${slide.product}-${slide.image}-${position}`}
                  href={`/products?product=${encodeURIComponent(slide.product)}`}
                  aria-label={`Explore ${title}`}
                  aria-current={offset === 0 ? "true" : undefined}
                  className="absolute left-1/2 top-1/2 block aspect-[3/4] w-[36%] overflow-hidden rounded-xl bg-muted shadow-[0_12px_24px_-10px_rgba(15,23,42,0.3)] ring-1 ring-black/5 transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                  style={{
                    zIndex: count - Math.abs(offset),
                    transform: `translate(-50%, -50%) translateX(${offset * 38}%) translateY(${Math.abs(offset) * 5}%) rotate(${offset * 4 - 2}deg) skewY(-2deg) scale(${1 - Math.abs(offset) * 0.06})`,
                  }}
                >
                  <ProductImage
                    key={slide.image}
                    src={slide.image}
                    alt={title}
                  />
                </Link>
              );
            })}
          </div>
          {count > 1 && (
            <div className="relative z-10 hidden items-center justify-center gap-1 border-t border-border/60 bg-background/80 px-2 py-3 sm:flex sm:gap-2">
              <button
                type="button"
                aria-label="Previous product"
                onClick={() => setIndex((activeIndex + count - 1) % count)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {slides.map((_, position) => (
                  <button
                    key={position}
                    type="button"
                    aria-label={`Show product ${position + 1}`}
                    aria-current={activeIndex === position ? "true" : undefined}
                    onClick={() => setIndex(position)}
                    className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span
                      className={`h-2 rounded-full ${activeIndex === position ? "w-5 bg-primary" : "w-2 bg-primary/25"}`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Next product"
                onClick={() => setIndex((activeIndex + 1) % count)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                aria-label={paused ? "Play carousel" : "Pause carousel"}
                onClick={() => setPaused((current) => !current)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {paused ? (
                  <Play className="size-4" />
                ) : (
                  <Pause className="size-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

const nextSteps = [
  {
    number: "01",
    title: "Discover your products",
    text: "Find inspiration for your next opportunity.",
    href: "/products",
    icon: Package,
  },
  {
    number: "02",
    title: "Understand your margins",
    text: "See the bigger picture behind every sale.",
    href: "/margins",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Tell your brand story",
    text: "Make your presence feel like you.",
    href: "/social-media-content",
    icon: Sparkles,
  },
];

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -left-64 top-0 size-[500px] rounded-full bg-primary/[0.025] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1150px] px-5 pb-6 pt-2 sm:px-8 lg:px-12 ">
        <div className="grid items-center gap-10 pt-8 lg:min-h-[min(520px,calc(100svh-216px))] lg:grid-cols-2 lg:gap-6">
          <div className="order-2 min-w-0 max-w-xl lg:order-1 lg:pr-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-primary/[0.04] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-primary sm:text-[10px]">
              <Sparkles
                className="size-3.5 shrink-0"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Empowering local. Thinking global.
            </div>
            <h1
              id="hero-heading"
              className="mt-6 text-balance font-heading text-[clamp(2.25rem,3.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.045em]"
            >
              Where Local Craft Meets
              <br />
              <span className="text-primary">Global Opportunities.</span>
            </h1>
            <p className="mt-6 max-w-[390px] text-[15px] leading-[1.8] text-muted-foreground">
              Discover unique products crafted by talented Indian artisans.
              Explore new opportunities, grow your business, and bring local
              craftsmanship to customers worldwide.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex min-h-12 items-center justify-center gap-6 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_6px_18px_-6px_var(--primary)] transition-[background-color,box-shadow] hover:bg-primary/90 hover:shadow-[0_8px_22px_-6px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Explore Products{" "}
                <ArrowUpRight
                  className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/about"
                className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-xl border border-border/80 bg-background px-5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/25 hover:bg-primary/[0.03] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Discover Our Story
                <ArrowRight
                  className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="mt-7 flex max-w-[390px] items-center gap-3 border-t border-border/70 pt-5 text-[11px] leading-5 text-muted-foreground">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.05]">
                <Globe2
                  className="size-4 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              Bridging Indian craftsmanship with global markets.
            </div>
          </div>
          <SellingIllustration />
        </div>

        <div className="mt-9 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0 lg:mt-12">
          {nextSteps.map(({ number, title, text, href, icon: Icon }) => (
            <Link
              key={number}
              href={href}
              className="group flex items-start gap-3 py-4 transition-colors hover:bg-primary/[0.025] focus-visible:outline-2 focus-visible:outline-primary md:px-5 md:first:pl-0 md:last:pr-0"
            >
              <span className="mt-0.5 text-[11px] font-medium text-primary/60">
                {number}
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {text}
                </p>
              </div>
              <Icon
                className="mt-0.5 size-5 shrink-0 text-primary/70 transition-colors group-hover:text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
