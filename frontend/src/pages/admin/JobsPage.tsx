import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/Skeleton";
import { useAdminJobs, useDeleteJob } from "@/hooks/useAdmin";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatDate } from "@/utils/format";

export function AdminJobsPage(): JSX.Element {
  useDocumentTitle("Manage jobs — GovJobs Portal");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, isLoading } = useAdminJobs({ page, q: q || undefined });
  const deleteJob = useDeleteJob();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jobs</h1>
        <input
          className="input max-w-xs"
          placeholder="Search jobs…"
          value={q}
          onChange={(event) => { setQ(event.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <div className="card overflow-x-auto p-6">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Organization</th>
                <th className="py-2 pr-4">Last date</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.items.map((job) => (
                <tr key={job.id}>
                  <td className="max-w-sm py-2.5 pr-4">
                    <Link to={`/jobs/${job.id}`} className="line-clamp-1 font-medium text-brand-700 hover:underline dark:text-brand-300">
                      {job.title}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{job.organization}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{formatDate(job.last_date)}</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      aria-label={`Delete ${job.title}`}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={() => { if (window.confirm("Delete this job?")) deleteJob.mutate(job.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
