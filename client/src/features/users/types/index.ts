export interface DirectoryUser {
  _id: string;
  uid?: number;
  name: string;
  email?: string;
  primaryContact?: string;
  enrollmentIdAmazon?: string;
  enrollmentIdWebsite?: string;
  enrollmentIdEtsy?: string;
  batchAmazon?: string;
  batchWebsite?: string;
  batchEtsy?: string;
  amazonManager?: { _id: string; name: string; email?: string } | null;
  websiteManager?: { _id: string; name: string; email?: string } | null;
  etsyManager?: { _id: string; name: string; email?: string } | null;
  platforms?: { _id: string; name: string }[];
  createdAt?: string;
}

export interface UsersQuery {
  page: number;
  limit: number;
  search: string;
  platform: "" | "amazon" | "website" | "etsy";
  batch: string;
  sortBy: "name" | "uid" | "email" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
}

export interface UsersResult {
  data: DirectoryUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  summary: { total: number; amazon: number; website: number; etsy: number };
}
