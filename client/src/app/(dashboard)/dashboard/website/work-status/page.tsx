"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle, ClipboardCheck, Clock, CreditCard, ExternalLink, FileText,
  Globe, Handshake, Palette, Phone, Rocket, Server, Share2, UserRound,
  type LucideIcon,
} from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { Loading } from "@/components/shared/loading";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import type { AuthUser } from "@/features/auth/types";
import { cn } from "@/lib/utils";

type StatusValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { _id?: string; id?: string; name?: string };

type WebsiteWorkStatusUser = AuthUser & {
  primaryContact?: string | null;
  enrollmentIdWebsite?: StatusValue;
  batchWebsite?: StatusValue;
  dateWebsite?: StatusValue;
  websiteManager?: StatusValue;
  amazonEnrolled?: StatusValue;
  callStatus?: StatusValue;
  websiteFurtherProcess?: StatusValue;
  personalInformationsForm?: StatusValue;
  clientInformationForm?: StatusValue;
  haveGst?: StatusValue;
  gst?: StatusValue;
  gstNumber?: StatusValue;
  furtherProcedureRecoding?: StatusValue;
  domainName?: StatusValue;
  domainStatus?: StatusValue;
  idCard?: StatusValue;
  leegality?: StatusValue;
  performaInvoice?: StatusValue;
  ovc?: StatusValue;
  theme3?: StatusValue;
  socialMedia1?: StatusValue;
  banner50?: StatusValue;
  supportPortal?: StatusValue;
  gallery?: StatusValue;
  logo?: StatusValue;
  banner100?: StatusValue;
  serverEmail?: StatusValue;
  socialMediaPart2?: StatusValue;
  categorySelection?: StatusValue;
  domainReconfirmations?: StatusValue;
  serverMailConfirmations?: StatusValue;
  serverPurchase?: StatusValue;
  websiteLive?: StatusValue;
  paymentsStatus?: StatusValue;
  handover?: StatusValue;
  indianPgStatus?: StatusValue;
  paypal?: StatusValue;
  backendTransferred?: StatusValue;
  gstInvoice?: StatusValue;
  leegalityPdf?: StatusValue;
  websiteRemark?: StatusValue;
  aadharCard?: StatusValue;
};

type StageField = {
  label: string;
  key: keyof WebsiteWorkStatusUser;
};

type FieldGroup = {
  title: string;
  fields: StageField[];
};

type StageConfig = {
  step: string;
  title: string;
  shortLabel: string;
  description: string;
  groups: FieldGroup[];
};

const STATUS_STYLES: Record<string, string> = {
  yes: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  no: "bg-muted text-muted-foreground ring-border",
  pending: "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400",
  "not sent": "bg-muted text-muted-foreground ring-border",
  "not done": "bg-muted text-muted-foreground ring-border",
  "not yet": "bg-muted text-muted-foreground ring-border",
  done: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  "purchase done": "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  completed: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  active: "bg-primary/10 text-primary ring-primary/20",
  inactive: "bg-muted text-muted-foreground ring-border",
  live: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  handover: "bg-primary/10 text-primary ring-primary/20",
  "in progress": "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400",
  submitted: "bg-primary/10 text-primary ring-primary/20",
  approved: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-400",
  sent: "bg-primary/10 text-primary ring-primary/20",
  received: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  paid: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  unpaid: "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-400",
};

