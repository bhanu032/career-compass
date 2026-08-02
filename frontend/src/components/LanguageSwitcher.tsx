import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

const LANGUAGES = [
  { code: "en", native: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "hi", native: "हिन्दी",      flag: "🇮🇳", dir: "ltr" },
  { code: "bn", native: "বাংলা",       flag: "🇮🇳", dir: "ltr" },
  { code: "ta", native: "தமிழ்",       flag: "🇮🇳", dir: "ltr" },
  { code: "te", native: "తెలుగు",      flag: "🇮🇳", dir: "ltr" },
  { code: "mr", native: "मराठी",       flag: "🇮🇳", dir: "ltr" },
  { code: "gu", native: "ગુજરાતી",     flag: "🇮🇳", dir: "ltr" },
  { code: "pa", native: "ਪੰਜਾਬੀ",      flag: "🇮🇳", dir: "ltr" },
  { code: "kn", native: "ಕನ್ನಡ",       flag: "🇮🇳", dir: "ltr" },
  { code: "ml", native: "മലയാളം",      flag: "🇮🇳", dir: "ltr" },
  { code: "or", native: "ଓଡ଼ିଆ",       flag: "🇮🇳", dir: "ltr" },
  { code: "ur", native: "اردو",        flag: "🇵🇰", dir: "rtl" },
] as const;

const JOB_KEYS = ["home","jobs","job","jobs-infinite","admit-cards","results"];

export function LanguageSwitcher(): JSX.Element {
  const { i18n, t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  function switchLang(code: string, dir: string) {
    i18n.changeLanguage(code);
    localStorage.setItem("deshkiseva.lang", code);
    document.documentElement.lang = code;
    document.documentElement.dir  = dir;
    // Reset all job queries so fresh translated data is fetched immediately
    JOB_KEYS.forEach((key) => void qc.resetQueries({ queryKey: [key] }));
    setOpen(false);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline max-w-[60px] truncate">{current.native}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("lang.select")}
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                role="option"
                aria-selected={l.code === i18n.language}
                type="button"
                onClick={() => switchLang(l.code, l.dir)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  l.code === i18n.language
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-lg leading-none w-6 text-center">{l.flag}</span>
                <span className="flex-1 text-left">
                  <span className="block font-medium leading-tight">{l.native}</span>
                </span>
                {l.code === i18n.language && (
                  <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
