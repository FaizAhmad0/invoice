"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Package,
  Search,
  X,
} from "lucide-react";
import { apiGet } from "@/lib/axios";

type Product = {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  bulletPoints: string[];
  materials: string[];
  packageContents: string;
  category?: { name: string };
  price: number | null;
  colors: { _id: string; color: string; images: string[] }[];
  variants: {
    _id: string;
    colorId: string;
    size: string;
    stock: number;
    estimatedCostPrice: number | null;
    estimatedSellingPrice: number | null;
    estimatedCostPriceOOI: number | null;
    estimatedSalePriceOOI: number | null;
  }[];
};
type Catalog = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  categories: { _id: string; name: string }[];
  colors: string[];
  sizes: string[];
  banners: { image: string; product: string }[];
};

function CatalogImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!src || broken || !/^(https?:\/\/|\/(?!\/))/.test(src))
    return (
      <div
        className={`flex items-center justify-center bg-primary/5 ${className}`}
      >
        <Package className="size-12 text-primary/30" aria-label={alt} />
      </div>
    );
  // Database image hosts are dynamic; native images avoid a fixed remote-host allowlist.
  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setBroken(true)}
    />
  );
  /* eslint-enable @next/next/no-img-element */
}

function Banner({
  banners,
  select,
}: {
  banners: Catalog["banners"];
  select: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = Array.from({ length: 5 }, (_, i) => banners[i]);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % 5), 4500);
    return () => clearInterval(timer);
  }, [paused]);
  return (
    <section
      aria-label="Featured products"
      aria-roledescription="carousel"
      className="relative mt-6 overflow-hidden rounded-2xl bg-primary/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={index !== i}
            className="relative min-w-full overflow-hidden"
          >
            <div className="grid min-h-64 items-center md:grid-cols-2">
              <div className="p-8 sm:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  The Star Sellingz collection · 0{i + 1}
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  {
                    [
                      "Discover your next bestseller.",
                      "Made for everyday possibility.",
                      "Find your perfect color.",
                      "Small details. Beautiful products.",
                      "Your next opportunity starts here.",
                    ][i]
                  }
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Explore products, compare options, and find something that
                  fits.
                </p>
                {slide && (
                  <button
                    tabIndex={index === i ? 0 : -1}
                    onClick={() => select(slide.product)}
                    className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
                  >
                    Explore product
                  </button>
                )}
              </div>
              <CatalogImage
                key={slide?.image}
                src={slide?.image ?? `/catalog-banner-${i + 1}.svg`}
                alt={`Featured collection ${i + 1}`}
                className="h-64 w-full object-contain sm:h-80 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-3 py-2">
        <button
          aria-label="Previous slide"
          onClick={() => setIndex((index + 4) % 5)}
        >
          <ChevronLeft className="size-4" />
        </button>
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Show slide ${i + 1}`}
            aria-current={index === i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full ${index === i ? "w-6 bg-primary" : "w-2 bg-primary/25"}`}
          />
        ))}
        <button
          aria-label="Next slide"
          onClick={() => setIndex((index + 1) % 5)}
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          className="ml-2 text-xs"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}

