import { Link } from "react-router-dom";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFoundPage(): JSX.Element {
  useDocumentTitle("Page not found — GovJobs Portal");
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for has been moved or never existed.
      </p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
