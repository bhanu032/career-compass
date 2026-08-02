import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/EmptyState";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { JobListSkeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useInfiniteJobs } from "@/hooks/useJobs";

export function JobsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Latest Government Jobs — DeshKiSeva");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteJobs({
    sort_by: "created_at", sort_dir: "desc",
  });

  const jobs = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <>
      <HeroBanner variant="jobs" py="py-14">
        <h1 className="text-3xl font-bold sm:text-4xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            {t("jobs.title")}
          </span>
        </h1>
        <p className="mt-2 text-white/70 text-sm sm:text-base">
          {isLoading ? t("jobs.loading") : t("jobs.available", { count: total.toLocaleString("en-IN") })}
        </p>
      </HeroBanner>

      <div className="container-page py-10">
        {isLoading ? <JobListSkeleton count={9} /> : jobs.length === 0 ? (
          <EmptyState title={t("jobs.noJobs")} description={t("jobs.noJobsDesc")} />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <button type="button" className="btn-primary" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("jobs.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
