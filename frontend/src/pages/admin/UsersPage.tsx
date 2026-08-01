import { useState } from "react";

import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/Skeleton";
import { useAdminUsers, useToggleUserActive } from "@/hooks/useAdmin";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatDate } from "@/utils/format";

export function AdminUsersPage(): JSX.Element {
  useDocumentTitle("Manage users — GovJobs Portal");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  const toggleActive = useToggleUserActive();

  if (isLoading) return <Skeleton className="h-80 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>

      <div className="card overflow-x-auto p-6">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Joined</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.items.map((user) => (
              <tr key={user.id}>
                <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{user.full_name}</td>
                <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="py-2.5 pr-4 capitalize text-slate-600 dark:text-slate-300">{user.role}</td>
                <td className="py-2.5 pr-4 text-slate-500">{formatDate(user.created_at)}</td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    className="btn-secondary px-3 py-1.5 text-xs"
                    onClick={() => toggleActive.mutate({ id: user.id, is_active: !user.is_active })}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={setPage} />
      </div>
    </div>
  );
}
