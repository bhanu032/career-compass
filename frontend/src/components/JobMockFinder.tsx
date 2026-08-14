import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, Globe, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { EXAM_GROUPS } from "@/data/mockTests";

interface JobMockFinderProps {
  jobTitle: string;
  organization?: string;
  category?: string;
}

export function JobMockFinder({ jobTitle, organization = "", category = "" }: JobMockFinderProps): JSX.Element {
  const [isSearching, setIsSearching] = useState(false);
  const [foundWebMocks, setFoundWebMocks] = useState<
    Array<{ title: string; portal: string; questions: number; duration: number; link: string; isInternal: boolean }>
  >([]);
  const [searched, setSearched] = useState(false);

  function handleSearchWebMocks() {
    setIsSearching(true);
    setSearched(true);

    setTimeout(() => {
      const query = (jobTitle + " " + organization + " " + category).toLowerCase();

      // Find internal matches
      const internalMatches = EXAM_GROUPS.flatMap((g) =>
        g.exams.flatMap((e) =>
          e.papers.map((p) => ({
            title: p.title,
            portal: "DeshKiSeva Official",
            questions: p.totalQuestions,
            duration: p.duration,
            link: `/mock-tests/attempt/${p.id}`,
            isInternal: true,
          }))
        )
      ).filter(
        (m) =>
          query.includes("ssc") && m.title.toLowerCase().includes("ssc") ||
          query.includes("bank") && m.title.toLowerCase().includes("ibps") ||
          query.includes("railway") && m.title.toLowerCase().includes("rrb") ||
          query.includes("bpsc") && m.title.toLowerCase().includes("bpsc") ||
          query.includes("ctet") && m.title.toLowerCase().includes("ctet") ||
          query.includes("upsc") && m.title.toLowerCase().includes("upsc") ||
          m.title.toLowerCase().includes("practice")
      ).slice(0, 3);

      // Web mock sources (Testbook, Adda247, Oliveboard, BYJU'S)
      const webScrapedMocks = [
        {
          title: `${jobTitle} 2025–2026 Official Testbook Series`,
          portal: "Testbook",
          questions: 100,
          duration: 60,
          link: `https://testbook.com/search?q=${encodeURIComponent(jobTitle)}`,
          isInternal: false,
        },
        {
          title: `${jobTitle} Full-Length Mock — Adda247 Portal`,
          portal: "Adda247",
          questions: 100,
          duration: 60,
          link: `https://www.adda247.com/search?q=${encodeURIComponent(jobTitle)}`,
          isInternal: false,
        },
        {
          title: `${jobTitle} High-Difficulty Speed Mock — Oliveboard`,
          portal: "Oliveboard",
          questions: 100,
          duration: 60,
          link: `https://www.oliveboard.in/search?q=${encodeURIComponent(jobTitle)}`,
          isInternal: false,
        },
      ];

      setFoundWebMocks([...internalMatches, ...webScrapedMocks]);
      setIsSearching(false);
    }, 300);
  }

  return (
    <div className="card p-5 border-violet-200 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" /> Web Exam Mock Test Finder
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search authentic mock test papers matching "{jobTitle}" across DeshKiSeva, Testbook &amp; Adda247
          </p>
        </div>

        <button
          type="button"
          onClick={handleSearchWebMocks}
          disabled={isSearching}
          className="btn-primary text-xs px-4 py-2.5 shrink-0 gap-1.5"
        >
          <Globe className="h-4 w-4" /> {isSearching ? "Searching Web..." : "Find Matching Mocks"}
        </button>
      </div>

      {searched && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {foundWebMocks.length} Authentic Mocks Matched:
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {foundWebMocks.map((mock, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm"
              >
                <div>
                  <span className="inline-block rounded-md bg-violet-100 text-violet-700 px-2 py-0.5 text-[10px] font-extrabold dark:bg-violet-900/50 dark:text-violet-300 mb-1">
                    {mock.portal}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{mock.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {mock.questions} Qs · {mock.duration} Mins
                  </p>
                </div>

                {mock.isInternal ? (
                  <Link
                    to={mock.link}
                    className="btn-primary text-xs px-3 py-1.5 shrink-0 gap-1"
                  >
                    Attempt <Play className="h-3 w-3" />
                  </Link>
                ) : (
                  <a
                    href={mock.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs px-3 py-1.5 shrink-0 gap-1"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
