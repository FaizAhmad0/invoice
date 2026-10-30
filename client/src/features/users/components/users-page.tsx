"use client";

import { useEffect, useState } from "react";
import { Table, type TableColumnsType } from "antd";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Filter, Loader2, Search, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useAuthStore } from "@/stores/auth-store";
import { useDeleteUser, useUsers } from "../hooks/use-users";
import type { DirectoryUser, UsersQuery } from "../types";
import styles from "./users-page.module.css";

const initialQuery: UsersQuery = {
  page: 1, limit: 10, search: "", platform: "", batch: "", sortBy: "createdAt", sortOrder: "desc",
};

const platforms = [
  { label: "Amazon", key: "amazon", enrollment: "enrollmentIdAmazon", batch: "batchAmazon", manager: "amazonManager" },
  { label: "Website", key: "website", enrollment: "enrollmentIdWebsite", batch: "batchWebsite", manager: "websiteManager" },
  { label: "Etsy", key: "etsy", enrollment: "enrollmentIdEtsy", batch: "batchEtsy", manager: "etsyManager" },
] as const;

function getPlatformNames(user: DirectoryUser) {
  const names = [
    ...platforms.filter((platform) => user[platform.enrollment]).map((platform) => platform.label),
    ...(user.platforms ?? []).map((platform) => platform?.name).filter((name): name is string => Boolean(name)),
  ];
  return [...new Map(names.map((name) => [name.toLowerCase(), name])).values()];
}

function initials(name: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
}

function pageItems(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const numbers = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page > 0 && page <= total).sort((a, b) => a - b);
  return numbers.flatMap((page, index): (number | string)[] => {
    const previous = numbers[index - 1];
    if (previous && page - previous === 2) return [previous + 1, page];
    if (previous && page - previous > 2) return [`gap-${page}`, page];
    return [page];
  });
}

