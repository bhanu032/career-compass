import { useEffect, useState } from "react";
import { EXTENDED_PRIVATE_JOBS, INITIAL_PRIVATE_JOBS, type PrivateJob } from "@/data/privateJobs";

export function useProgressivePrivateJobs() {
  // Start with immediate fast rendering of initial items
  const [jobs, setJobs] = useState<PrivateJob[]>(() => INITIAL_PRIVATE_JOBS);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    // Step 1: Render initial pool
    const timer1 = setTimeout(() => {
      setJobs(INITIAL_PRIVATE_JOBS);
    }, 50);

    // Step 2: Stream extended pool progressively
    const timer2 = setTimeout(() => {
      setJobs([...INITIAL_PRIVATE_JOBS, ...EXTENDED_PRIVATE_JOBS]);
      setIsStreaming(false);
    }, 250);

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
