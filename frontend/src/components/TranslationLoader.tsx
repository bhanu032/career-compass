import { useIsFetching } from "@tanstack/react-query";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Shows a top-of-page banner while job data is being translated.
 * Only visible when a non-English language is active AND queries are in-flight.
 */
export function TranslationLoader(): JSX.Element | null {
  const { i18n } = useTranslation();
  const isFetching = useIsFetching();

  if (i18n.language === "en" || !isFetching) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-lg animate-bounce-subtle">
        <Languages className="h-3.5 w-3.5 animate-spin" />
        Translating…
      </div>
    </div>
  );
}
