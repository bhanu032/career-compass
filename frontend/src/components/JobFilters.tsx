import { FilterX } from "lucide-react";

import type { JobSearchParams } from "@/types";
import { CATEGORIES, INDIAN_STATES, QUALIFICATIONS, SORT_OPTIONS } from "@/utils/constants";

interface JobFiltersProps {
  filters: JobSearchParams;
  onChange: (next: Partial<JobSearchParams>) => void;
  onReset: () => void;
}

export function JobFilters({ filters, onChange, onReset }: JobFiltersProps): JSX.Element {
  const sortValue = `${filters.sort_by ?? "created_at"}:${filters.sort_dir ?? "desc"}`;

  return (
    <aside className="card sticky top-20 h-fit p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Filters
        </h2>
        <button type="button" onClick={onReset} className="btn-ghost px-2 py-1 text-xs">
          <FilterX className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="label" htmlFor="filter-keyword">Keyword</label>
          <input
            id="filter-keyword"
            className="input"
            value={filters.q ?? ""}
            placeholder="e.g. clerk, engineer"
            onChange={(event) => onChange({ q: event.target.value || undefined })}
          />
        </div>

        <div>
          <label className="label" htmlFor="filter-state">State</label>
          <select
            id="filter-state"
            className="input"
            value={filters.state ?? ""}
            onChange={(event) => onChange({ state: event.target.value || undefined })}
          >
            <option value="">All states</option>
            {INDIAN_STATES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="filter-qualification">Qualification</label>
          <select
            id="filter-qualification"
            className="input"
            value={filters.qualification ?? ""}
            onChange={(event) => onChange({ qualification: event.target.value || undefined })}
          >
            <option value="">Any</option>
            {QUALIFICATIONS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="input"
            value={filters.category ?? ""}
            onChange={(event) => onChange({ category: event.target.value || undefined })}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="filter-organization">Organization</label>
          <input
            id="filter-organization"
            className="input"
            value={filters.organization ?? ""}
            placeholder="e.g. Railway"
            onChange={(event) => onChange({ organization: event.target.value || undefined })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="filter-salary-min">Min salary</label>
            <input
              id="filter-salary-min"
              type="number"
              min={0}
              className="input"
              value={filters.salary_min ?? ""}
              onChange={(event) =>
                onChange({ salary_min: event.target.value ? Number(event.target.value) : undefined })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="filter-salary-max">Max salary</label>
            <input
              id="filter-salary-max"
              type="number"
              min={0}
              className="input"
              value={filters.salary_max ?? ""}
              onChange={(event) =>
                onChange({ salary_max: event.target.value ? Number(event.target.value) : undefined })
              }
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="filter-last-date">Last date before</label>
          <input
            id="filter-last-date"
            type="date"
            className="input"
            value={filters.last_date_before ?? ""}
            onChange={(event) => onChange({ last_date_before: event.target.value || undefined })}
          />
        </div>

        <div>
          <label className="label" htmlFor="filter-sort">Sort by</label>
          <select
            id="filter-sort"
            className="input"
            value={sortValue}
            onChange={(event) => {
              const [sortBy, sortDir] = event.target.value.split(":");
              onChange({ sort_by: sortBy, sort_dir: sortDir as "asc" | "desc" });
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={filters.active_only ?? false}
            onChange={(event) => onChange({ active_only: event.target.checked || undefined })}
          />
          Only show open vacancies
        </label>
      </div>
    </aside>
  );
}