const STAGE_CONFIGS: StageConfig[] = [
  {
    step: "STEP 01",
    title: "Initial Setup & Information",
    shortLabel: "Initial Setup",
    description: "Enrollment, contact, onboarding and domain setup",
    groups: [
      {
        title: "Enrollment",
        fields: [
          { label: "Website Enrollment Date", key: "dateWebsite" },
          { label: "Website Enrollment ID", key: "enrollmentIdWebsite" },
          { label: "Website Batch", key: "batchWebsite" },
          { label: "Amazon Enrolled", key: "amazonEnrolled" },
        ],
      },
      {
        title: "Contact",
        fields: [
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Primary Contact", key: "primaryContact" },
        ],
      },
      {
        title: "Onboarding",
        fields: [
          { label: "Call Status", key: "callStatus" },
          { label: "Website Further Process", key: "websiteFurtherProcess" },
          { label: "Personal Information Form", key: "personalInformationsForm" },
          { label: "Client Information Form", key: "clientInformationForm" },
          { label: "GST Number", key: "gstNumber" },
          { label: "Further Procedure Recording", key: "furtherProcedureRecoding" },
        ],
      },
      {
        title: "Domain Setup",
        fields: [
          { label: "Domain Name", key: "domainName" },
          { label: "Domain Status", key: "domainStatus" },
        ],
      },
    ],
  },
  {
    step: "STEP 02",
    title: "Documents, Design & Development",
    shortLabel: "Development",
    description: "Documentation, creative assets and server setup",
    groups: [
      {
        title: "Documents",
        fields: [
          { label: "ID Card", key: "idCard" },
          { label: "Leegality", key: "leegality" },
          { label: "Performa Invoice", key: "performaInvoice" },
          { label: "OVC", key: "ovc" },
        ],
      },
      {
        title: "Design Assets",
        fields: [
          { label: "Theme - 3", key: "theme3" },
          { label: "Banner - 50", key: "banner50" },
          { label: "Banner - 100", key: "banner100" },
          { label: "Logo", key: "logo" },
          { label: "Gallery", key: "gallery" },
          { label: "Support Portal", key: "supportPortal" },
        ],
      },
      {
        title: "Content & Social",
        fields: [
          { label: "Social Media - 1", key: "socialMedia1" },
          { label: "Social Media Part - 2", key: "socialMediaPart2" },
          { label: "Category Selection", key: "categorySelection" },
        ],
      },
      {
        title: "Server & Domain",
        fields: [
          { label: "Server Email", key: "serverEmail" },
          { label: "Domain Re-confirmations", key: "domainReconfirmations" },
          { label: "Server Mail Confirmations", key: "serverMailConfirmations" },
          { label: "Server Purchase", key: "serverPurchase" },
        ],
      },
    ],
  },
  {
    step: "STEP 03",
    title: "Finalization & Handover",
    shortLabel: "Finalization",
    description: "Go-live, payments and closing documents",
    groups: [
      {
        title: "Launch",
        fields: [{ label: "Website Live", key: "websiteLive" }],
      },
      {
        title: "Payment & Gateway",
        fields: [
          { label: "Payments Status", key: "paymentsStatus" },
          { label: "Indian PG Status", key: "indianPgStatus" },
          { label: "PayPal", key: "paypal" },
          { label: "Backend Transferred", key: "backendTransferred" },
        ],
      },
      {
        title: "Handover",
        fields: [
          { label: "Handover", key: "handover" },
          { label: "Website Remark", key: "websiteRemark" },
        ],
      },
      {
        title: "Final Documents",
        fields: [
          { label: "GST Invoice", key: "gstInvoice" },
          { label: "Leegality PDF", key: "leegalityPdf" },
          { label: "Aadhaar Card", key: "aadharCard" },
        ],
      },
    ],
  },
];

const URL_KEYS: Array<keyof WebsiteWorkStatusUser> = [
  "domainName",
  "gstInvoice",
  "leegalityPdf",
  "aadharCard",
  "idCard",
  "performaInvoice",
  "serverEmail",
  "websiteRemark",
];

function normalizeValue(value: unknown): string | number | boolean | null | undefined {
  if (value !== null && typeof value === "object") {
    if (Array.isArray(value)) return null;
    const obj = value as { name?: unknown; id?: unknown; _id?: unknown };
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name;
    const fallback = obj.id ?? obj._id;
    if (typeof fallback === "string") return fallback;
    return null;
  }
  return value as string | number | boolean | null | undefined;
}

function resolveDisplayValue(
  user: WebsiteWorkStatusUser,
  key: keyof WebsiteWorkStatusUser,
): string | number | boolean | null | undefined {
  if (key === "gstNumber") {
    const direct = normalizeValue(user.gstNumber);
    if (direct !== null && direct !== undefined && direct !== "") return direct;
    return normalizeValue(user.gst);
  }
  return normalizeValue((user as unknown as Record<string, unknown>)[key as string]);
}

function isEmptyValue(value: string | number | boolean | null | undefined) {
  return value === null || value === undefined || value === "";
}

function formatDateValue(value: string | number | boolean | null | undefined) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLabel(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function getStatusStyle(value: string) {
  return STATUS_STYLES[value.toLowerCase()] ?? "bg-muted text-muted-foreground ring-border";
}

function toLinkHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes(" ")) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return null;
    }
  }
  if (/^www\./i.test(trimmed)) {
    try {
      new URL(`https://${trimmed}`);
      return `https://${trimmed}`;
    } catch {
      return null;
    }
  }
  if (/^[^\s@]+\.[a-z]{2,}(\/\S*)?$/i.test(trimmed) && !trimmed.includes("@")) {
    try {
      new URL(`https://${trimmed}`);
      return `https://${trimmed}`;
    } catch {
      return null;
    }
  }
  return null;
}

