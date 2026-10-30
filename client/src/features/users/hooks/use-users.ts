import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import { deleteUser, getUsers } from "../api/users.api";
import type { UsersQuery, UsersResult } from "../types";

export function useUsers(params: UsersQuery) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery<UsersResult, ApiError>({
    queryKey: ["users", userId, params],
    queryFn: ({ signal }) => getUsers(params, signal),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: (count, error) => error.status !== 401 && error.status !== 403 && count < 1,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
