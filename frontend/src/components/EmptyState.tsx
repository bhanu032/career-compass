import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action}
    </div>
  );
}
