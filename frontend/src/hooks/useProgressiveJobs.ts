import { useEffect, useState } from "react";
import { EXTENDED_PRIVATE_JOBS, INITIAL_PRIVATE_JOBS, type PrivateJob } from "@/data/privateJobs";

export function useProgressivePrivateJobs() {
  // Start with immediate fast rendering of first 4 items (< 20ms)
  const [jobs, setJobs] = useState<PrivateJob[]>(() => INITIAL_PRIVATE_JOBS.slice(0, 4));
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    // Step 1: Render next chunk after 120ms
    const timer1 = setTimeout(() => {
      setJobs(INITIAL_PRIVATE_JOBS);
    }, 120);

    // Step 2: Render full combined stream after 350ms (simulating fast background scraper load)
    const timer2 = setTimeout(() => {
      setJobs([...INITIAL_PRIVATE_JOBS, ...EXTENDED_PRIVATE_JOBS]);
      setIsStreaming(false);
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return {
    jobs,
    isStreaming,
    totalCount: jobs.length,
  };
}
