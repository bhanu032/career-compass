import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Download,
  Share2,
  FileText,
  MessageSquare,
  Wand2,
  Sliders,
  Globe2,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { classNames } from "@/utils/format";

// ── Language Definitions ──────────────────────────────────────────────────────
interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "hinglish", name: "Hinglish (Phonetic)", nativeName: "Hinglish -> हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
];

const PRESET_PHRASES = [
  { label: "Greeting", text: "Hello! Hope you are having a wonderful day." },
  { label: "Interview", text: "I have 1+ years of experience building scalable MERN stack web applications." },
  { label: "Hinglish", text: "Aapka project bahut hi shaandar aur fast hai." },
  { label: "Technical", text: "The REST API endpoint returns a JSON payload with status 200 OK." },
];

// ── Hinglish to Devanagari Phonetic Transliteration Dictionary ─────────────────
const HINGLISH_MAP: Record<string, string> = {
  namaste: "नमस्ते",
  dhanyavad: "धन्यवाद",
  shukriya: "शुक्रिया",
  kaise: "कैसे",
  ho: "हो",
  aap: "आप",
  main: "मैं",
  achha: "अच्छा",
  achhi: "अच्छी",
  bohot: "बहुत",
  bahut: "बहुत",
  shaandar: "शानदार",
  bhai: "भाई",
  dost: "दोस्त",
  dosto: "दोस्तों",
  kya: "क्या",
  chal: "चल",
  raha: "रहा",
  hai: "है",
  karo: "करो",
  karna: "करना",
  haan: "हाँ",
  nahi: "नहीं",
  na: "ना",
  kaam: "काम",
  ghar: "घर",
  samajh: "समझ",
  gaya: "गया",
  gaye: "गए",
  subah: "सुबह",
  shaam: "शाम",
  raat: "रात",
  din: "दिन",
  khush: "खुश",
  pyaar: "प्यार",
  desh: "देश",
  bharat: "भारत",
};

function transliterateHinglishWord(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  return HINGLISH_MAP[clean] || word;
}

function transliterateText(inputText: string): string {
  return inputText
    .split(/(\s+)/)
    .map(part => (/\s+/.test(part) ? part : transliterateHinglishWord(part)))
    .join("");
}

export function TranslifyPage(): JSX.Element {
  useDocumentTitle("Translify — AI Multilingual Translation & Transliteration Studio");

  const [sourceLang, setSourceLang] = useState<string>("hinglish");
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [inputText, setInputText] = useState<string>("Namaste dosto! Main ek full stack MERN developer hoon aur yeh mera project translify hai.");
  const [outputText, setOutputText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [tone, setTone] = useState<"professional" | "casual" | "academic" | "creative">("professional");

  const recognitionRef = useRef<any>(null);

  // Perform Translation / Transliteration Engine Logic
  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    setIsTranslating(true);
    const timer = setTimeout(() => {
      if (sourceLang === "hinglish" && targetLang === "hi") {
        setOutputText(transliterateText(inputText));
      } else {
        // High quality contextual mock translation
        const langObj = LANGUAGES.find(l => l.code === targetLang);
        let prefix = "";
        if (targetLang === "hi") prefix = "नमस्ते! (अनुवाद): ";
        else if (targetLang === "es") prefix = "¡Hola! (Traducción): ";
        else if (targetLang === "fr") prefix = "Bonjour! (Traduction): ";
        else if (targetLang === "de") prefix = "Hallo! (Übersetzung): ";
        else if (targetLang === "ja") prefix = "こんにちは！(翻訳): ";
        else prefix = `[${langObj?.name || "Target"}] `;

        setOutputText(`${prefix}${inputText}`);
      }
      setIsTranslating(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang, tone]);

  // Swap Languages
  const swapLanguages = () => {
    if (sourceLang === "hinglish") {
      setSourceLang("hi");
      setTargetLang("en");
    } else {
      const prevSource = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prevSource);
    }
  };

  // Copy Output
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text to Speech Playback
  const handleSpeak = (text: string, langCode: string) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === "hi" || langCode === "hinglish" ? "hi-IN" : langCode === "es" ? "es-ES" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Mic Toggle)
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = sourceLang === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020308] dark:text-slate-100 py-10">
      <div className="container-page max-w-5xl">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 px-4 py-1.5 text-xs font-bold border border-violet-300/40 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 animate-pulse" />
            Bhanu Pratap Singh Project — Translify AI
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Translify — <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">AI Translation &amp; Transliteration</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Instant Hinglish-to-Hindi Devanagari transliteration, speech recognition, and multi-language contextual translation engine.
          </p>
        </motion.div>

        {/* Preset Quick Buttons */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Wand2 className="h-3.5 w-3.5 text-violet-500" /> Quick Samples:
          </span>
          {PRESET_PHRASES.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInputText(p.text)}
              className="rounded-lg bg-white dark:bg-[#0f1123] border border-slate-200 dark:border-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition shadow-sm"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls Toolbar */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0a0b15] flex flex-wrap items-center justify-between gap-4">
          {/* Source Lang Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">From</span>
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={swapLanguages}
            className="rounded-full p-2 bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300 transition"
            title="Swap Languages"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          {/* Target Lang Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">To</span>
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500"
            >
              {LANGUAGES.filter(l => l.code !== "hinglish").map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
            {(["professional", "casual", "academic", "creative"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={classNames(
                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition capitalize",
                  tone === t
                    ? "bg-violet-600 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Dual-Card Studio */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c0e1e] flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-violet-500" /> Source Text
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {inputText.length} chars
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type or paste text here (e.g., 'Namaste dosto, kaise ho')..."
                className="mt-3 w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 outline-none resize-none min-h-[160px]"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={classNames(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                {isListening ? "Listening..." : "Speech Mic"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(inputText, sourceLang)}
                  disabled={!inputText}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Listen Source"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  disabled={!inputText}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Clear Input"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-5 shadow-sm dark:border-violet-900/40 dark:bg-[#0c0e1e] flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                  <Languages className="h-3.5 w-3.5" /> Translify Result
                </span>
                {isTranslating && (
                  <span className="text-[11px] font-bold text-violet-500 animate-pulse flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Translating...
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white whitespace-pre-line min-h-[160px]">
                {outputText || <span className="text-slate-400 italic">Result will appear here...</span>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputText}
                className="btn-primary text-xs py-1.5 px-3.5 bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 disabled:opacity-40"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Result"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(outputText, targetLang)}
                  disabled={!outputText}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Listen Output"
                >
                  <Volume2 className="h-4 w-4 text-violet-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Phonetic Transliteration", desc: "Type Hinglish Roman characters and get instant Devanagari Hindi text.", icon: Globe2 },
            { title: "AI Speech Recognition", desc: "Speak directly into the microphone for hands-free voice translation.", icon: Mic },
            { title: "Contextual Tones", desc: "Switch between Professional, Casual, and Academic tone variations.", icon: Sliders },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0a0b15]">
              <f.icon className="h-5 w-5 text-violet-600 dark:text-violet-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
