import { useCallback, useEffect, useState } from "react";

import { getRecentlyViewed, pushRecentlyViewed } from "@/utils/storage";

export function useRecentlyViewed(): { ids: number[]; track: (jobId: number) => void } {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewed());
  }, []);

  const track = useCallback((jobId: number) => {
    setIds(pushRecentlyViewed(jobId));
  }, []);

  return { ids, track };
}
