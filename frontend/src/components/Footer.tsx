import { Link } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/utils/constants";

export function Footer(): JSX.Element {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Government job notifications from SSC, UPSC, Railways, banking and PSUs — collected and
            refreshed automatically every six hours.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Browse</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/jobs" className="hover:text-brand-600">Latest jobs</Link></li>
            <li><Link to="/search" className="hover:text-brand-600">Advanced search</Link></li>
            <li><Link to="/bookmarks" className="hover:text-brand-600">Saved jobs</Link></li>
            <li><Link to="/profile" className="hover:text-brand-600">My profile</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            {CATEGORIES.slice(0, 6).map((category) => (
              <li key={category}>
                <Link to={`/search?category=${encodeURIComponent(category)}`} className="hover:text-brand-600">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Disclaimer</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            This portal aggregates publicly available recruitment notices. Always verify details on the
            official website before applying.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} GovJobs Portal. All rights reserved.
      </div>
    </footer>
  );
}
