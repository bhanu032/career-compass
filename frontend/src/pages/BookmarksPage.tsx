import { useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/EmptyState";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { JobListSkeleton } from "@/components/Skeleton";
import { useBookmarkedJobs } from "@/hooks/useBookmarks";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function BookmarksPage(): JSX.Element {
  useDocumentTitle("Saved jobs — GovJobs Portal", "Your bookmarked government job notifications.");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookmarkedJobs(page);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved jobs</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {(data?.total ?? 0).toLocaleString("en-IN")} bookmarked notifications
      </p>

      <div className="mt-8">
        {isLoading ? (
          <JobListSkeleton count={3} />
        ) : (data?.items.length ?? 0) === 0 ? (
          <EmptyState
            title="No saved jobs yet"
            description="Bookmark a vacancy and it will show up here for quick access."
            action={<Link to="/jobs" className="btn-primary mt-2">Browse jobs</Link>}
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data?.items.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
            <Pagination page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