function renderValue(value: string | number | boolean | null | undefined, fieldKey: keyof WebsiteWorkStatusUser) {
  if (isEmptyValue(value)) {
    return <span className="text-[13px] text-muted-foreground">—</span>;
  }

  if (typeof value === "boolean") {
    const label = value ? "Yes" : "No";
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
          getStatusStyle(label),
        )}
      >
        {label}
      </span>
    );
  }

  if (typeof value === "number") {
    return <span className="text-[13px] font-medium text-foreground">{value}</span>;
  }

  const normalized = value.trim();
  if (!normalized) {
    return <span className="text-[13px] text-muted-foreground">—</span>;
  }

  if (fieldKey === "dateWebsite") {
    const formatted = formatDateValue(normalized);
    if (formatted) {
      return <span className="text-[13px] font-medium text-foreground">{formatted}</span>;
    }
  }

  if (fieldKey === "email") {
    return (
      <a
        href={`mailto:${normalized}`}
        className="break-all text-[13px] font-medium text-primary hover:underline underline-offset-4"
      >
        {normalized}
      </a>
    );
  }

  const href = URL_KEYS.includes(fieldKey) || /^https?:\/\//i.test(normalized) ? toLinkHref(normalized) : null;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex max-w-full items-center gap-1 break-all text-[13px] font-medium text-primary hover:underline underline-offset-4"
      >
        <span className="break-all">{normalized}</span>
        <ExternalLink className="size-3 shrink-0" />
      </a>
    );
  }

  const statusStyle = getStatusStyle(normalized);
  const isStatusLike = Object.prototype.hasOwnProperty.call(STATUS_STYLES, normalized.toLowerCase());

  if (isStatusLike) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
          statusStyle,
        )}
      >
        {formatLabel(normalized)}
      </span>
    );
  }

  return <span className="text-[13px] font-medium text-foreground">{formatLabel(normalized)}</span>;
}

function MetaItem({ label, value, fieldKey }: { label: string; value: string | number | boolean | null | undefined; fieldKey: keyof WebsiteWorkStatusUser }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2">
      <span className="shrink-0 text-xs text-muted-foreground">{label}:</span>
      <span className="min-w-0">{renderValue(value, fieldKey)}</span>
    </div>
  );
}

const WORK_STEPS = STAGE_CONFIGS.flatMap((stage) =>
  stage.groups.flatMap((group) =>
    group.fields.map((field) => ({ ...field, group: group.title, stage: stage.shortLabel })),
  ),
);

const COMPLETED_STATUSES = new Set([
  "yes", "true", "1", "done", "complete", "completed", "purchase done",
  "active", "live", "handover", "submitted", "approved", "sent", "received",
  "paid", "connected", "confirmed", "transferred", "purchased",
]);

const UNFINISHED_STATUSES = new Set([
  "no", "false", "0", "pending", "not sent", "not done", "not yet",
  "in progress", "inactive", "rejected", "unpaid", "not started",
  "n/a", "na", "none", "null", "undefined", "-", "—",
]);

// These steps collect information; workflow status fields require a positive status.
const INFORMATION_KEYS = new Set<keyof WebsiteWorkStatusUser>([
  "dateWebsite", "enrollmentIdWebsite", "batchWebsite", "name", "email",
  "primaryContact", "gstNumber", "domainName", "serverEmail", "websiteRemark",
  "gstInvoice", "leegalityPdf", "aadharCard",
]);

function isStepComplete(
  value: ReturnType<typeof resolveDisplayValue>,
  fieldKey: keyof WebsiteWorkStatusUser,
) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value !== "string") return false;

  const status = formatLabel(value).toLowerCase();
  if (!status || UNFINISHED_STATUSES.has(status)) return false;
  if (COMPLETED_STATUSES.has(status)) return true;
  return INFORMATION_KEYS.has(fieldKey) || toLinkHref(value) !== null;
}

