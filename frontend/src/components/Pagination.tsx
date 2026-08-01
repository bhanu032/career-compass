import { ChevronLeft, ChevronRight } from "lucide-react";

import { classNames } from "@/utils/format";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pages, onChange }: PaginationProps): JSX.Element | null {
  if (pages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, Math.min(page - Math.floor(windowSize / 2), pages - windowSize + 1));
  const numbers = Array.from({ length: Math.min(windowSize, pages) }, (_, i) => start + i);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        className="btn-secondary h-10 w-10 p-0"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={number === page ? "page" : undefined}
          className={classNames(
            "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition",
            number === page
              ? "bg-brand-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
          )}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        className="btn-secondary h-10 w-10 p-0"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
