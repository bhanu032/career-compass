import { Loader2 } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { JobCard } from "@/components/JobCard";
import { JobListSkeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useInfiniteJobs } from "@/hooks/useJobs";

export function JobsPage(): JSX.Element {
  useDocumentTitle(
    "Latest Government Jobs — GovJobs Portal",
    "All the newest government job notifications with infinite scrolling.",
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteJobs({
    sort_by: "created_at",
    sort_dir: "desc",
  });

  const jobs = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Latest government jobs</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {isLoading ? "Loading vacancies…" : `${total.toLocaleString("en-IN")} notifications available`}
      </p>

      <div className="mt-8">
        {isLoading ? (
          <JobListSkeleton count={9} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs published yet"
            description="Once the scrapers run, new notifications will appear here automatically."
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => void fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  Load more jobs
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