const GROUP_ICONS: Record<string, LucideIcon> = {
  Enrollment: ClipboardCheck,
  Contact: UserRound,
  Onboarding: Phone,
  "Domain Setup": Globe,
  Documents: FileText,
  "Design Assets": Palette,
  "Content & Social": Share2,
  "Server & Domain": Server,
  Launch: Rocket,
  "Payment & Gateway": CreditCard,
  Handover: Handshake,
  "Final Documents": FileText,
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function StatusBadge({ complete }: { complete: boolean }) {
  const Icon = complete ? CheckCircle : Clock;

  return (
    <span className={cn(
      "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium",
      complete
        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400",
    )}>
      <Icon className="size-3" aria-hidden="true" />
      {complete ? "Completed" : "Pending"}
    </span>
  );
}

function WorkStatusCard({
  field,
  value,
  complete,
  step,
  reduceMotion,
}: {
  field: (typeof WORK_STEPS)[number];
  value: ReturnType<typeof resolveDisplayValue>;
  complete: boolean;
  step: number;
  reduceMotion: boolean;
}) {
  const Icon = GROUP_ICONS[field.group] ?? ClipboardCheck;
  const normalized = typeof value === "string" ? formatLabel(value).toLowerCase() : "";
  const hasDetail = !isEmptyValue(value) && typeof value !== "boolean"
    && !COMPLETED_STATUSES.has(normalized) && !UNFINISHED_STATUSES.has(normalized);

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-md",
        complete && "hover:border-green-300 dark:hover:border-green-700",
      )}
    >
      <div className={cn(
        "flex size-9 items-center justify-center rounded-lg",
        complete
          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          : "bg-gray-100 text-gray-400 dark:bg-white/5",
      )}>
        <Icon className="size-4.5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold leading-5 text-foreground">
          <span className="sr-only">Step {step}: </span>
          {field.label}
        </h2>
        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{field.group} · {field.stage}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <StatusBadge complete={complete} />
          {hasDetail && (
            <div className="min-w-0 max-w-full [overflow-wrap:anywhere]">
              {renderValue(value, field.key)}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Stepper({ user, isFetching }: { user: WebsiteWorkStatusUser; isFetching: boolean }) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <div className="mx-auto max-w-5xl py-3" aria-busy={isFetching}>
      <ol className="relative" aria-label="Website work progress">
        {WORK_STEPS.map((field, index) => {
          const value = resolveDisplayValue(user, field.key);
          const complete = isStepComplete(value, field.key);
          const isLeft = index % 2 === 0;

          return (
            <li
              key={field.key}
              className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-3 pb-6 last:pb-0 sm:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] sm:gap-x-6"
              data-complete={complete}
            >
              {index < WORK_STEPS.length - 1 && (
                <div
                  className={cn(
                    "pointer-events-none absolute left-[18px] top-8 h-full w-0.5 -translate-x-1/2 sm:left-1/2",
                    complete ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700",
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 col-start-1 row-start-1 mt-3.5 size-9 sm:col-start-2" aria-hidden="true">
                <div className={cn(
                  "absolute left-full top-1/2 h-px w-3 -translate-y-1/2 sm:w-6",
                  isLeft && "sm:left-auto sm:right-full",
                  complete ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700",
                )} />
                <motion.div
                  variants={nodeVariants}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.6 }}
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full border-2 bg-background text-sm font-bold shadow-sm",
                    complete
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-gray-200 text-gray-400 dark:border-gray-700",
                  )}
                >
                  {index + 1}
                </motion.div>
              </div>

              <motion.div
                variants={cardVariants}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                className={cn(
                  "relative col-start-2 row-start-1 w-full min-w-0 sm:max-w-sm",
                  isLeft ? "sm:col-start-1 sm:justify-self-end" : "sm:col-start-3 sm:justify-self-start",
                )}
              >
                <WorkStatusCard
                  field={field}
                  value={value}
                  complete={complete}
                  step={index + 1}
                  reduceMotion={reduceMotion}
                />
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function WebsiteWorkStatusPage() {
  const { data, error, isLoading, refetch, isFetching } = useCurrentUser();

  const user = data as WebsiteWorkStatusUser | undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <Loading text="Loading work status..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <ErrorState
          title="Unable to load work status"
          message="We couldn't fetch the authenticated user's website work-status details."
          onRetry={() => refetch()}
          className="w-full max-w-xl"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="border-b border-border/60 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Website Work Status
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{user.name}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Track your website onboarding and project progress.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
          <MetaItem label="Enrollment" fieldKey="enrollmentIdWebsite" value={resolveDisplayValue(user, "enrollmentIdWebsite")} />
          <MetaItem label="Batch" fieldKey="batchWebsite" value={resolveDisplayValue(user, "batchWebsite")} />
          <MetaItem label="Manager" fieldKey="websiteManager" value={resolveDisplayValue(user, "websiteManager")} />
          <MetaItem label="Amazon Enrolled" fieldKey="amazonEnrolled" value={resolveDisplayValue(user, "amazonEnrolled")} />
        </div>
      </div>

      <Stepper user={user} isFetching={isFetching} />
    </div>
  );
}
