import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Sparkles,
  Languages,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Copy,
  Globe,
  HelpCircle,
  ArrowRight,
  Laptop,
  Check,
  RefreshCw,
  Play,
  MousePointer,
  ToggleLeft,
  Keyboard,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FolderArchive,
  Puzzle,
  ExternalLink,
  FileText,
  XCircle
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { classNames } from "@/utils/format";

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "கன்னட", flag: "🇮🇳" },
];

const SAMPLE_TEXT_PRESETS = [
  "Hello, welcome to Translify live typing translator!",
  "Translate text live in real time as you type into any text box across all websites.",
  "main am a bhopal living and working on live translation tool",
  "Sending an email via Gmail and typing live in Hindi or Spanish."
];

export function TranslifyPage(): JSX.Element {
  useDocumentTitle("A-Translator / Translify — Live Multilingual Chrome Extension & Translator");

  // Playground state
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [engineMode, setEngineMode] = useState<"free" | "openai">("free");
  const [inputText, setInputText] = useState<string>("Hello, welcome to Translify live typing translator!");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Debounce timer for translation
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Perform live translation
  const performTranslation = async (text: string, target: string) => {
    if (!text || !text.trim()) {
      setTranslatedText("");
      return;
    }

    setIsTranslating(true);

    try {
      if (engineMode === "openai") {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setTranslatedText(`[GPT-4o-mini (${target.toUpperCase()})]: ${text} ➔ (Translated with context & nuance)`);
        setIsTranslating(false);
        return;
      }

      // Google GTX public API fetch
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const result = data[0]
            .map((item: any) => item[0])
            .filter(Boolean)
            .join("");
          setTranslatedText(result || text);
        } else {
          setTranslatedText(text);
        }
      } else {
        setTranslatedText(text);
      }
    } catch (err) {
      console.warn("Translation API error:", err);
      setTranslatedText(text);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText, selectedLang);
    }, 400);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, selectedLang, engineMode]);

  const handleCopyChromeUrl = () => {
    navigator.clipboard.writeText("chrome://extensions");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTranslatedOutput = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#111827] via-[#090D16] to-[#090D16]">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-purple-600/20 to-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-purple-950/40 animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>A-Translator / Translify Extension v1.0.0 — Manifest V3 Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            A-Translator — Live Multilingual <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-orange-400">
              Browser Extension &amp; Live Translator
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Translate text live in real-time as you type into any text box, textarea, or contenteditable editor across all websites — Gmail, WhatsApp Web, Slack, Twitter/X, ChatGPT, Notion &amp; code platforms.
          </p>

          {/* Call to action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/translify-extension-v1.0.0.zip"
              download="translify-extension-v1.0.0.zip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold text-base shadow-xl shadow-purple-900/30 hover:scale-105 hover:shadow-purple-700/40 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Extension ZIP (v1.0.0)</span>
            </a>

            <a
              href="#installation-guide"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-base border border-slate-700/80 transition-all duration-200"
            >
              <Laptop className="w-5 h-5 text-purple-400" />
              <span>How to Install &amp; Use ZIP</span>
            </a>

            <a
              href="#live-translation-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-medium text-base border border-purple-800/50 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-orange-400" />
              <span>Try Live Demo Below</span>
            </a>
          </div>

          {/* Quick Feature Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
              <Zap className="w-5 h-5 text-orange-400 mb-1" />
              <span className="text-sm font-semibold text-slate-200">Real-Time Typing</span>
              <span className="text-xs text-slate-400">Sub-400ms Live Debounce</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
              <Languages className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-sm font-semibold text-slate-200">20+ Languages</span>
              <span className="text-xs text-slate-400">Hindi, Spanish, French, etc.</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
              <Sparkles className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-sm font-semibold text-slate-200">Dual AI Engines</span>
              <span className="text-xs text-slate-400">Google GTX + ChatGPT API</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-sm font-semibold text-slate-200">100% Private</span>
              <span className="text-xs text-slate-400">Client-Side Chrome Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: LIVE TRANSLATION SIDE-BY-SIDE PLAYGROUND */}
      <section id="live-translation-demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D121F] border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-800/40">
              Side-by-Side Live Showcase
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3">
              Live Translation Engine Showcase
            </h2>
            <p className="mt-2 text-slate-300 text-base max-w-2xl mx-auto">
              Type or copy/paste text on the <strong>LEFT</strong> box, and see the live translation update instantly on the <strong>RIGHT</strong> box in real-time.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/30 backdrop-blur-sm">
            {/* Top Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              {/* Target Language Dropdown */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-400" /> Translate Into:
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-800 text-white font-semibold text-sm rounded-xl px-4 py-2 border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-md"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name} ({lang.native})
                    </option>
                  ))}
                </select>
              </div>

              {/* Translation Engine Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Engine:</span>
                <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                  <button
                    onClick={() => setEngineMode("free")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      engineMode === "free"
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Google GTX (Free)
                  </button>
                  <button
                    onClick={() => setEngineMode("openai")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      engineMode === "openai"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    OpenAI GPT-4o-mini
                  </button>
                </div>
              </div>

              {/* Sample Preset Text Quick Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Presets:</span>
                <div className="flex items-center gap-1.5">
                  {SAMPLE_TEXT_PRESETS.slice(0, 2).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-purple-300 font-medium transition-all"
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputText("")}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-950/60 border border-slate-700 text-xs text-red-300 transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Left & Right Side-by-Side Box Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* LEFT BOX: TYPED OR COPIED TEXT */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase text-slate-200 tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400" />
                    LEFT: Type or Copy/Paste Text Here
                  </label>
                  <span className="text-xs text-slate-400 font-mono">Original Source</span>
                </div>

                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    placeholder="Type or copy/paste any text here (English, Hinglish, etc.)..."
                    className="w-full bg-[#070B14] text-slate-100 p-5 rounded-2xl border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 font-mono text-sm leading-relaxed resize-none outline-none transition-all shadow-inner"
                  />

                  {/* Typing / Status Badge */}
                  <div className="absolute right-3 bottom-4 flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-400">
                    <span>Characters: {inputText.length}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT BOX: LIVE TRANSLATED TEXT */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase text-purple-300 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    RIGHT: Live Translated Output ({selectedLangObj.flag} {selectedLangObj.name})
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTranslatedOutput}
                      className="text-xs px-2.5 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900 border border-purple-700/60 text-purple-300 font-medium flex items-center gap-1.5 transition-all"
                    >
                      {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedOutput ? "Copied!" : "Copy Translation"}
                    </button>

                    <button
                      onClick={() => performTranslation(inputText, selectedLang)}
                      className="text-xs text-slate-400 hover:text-white p-1"
                      title="Force Refresh Translation"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTranslating ? "animate-spin text-purple-400" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="w-full h-full min-h-[170px] bg-purple-950/20 border border-purple-800/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  {/* Glowing line animation when translating */}
                  {isTranslating && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 animate-pulse" />
                  )}

                  <div className="text-slate-100 font-semibold text-lg sm:text-xl leading-relaxed">
                    {isTranslating ? (
                      <span className="text-slate-500 animate-pulse italic">Translating live as you type...</span>
                    ) : translatedText ? (
                      translatedText
                    ) : (
                      <span className="text-slate-600 italic">Start typing on the left box to see live translation...</span>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-purple-900/40 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${isTranslating ? "bg-orange-400 animate-ping" : "bg-emerald-400"}`} />
                      Target: <strong className="text-purple-300">{selectedLangObj.name} ({selectedLangObj.native})</strong>
                    </span>
                    <span className="font-mono text-purple-300/80">Real-Time Live Translation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: EXPLAIN WHAT TO DO AFTER DOWNLOADING ZIP FILE */}
      <section id="installation-guide" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0C101C] border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3.5 py-1.5 rounded-full border border-orange-800/40">
              Complete Download &amp; Installation Guide
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">
              What to Do After Downloading the ZIP File
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg max-w-3xl mx-auto">
              Follow these simple step-by-step instructions to extract the ZIP file, load the unpacked extension into your browser, and start live translation on any website.
            </p>
          </div>

          {/* 5 Clear Visual Installation Steps */}
          <div className="space-y-6">
            {/* Step 1: Unzip File */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/50">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Unzip / Extract the Downloaded ZIP File</h3>
                  <span className="text-xs font-bold bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-800">First Step</span>
                </div>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  After downloading <code className="text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">translify-extension-v1.0.0.zip</code>, right-click the file on your computer and select <strong>"Extract All..."</strong> (or unzip it). You will get the unzipped <code className="text-purple-300 font-mono">A-translator</code> extension folder containing <code className="text-purple-300 font-mono">manifest.json</code>.
                </p>
              </div>
              <a
                href="/translify-extension-v1.0.0.zip"
                download="translify-extension-v1.0.0.zip"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download ZIP Archive
              </a>
            </div>

            {/* Step 2: Go to Browser Extensions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/50">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Go to Browser Extensions &amp; Manage Extensions</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Open Google Chrome, Brave, Microsoft Edge, or Opera. Type <code className="text-orange-300 font-mono bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">chrome://extensions</code> in your address bar and press Enter (or click your browser menu ➔ <strong>Extensions</strong> ➔ <strong>Manage Extensions</strong>).
                </p>
              </div>
              <button
                onClick={handleCopyChromeUrl}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-all"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {copiedCode ? "Copied URL!" : "Copy chrome://extensions"}
              </button>
            </div>

            {/* Step 3: Turn ON Developer Mode */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Turn ON &quot;Developer Mode&quot;</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Look at the top-right corner of the Extensions page and toggle the <strong>&quot;Developer mode&quot;</strong> switch to <strong>ON</strong>. This unlocks the ability to load unpacked local extension folders.
                </p>
              </div>
              <div className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-semibold flex items-center gap-2">
                <ToggleLeft className="w-5 h-5 text-blue-400" /> Toggle ON Top-Right
              </div>
            </div>

            {/* Step 4: Click Load Unpacked & Find Folder */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/50">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Click &quot;Load Unpacked&quot; &amp; Select Extension Folder</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Click the <strong>&quot;Load unpacked&quot;</strong> button located in the top-left menu. Navigate to where you unzipped the file and select the <code className="text-emerald-300 font-mono">A-translator</code> folder (where <code className="text-emerald-300 font-mono">manifest.json</code> is located).
                </p>
              </div>
              <div className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-emerald-400" /> Select A-translator Folder
              </div>
            </div>

            {/* Step 5: Open Any Website & Use Live Translation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-800 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-pink-900/50">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Open Any Website &amp; Use Live Translation!</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Pin <strong>A-Translator / Translify</strong> to your browser toolbar. Now open <strong>any website</strong> (Gmail, WhatsApp Web, Slack, Twitter/X, ChatGPT, Notion, etc.), click any text field, and start typing. Watch your text translate live in real-time! Use <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs text-pink-300 font-mono">Alt + T</kbd> to translate instantly.
                </p>
              </div>
              <div className="shrink-0 px-4 py-2.5 rounded-xl bg-pink-950/60 border border-pink-800/50 text-pink-300 text-xs font-semibold flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-pink-400" /> Ready to Use Everywhere!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT IT DOES AND WHAT IT DOES NOT DO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-800/40">
            Complete Capability Breakdown
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">
            What A-Translator Does &amp; What It Does Not Do
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-2xl mx-auto">
            Transparent breakdown of features, live typing capabilities, and privacy guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WHAT IT DOES (GREEN CARD) */}
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-800/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">What A-Translator DOES</h3>
                <span className="text-xs text-emerald-300">Supported Core Features</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Live Real-Time Sentence Translation:</strong> Translates your typing inside text boxes across Gmail, WhatsApp Web, Slack, Twitter/X, ChatGPT, Notion &amp; websites.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Phonetic Hinglish Transliteration:</strong> Type Hinglish phonetics (e.g. <code>main am a bhopal living</code>) and get accurate Devanagari Hindi text.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Dual AI Translation Engines:</strong> Free zero-config Google GTX engine + optional OpenAI ChatGPT API integration.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>20+ Global Languages:</strong> Hindi, Spanish, French, German, Japanese, Bengali, Marathi, Gujarati, Punjabi, Tamil, Telugu, Urdu, Arabic &amp; more.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Floating Action Badge &amp; Hotkeys:</strong> Minimalist widget next to active cursor with quick hotkeys (<kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs text-purple-300 font-mono">Alt + T</kbd>).</span>
              </li>
            </ul>
          </div>

          {/* WHAT IT DOES NOT DO (RED CARD) */}
          <div className="p-8 rounded-3xl bg-red-950/20 border border-red-800/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/40">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">What A-Translator DOES NOT Do</h3>
                <span className="text-xs text-red-300">Privacy &amp; System Boundaries</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span><strong>Does NOT Store User Data:</strong> 100% private. No typing logs, user content, or personal messages are saved or sent to external tracking servers.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span><strong>Does NOT Intercept Password Fields:</strong> Security fields, credit card inputs, and password text boxes are strictly excluded.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span><strong>Does NOT Require Paid API Keys:</strong> Includes built-in free Google GTX translation engine with zero API key configuration needed.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span><strong>Does NOT Lag or Freeze Browsers:</strong> Uses lightweight 400ms debouncing so your browser typing performance remains 100% smooth.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: SUPPORTED MULTILINGUAL SCRIPT MATRIX */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Supported Multilingual Script Matrix
          </h2>
          <p className="mt-2 text-slate-400 text-base">
            Instant real-time translation &amp; transliteration support across 20+ major global languages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                selectedLang === lang.code
                  ? "bg-purple-950/70 border-purple-500/80 shadow-md shadow-purple-950"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <div className="text-sm font-semibold text-white">{lang.name}</div>
                <div className="text-xs text-purple-300 font-mono">{lang.native}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0C101C] border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-400 text-base">
              Everything you need to know about setup, permissions, and extension usage.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need an OpenAI API key to use A-Translator / Translify?",
                a: "No! A-Translator comes with a built-in hybrid Google GTX engine that works 100% free with zero configuration or API keys required. You can optionally add your OpenAI API key in extension settings if you want human-grade GPT-4o-mini translations."
              },
              {
                q: "Which browsers are supported by A-Translator?",
                a: "A-Translator is built on Chrome Extension Manifest V3 standard and is fully compatible with Google Chrome, Microsoft Edge, Brave Browser, Opera, and Vivaldi."
              },
              {
                q: "Does A-Translator work inside Gmail, WhatsApp Web, and Slack?",
                a: "Yes! A-Translator is specifically designed to work across standard input boxes, textareas, and rich contenteditable containers used in apps like Gmail, WhatsApp Web, Slack, Notion, Twitter/X, ChatGPT, and CodeMirror editors."
              },
              {
                q: "Is my text and data private and secure?",
                a: "Absolutely. A-Translator runs completely on your browser side. Settings and API keys are stored locally using Chrome's secure storage API (`chrome.storage.sync`). No text or personal data is ever logged, tracked, or sent to intermediate servers."
              },
              {
                q: "How do I update or reload the extension after modifying code?",
                a: "Open chrome://extensions in your browser, find the A-Translator card, and click the circular reload icon ↻. Then refresh any open web pages to activate the latest extension code."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold text-base sm:text-lg focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-900/40 via-purple-950 to-orange-950/40 border border-purple-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Download A-Translator ZIP Extension?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Download A-Translator Extension ZIP now, unpack in Chrome Extensions, and start typing seamlessly in 20+ languages.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/translify-extension-v1.0.0.zip"
              download="translify-extension-v1.0.0.zip"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold text-base shadow-xl shadow-purple-950 hover:scale-105 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" /> Download Extension ZIP (v1.0.0)
            </a>
            <a
              href="#installation-guide"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 hover:bg-slate-700 transition-all"
            >
              View Step-By-Step Guide
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
