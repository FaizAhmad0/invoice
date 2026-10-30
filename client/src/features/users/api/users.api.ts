import { apiDelete, apiGet } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UsersQuery, UsersResult } from "../types";

export async function getUsers(params: UsersQuery, signal?: AbortSignal): Promise<UsersResult> {
  const response = await apiGet<ApiResponse<UsersResult>>("/users", { params, signal });
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiDelete<ApiResponse<{ id: string }>>(`/users/${encodeURIComponent(id)}`);
}
