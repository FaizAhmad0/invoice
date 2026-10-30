import { z } from "zod";

export const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid user ID"),
});

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).default(""),
  platform: z.enum(["", "amazon", "website", "etsy"]).default(""),
  batch: z.string().trim().max(80).default(""),
  sortBy: z.enum(["name", "uid", "email", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict();