function ProductDetails({
  product,
  selectedColor,
  requestedSize,
  selectVariant,
  back,
}: {
  product: Product;
  selectedColor: string | null;
  requestedSize: string | null;
  selectVariant: (selection: { color: string; size: string }) => void;
  back: () => void;
}) {
  const colorId =
    product.colors.find((color) => color.color === selectedColor)?._id ??
    product.colors[0]?._id ??
    "";
  const [imageIndex, setImageIndex] = useState(0);
  const color = product.colors.find((color) => color._id === colorId);
  const variants = product.variants.filter(
    (variant) => variant.colorId === colorId,
  );
  const sizes = Array.from(new Set(variants.map((variant) => variant.size)));
  const selectedSize =
    requestedSize && sizes.includes(requestedSize)
      ? requestedSize
      : (sizes[0] ?? "");
  const variant = variants.find((variant) => variant.size === selectedSize);
  const src = color?.images[imageIndex];

  return (
    <section className="my-6" aria-label={`${product.title} details`}>
      <button
        onClick={back}
        className="mb-5 flex items-center gap-1 text-sm text-primary"
      >
        <ChevronLeft className="size-4" /> Back to catalog
      </button>
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div className="min-w-0">
          <CatalogImage
            key={src ?? colorId}
            src={src}
            alt={`${product.title}${color ? `, ${color.color}` : ""}`}
            className="h-[600px] w-full rounded-xl border bg-muted/40 object-contain p-4"
          />
          <div
            aria-label="Choose product image"
            className="mt-3 flex flex-wrap gap-2"
          >
            {color?.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setImageIndex(index)}
                aria-label={`Show ${color.color} image ${index + 1}`}
                aria-pressed={imageIndex === index}
                className={`size-[50px] shrink-0 overflow-hidden rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${imageIndex === index ? "border-primary ring-2 ring-primary" : "border-border"}`}
              >
                <CatalogImage
                  key={image}
                  src={image}
                  alt={`${product.title}, image ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-xl border bg-card p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-primary">
            {product.category?.name ?? "Collection"}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">
            {product.title}
          </h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              {
                region: "India",
                cost: variant?.estimatedCostPrice,
                selling: variant?.estimatedSellingPrice,
              },
              {
                region: "Outside India",
                cost: variant?.estimatedCostPriceOOI,
                selling: variant?.estimatedSalePriceOOI,
              },
            ].map(({ region, cost, selling }) => (
              <div key={region}>
                <h2 className="text-sm font-semibold">{region}</h2>
                <dl className="mt-2 space-y-2 text-sm">
                  {[
                    { label: "Estimated cost price", value: cost },
                    { label: "Estimated selling price", value: selling },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-semibold">
                        {value != null
                          ? `₹${value.toLocaleString("en-IN")}`
                          : "Estimate on request"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">
              Color{color ? `: ${color.color}` : ""}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((option) => (
                <button
                  key={option._id}
                  aria-pressed={colorId === option._id}
                  onClick={() => {
                    const availableSizes = product.variants
                      .filter((variant) => variant.colorId === option._id)
                      .map((variant) => variant.size);
                    selectVariant({
                      color: option.color,
                      size: availableSizes.includes(selectedSize)
                        ? selectedSize
                        : (availableSizes[0] ?? ""),
                    });
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize ${colorId === option._id ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}
                >
                  {option.color}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">
              Size{selectedSize ? `: ${selectedSize}` : ""}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    selectVariant({ color: color?.color ?? "", size: option })
                  }
                  aria-pressed={selectedSize === option}
                  className={`min-w-12 rounded-lg border px-4 py-2 text-sm ${selectedSize === option ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}
                >
                  {option}
                </button>
              ))}
              {!sizes.length && (
                <p className="text-sm text-muted-foreground">
                  No sizes available for this color.
                </p>
              )}
            </div>
          </fieldset>
          <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
            {variant
              ? variant.stock > 0
                ? `${variant.stock} in stock`
                : "Out of stock"
              : "No variant available"}
          </p>
          <div className="mt-6 border-t pt-6 text-sm leading-6">
            <h2 className="font-semibold">Product details</h2>
            <p className="mt-2 whitespace-pre-line">
              {product.longDescription || product.shortDescription}
            </p>
            <ul className="mt-3 list-inside list-disc">
              {product.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            {!!product.materials.length && (
              <p className="mt-3">Materials: {product.materials.join(", ")}</p>
            )}
            {product.packageContents && (
              <p className="mt-2">Package: {product.packageContents}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductsCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const queryString = params.toString();
  const selected = params.get("product");
  // Load every option for the selected product; catalog filters must not hide its variants.
  const catalogQuery = selected
    ? new URLSearchParams({ product: selected }).toString()
    : queryString;
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["catalog", catalogQuery],
    queryFn: ({ signal }) =>
      apiGet<{ data: Catalog }>(`/products?${catalogQuery}`, { signal }),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
  const catalog = data?.data;
  function update(changes: Record<string, string>) {
    const next = new URLSearchParams("category" in changes ? "" : queryString);
    if (!("page" in changes)) next.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(`/products${next.size ? `?${next}` : ""}`, { scroll: false });
  }
  const selectedProduct = catalog?.products.find(
    (product) => product._id === selected,
  );
  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-2 sm:px-8 lg:px-12">
      {/* <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Discover · Compare · Grow
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            Explore our products
          </h1>
        </div>
      </div> */}
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
        <nav
          aria-label="Product categories"
          className="flex min-w-0 flex-1 items-start gap-4 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { _id: "", name: "All products" },
            ...(catalog?.categories ?? []),
          ].map((category) => {
            const isActive = (params.get("category") ?? "") === category._id;

            return (
              <button
                key={category._id}
                title={category.name}
                aria-pressed={isActive}
                onClick={() => update({ category: category._id })}
                className="group flex w-14 shrink-0 flex-col items-center gap-1.5 focus-visible:outline-none cursor-pointer"
              >
                <span
                  className={`flex size-[50px] items-center justify-center rounded-full border transition-all duration-200 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-primary ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "border-border bg-background text-foreground/70 group-hover:border-primary group-hover:text-primary"
                  }`}
                >
                  {category._id ? (
                    <Package className="size-5" />
                  ) : (
                    <Grid2X2 className="size-5" />
                  )}
                </span>
                <span
                  className={`w-full truncate text-center text-[10px] font-medium capitalize leading-3 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </nav>

        <form
          key={params.get("search") ?? ""}
          className="relative w-36 shrink-0 sm:w-64"
          onSubmit={(e) => {
            e.preventDefault();
            update({
              search: String(
                new FormData(e.currentTarget).get("search") ?? "",
              ).trim(),
              product: "",
            });
          }}
        >
          <input
            name="search"
            aria-label="Search products"
            placeholder="Search products…"
            defaultValue={params.get("search") ?? ""}
            maxLength={150}
            className="h-[50px] w-full rounded-full border bg-background pl-5 pr-12 text-sm placeholder:text-muted-foreground focus:outline-2 focus:outline-primary"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex size-[50px] items-center justify-center text-primary"
          >
            <Search className="size-4" />
          </button>
        </form>
      </div>
      {!selected && (
        <Banner
          banners={catalog?.banners ?? []}
          select={(id) => update({ product: id, color: "", size: "" })}
        />
      )}
      {!selected && (
        <div className="my-6 flex flex-wrap items-center gap-3">
          <p
            className="mr-auto text-sm text-muted-foreground"
            aria-live="polite"
          >
            {isPending
              ? "Loading products…"
              : `${catalog?.total ?? 0} products`}
            {isFetching && !isPending ? " · Updating…" : ""}
          </p>
          {[
            {
              key: "color",
              label: "All colors",
              options: catalog?.colors ?? [],
            },
            { key: "size", label: "All sizes", options: catalog?.sizes ?? [] },
            {
              key: "sort",
              label: "Newest first",
              options: ["name", "price-asc", "price-desc"],
            },
          ].map(({ key, label, options }) => (
            <select
              key={key}
              aria-label={key}
              value={params.get(key) ?? (key === "sort" ? "newest" : "")}
              onChange={(e) => update({ [key]: e.target.value })}
              className="h-10 rounded-lg border bg-background px-3 text-sm capitalize"
            >
              <option value={key === "sort" ? "newest" : ""}>{label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {(
                    {
                      name: "Name A–Z",
                      "price-asc": "Estimate: low to high",
                      "price-desc": "Estimate: high to low",
                    } as Record<string, string>
                  )[option] ?? option}
                </option>
              ))}
            </select>
          ))}
          {queryString && (
            <button
              onClick={() => router.push("/products", { scroll: false })}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <X className="size-4" />
              Clear filters
            </button>
          )}
        </div>
      )}
      {isError ? (
        <div role="alert" className="rounded-xl border p-10 text-center">
          <h2 className="font-semibold">Unable to load the catalog</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </div>
      ) : selected && selectedProduct ? (
        <ProductDetails
          key={`${selectedProduct._id}-${params.get("color") ?? ""}`}
          product={selectedProduct}
          selectedColor={params.get("color")}
          requestedSize={params.get("size")}
          selectVariant={update}
          back={() => update({ product: "", color: "", size: "" })}
        />
      ) : isPending || (selected && isFetching) ? (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-xl bg-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : !catalog?.products.length ? (
        <div className="rounded-xl border border-dashed p-14 text-center">
          <Package className="mx-auto mb-3 size-10 text-muted-foreground" />
          <h2 className="font-semibold">No products found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search or clear your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {catalog.products.map((product) => (
            <article
              key={product._id}
              className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20"
            >
              <button
                className="flex h-full w-full cursor-pointer flex-col text-left focus-visible:outline-none"
                onClick={() => update({ product: product._id })}
                aria-label={`View ${product.title}`}
              >
                <CatalogImage
                  key={product.colors[0]?.images[0]}
                  src={product.colors[0]?.images[0]}
                  alt={product.title}
                  className="aspect-square w-full shrink-0 bg-muted/40 object-cover"
                />
                <div className="flex w-full flex-1 flex-col items-start p-4 sm:p-5">
                  <p className="max-w-full rounded-md bg-primary/5 px-2 py-1 text-[10px] font-semibold uppercase leading-4 tracking-wider text-primary">
                    {product.category?.name ?? "Collection"}
                  </p>
                  <h2 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 tracking-tight transition-colors duration-300 group-hover:text-primary">
                    {product.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
                    {product.shortDescription}
                  </p>
                  {/* <p className="mt-3 text-sm font-semibold">
                    {product.price != null
                      ? `Estimated ₹${product.price.toLocaleString("en-IN")}`
                      : "Estimate on request"}
                  </p> */}
                </div>
              </button>
              {/* <div className="flex flex-wrap gap-1 border-t px-4 py-3">
                {product.colors.map((color) => (
                  <button
                    key={color._id}
                    onClick={() =>
                      update({
                        product: product._id,
                        color: color.color,
                        size: "",
                      })
                    }
                    className="rounded border px-2 py-1 text-[10px] capitalize hover:border-primary cursor-pointer"
                  >
                    {color.color}
                  </button>
                ))}
              </div> */}
            </article>
          ))}
        </div>
      )}
      {!selected && catalog && catalog.total > catalog.pageSize && (
        <nav
          aria-label="Product pagination"
          className="mt-8 flex items-center justify-center gap-5"
        >
          <button
            disabled={catalog.page === 1 || isFetching}
            onClick={() => update({ page: String(catalog.page - 1) })}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {catalog.page} of {Math.ceil(catalog.total / catalog.pageSize)}
          </span>
          <button
            disabled={
              catalog.page * catalog.pageSize >= catalog.total || isFetching
            }
            onClick={() => update({ page: String(catalog.page + 1) })}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
