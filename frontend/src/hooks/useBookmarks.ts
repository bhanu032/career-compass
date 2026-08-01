import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { bookmarkService } from "@/services/bookmarkService";
import { useAuth } from "@/hooks/useAuth";

export function useBookmarkIds(): number[] {
  const { isAuthenticated } = useAuth();
  const { data } = useQuery({
    queryKey: ["bookmark-ids"],
    queryFn: () => bookmarkService.ids(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
  return data ?? [];
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const ids = useBookmarkIds();

  const mutation = useMutation({
    mutationFn: async (jobId: number) => {
      if (ids.includes(jobId)) {
        await bookmarkService.remove(jobId);
        return { jobId, bookmarked: false };
      }
      await bookmarkService.add(jobId);
      return { jobId, bookmarked: true };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookmark-ids"] });
      void queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const toggle = useCallback((jobId: number) => mutation.mutate(jobId), [mutation]);
  return { toggle, isPending: mutation.isPending, ids };
}

export function useBookmarkedJobs(page: number) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => bookmarkService.list(page),
    enabled: isAuthenticated,
  });
}
