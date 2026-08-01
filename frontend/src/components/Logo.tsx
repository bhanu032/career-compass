import { Landmark } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo(): JSX.Element {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
        <Landmark className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        GovJobs<span className="text-brand-600 dark:text-brand-400">Portal</span>
      </span>
    </Link>
  );
}