function UserDetails({ user, onClose }: { user: DirectoryUser | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Contact details and platform enrollments.</DialogDescription>
        </DialogHeader>
        {user && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className={styles.avatar}>{initials(user.name)}</div>
              <div><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-muted-foreground">{user.uid == null ? "—" : `UID${user.uid}`}</p></div>
            </div>
            <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-xs">
              <div><dt className="mb-1 text-muted-foreground">Email</dt><dd className="break-words">{user.email || "—"}</dd></div>
              <div><dt className="mb-1 text-muted-foreground">Contact</dt><dd>{user.primaryContact || "—"}</dd></div>
            </dl>
            <div className="space-y-3">
              {platforms.filter((platform) => user[platform.enrollment] || user[platform.manager] || user[platform.batch]).map((platform) => (
                <div key={platform.key} className="rounded-lg border p-4">
                  <Badge className={styles.badge}>{platform.label}</Badge>
                  <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div><dt className="mb-1 text-muted-foreground">Enrollment</dt><dd className="break-words">{user[platform.enrollment] || "—"}</dd></div>
                    <div><dt className="mb-1 text-muted-foreground">Manager</dt><dd>{user[platform.manager]?.name || "—"}</dd></div>
                    <div><dt className="mb-1 text-muted-foreground">Batch</dt><dd>{user[platform.batch] || "—"}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}
        <DialogFooter><Button variant="outline" className="h-8 px-4" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [params, setParams] = useState<UsersQuery>(initialQuery);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftPlatform, setDraftPlatform] = useState<UsersQuery["platform"]>("");
  const [draftBatch, setDraftBatch] = useState("");
  const [selectedUser, setSelectedUser] = useState<DirectoryUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DirectoryUser | null>(null);
  const canDelete = useAuthStore((state) => state.user?.role === "admin");
  const deletion = useDeleteUser();
  const { data, error, isPending, isFetching, isPlaceholderData, refetch } = useUsers(params);
  const activeFilters = Number(Boolean(params.platform)) + Number(Boolean(params.batch));
  const hasQuery = Boolean(params.search || activeFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((previous) => previous.search === search.trim()
        ? previous
        : { ...previous, search: search.trim(), page: 1 });
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const resetFilters = () => {
    setDraftPlatform("");
    setDraftBatch("");
    setParams((previous) => ({ ...previous, platform: "", batch: "", page: 1 }));
  };

  const clearAll = () => {
    setSearch("");
    resetFilters();
    setParams((previous) => ({ ...previous, search: "", page: 1 }));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletion.mutateAsync(deleteTarget._id);
      setDeleteTarget(null);
      if (data?.data.length === 1 && params.page > 1) {
        setParams((previous) => ({ ...previous, page: previous.page - 1 }));
      }
      toast.success("User deleted successfully");
    } catch {
      // The confirmation dialog displays the API error and keeps the selection.
    }
  };

  const columns: TableColumnsType<DirectoryUser> = [
    {
      title: "User", key: "user", width: 130,
      render: (_: unknown, user) => (
        <div className="flex min-w-0 items-center gap-3">
          <div aria-hidden="true" className={styles.avatar}>{initials(user.name)}</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground" title={user.name}>{user.name || "Unnamed user"}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground" title={user.email}>{user.email || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "UID", key: "uid", dataIndex: "uid", width: 125,
      render: (uid?: number) => <span className="font-mono text-xs">{uid == null ? "—" : `UID${uid}`}</span>,
    },
    {
      title: "Enrollment", key: "enrollment", width: 130,
      render: (_: unknown, user) => {
        const enrolled = platforms.filter((platform) => user[platform.enrollment]);
        return enrolled.length ? (
          <div className="flex flex-col items-start gap-1">
            {enrolled.map((platform) => (
              <Badge key={platform.key} className={styles.badge} title={`${platform.label}: ${user[platform.enrollment]}`}>
                <span className={styles.badgeLabel}>{platform.label}:</span>
                <span className="truncate">{user[platform.enrollment]}</span>
              </Badge>
            ))}
          </div>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      title: "Contact", key: "contact", dataIndex: "primaryContact", width: 130,
      render: (contact?: string) => <span className="text-xs text-muted-foreground">{contact || "—"}</span>,
    },
    {
      title: "Platforms", key: "platforms", width: 130,
      render: (_: unknown, user) => {
        const names = getPlatformNames(user);
        return names.length ? (
          <div className="flex flex-col items-start gap-1">
            {names.map((name) => <Badge key={name} className={styles.badge}>{name}</Badge>)}
          </div>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      title: "Manager", key: "manager", width: 130,
      render: (_: unknown, user) => {
        const assigned = platforms.filter((platform) => user[platform.manager]?.name);
        return assigned.length ? (
          <div className="flex flex-col items-start gap-1">
            {assigned.map((platform) => (
              <Badge key={platform.key} className={styles.badge} title={`${platform.label}: ${user[platform.manager]?.name}`}>
                <span className={styles.badgeLabel}>{platform.label}:</span>
                <span className="truncate">{user[platform.manager]?.name}</span>
              </Badge>
            ))}
          </div>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      title: "Batch", key: "batch", width: 100,
      render: (_: unknown, user) => {
        const batches = [...new Set(platforms.map((platform) => user[platform.batch]).filter(Boolean))];
        return batches.length ? (
          <div className="space-y-1 text-xs text-muted-foreground">
            {batches.map((batch) => <p key={batch} title={batch} className="truncate">{batch}</p>)}
          </div>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      title: "Actions", key: "actions", width: 125,
      render: (_: unknown, user) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className={styles.action} aria-label={`View ${user.name}`} title="View user" onClick={() => setSelectedUser(user)}><Eye /></Button>
          <Button
            variant="ghost" size="icon" className={styles.action}
            aria-label={`Delete ${user.name}`} title={canDelete ? "Delete user" : "Only admins can delete users"}
            disabled={!canDelete || deletion.isPending}
            onClick={() => { deletion.reset(); setDeleteTarget(user); }}
          ><Trash2 /></Button>
        </div>
      ),
    },
  ];

  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const firstRow = data?.data.length ? ((meta?.page ?? 1) - 1) * (meta?.limit ?? params.limit) + 1 : 0;
  const lastRow = firstRow ? firstRow + (data?.data.length ?? 0) - 1 : 0;
  const paginationDisabled = isFetching || isPlaceholderData || Boolean(error);

  return (
    <div className={styles.page}>
      <header className="mb-6">
        <div className="flex items-center gap-2.5">
          <span className={styles.headingIcon}><Users aria-hidden="true" className="size-4" /></span>
          <h1 className="text-xl leading-8 font-semibold tracking-tight">User Details</h1>
        </div>
        <p className="mt-1 text-xs leading-4 text-muted-foreground">Manage, search and monitor users across managers, batches and platforms.</p>
      </header>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-96">
          <Label htmlFor="users-search" className="sr-only">Search users</Label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input id="users-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." className="h-8 rounded-lg bg-muted/30 pr-8 pl-8 text-xs" />
          {search && <Button variant="ghost" size="icon-xs" aria-label="Clear search" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setSearch("")}><X /></Button>}
        </div>
        <Button variant="outline" className="h-6 gap-1.5 rounded-lg px-2 text-xs font-normal" aria-expanded={filtersOpen} aria-controls="users-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
          <Filter className="size-3.5" /> Filter
          {activeFilters > 0 && <span className="text-[10px] text-primary">({activeFilters})</span>}
        </Button>
      </div>

      {filtersOpen && (
        <Card className="mb-6 p-4 shadow-none">
          <form id="users-filters" className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
            event.preventDefault();
            setParams((previous) => ({ ...previous, platform: draftPlatform, batch: draftBatch.trim(), page: 1 }));
          }}>
            <div className="space-y-2">
              <Label htmlFor="users-platform">Platform</Label>
              <NativeSelect id="users-platform" value={draftPlatform} onChange={(event) => setDraftPlatform(event.target.value as UsersQuery["platform"])}>
                <NativeSelectOption value="">All platforms</NativeSelectOption>
                {platforms.map((platform) => <NativeSelectOption key={platform.key} value={platform.key}>{platform.label}</NativeSelectOption>)}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="users-batch">Batch</Label>
              <Input id="users-batch" className="h-9 bg-background" placeholder="Enter batch" value={draftBatch} maxLength={80} onChange={(event) => setDraftBatch(event.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="h-9 px-3" onClick={resetFilters}>Reset</Button>
              <Button type="submit" className="h-9 px-4">Apply</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className={styles.tableCard}>
        {error ? (
          <div role="alert" className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <AlertCircle className="size-7 text-destructive" />
            <h2 className="text-sm font-semibold">Unable to load users</h2>
            <p className="max-w-md text-xs text-muted-foreground">{error.message}</p>
            <Button variant="outline" className="h-8 px-4" onClick={() => { void refetch(); }} disabled={isFetching}>Try again</Button>
          </div>
        ) : (
          <div aria-label="User details" aria-busy={isFetching} className={styles.table}>
            <Table<DirectoryUser>
              rowKey="_id" columns={columns} dataSource={data?.data ?? []} pagination={false}
              loading={{ spinning: isFetching || isPending, indicator: <Loader2 className="size-5 animate-spin text-primary" /> }}
              size="small" tableLayout="fixed" scroll={{ x: 1000 }}
              locale={{ emptyText: isPending ? <div className="py-12 text-muted-foreground">Loading users…</div> : (
                <div className="flex flex-col items-center gap-2 py-12">
                  <Users className="mb-2 size-7 text-muted-foreground/60" />
                  <p className="font-medium text-foreground">{hasQuery ? "No matching users" : "No users yet"}</p>
                  <p className="text-xs text-muted-foreground">{hasQuery ? "Try a different search or adjust your filters." : "Customer accounts will appear here when they are added."}</p>
                  {hasQuery && <Button variant="outline" className="mt-2 h-8 px-3" onClick={clearAll}>Clear filters</Button>}
                </div>
              ) }}
            />
          </div>
        )}

        <div className={styles.footer}>
          <p aria-live="polite" className="text-[13px] text-foreground/85">
            {isFetching ? "Loading users…" : error ? "Users could not be loaded" : `Showing ${firstRow}–${lastRow} of ${(meta?.total ?? 0).toLocaleString("en-IN")} users`}
          </p>
          <nav aria-label="Users pagination" className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className={styles.pageArrow} aria-label="Previous page" disabled={params.page <= 1 || paginationDisabled} onClick={() => setParams((previous) => ({ ...previous, page: previous.page - 1 }))}><ChevronLeft /></Button>
            {pageItems(params.page, totalPages).map((page) => typeof page === "string" ? <span key={page} className="px-1 text-xs text-muted-foreground">…</span> : (
              <Button key={page} variant="ghost" className={`${styles.pageButton} ${page === params.page ? styles.currentPage : ""}`} aria-label={`Page ${page}`} aria-current={page === params.page ? "page" : undefined} disabled={paginationDisabled} onClick={() => setParams((previous) => ({ ...previous, page }))}>{page}</Button>
            ))}
            <Button variant="ghost" size="icon" className={styles.pageArrow} aria-label="Next page" disabled={params.page >= totalPages || paginationDisabled} onClick={() => setParams((previous) => ({ ...previous, page: previous.page + 1 }))}><ChevronRight /></Button>
          </nav>
        </div>
      </Card>

      <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open && !deletion.isPending) setDeleteTarget(null); }}>
        <DialogContent showCloseButton={!deletion.isPending}>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>This will permanently delete {deleteTarget?.name}&apos;s account. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deletion.error && <p role="alert" className="text-sm text-destructive">{deletion.error.message}</p>}
          <DialogFooter>
            <Button variant="outline" className="h-8 px-3" disabled={deletion.isPending} onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="h-8 px-3" disabled={deletion.isPending} onClick={() => { void confirmDelete(); }}>{deletion.isPending && <Loader2 className="animate-spin" />}Delete user</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
