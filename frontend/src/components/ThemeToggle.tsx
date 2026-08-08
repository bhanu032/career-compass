import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

/** Small tricolor flag strip shown in the button */
function TricolorStrip() {
  return (
    <span
      className="flex h-[18px] w-[18px] flex-col overflow-hidden rounded-sm"
      style={{ border: "1px solid rgba(0,0,128,0.25)" }}
      aria-hidden="true"
    >
      <span className="flex-1" style={{ background: "#FF9933" }} />
      <span className="flex flex-1 items-center justify-center" style={{ background: "#FFFFFF" }}>
        <span
          className="block rounded-full"
          style={{ width: 5, height: 5, border: "1px solid #000080" }}
        />
      </span>
      <span className="flex-1" style={{ background: "#138808" }} />
    </span>
  );
}

const LABELS: Record<string, string> = {
  light:     "Switch to tricolor mode",
  tricolor:  "Switch to dark mode",
  dark:      "Switch to light mode",
};

export function ThemeToggle(): JSX.Element {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={LABELS[theme]}
      title={LABELS[theme]}
      className="btn-ghost relative h-10 w-10 rounded-xl p-0 overflow-hidden"
    >
      {theme === "dark" && <Sun className="h-[18px] w-[18px]" />}
      {theme === "light" && <Moon className="h-[18px] w-[18px]" />}
      {theme === "tricolor" && <TricolorStrip />}
    </button>
  );
}
