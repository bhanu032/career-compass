import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Smartphone,
  Laptop,
  Bluetooth,
  Usb,
  Wifi,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  Terminal,
  ChevronDown,
  ChevronUp,
  Send,
  FolderArchive,
  EyeOff,
  Cpu,
  Keyboard,
  Share2,
  Sparkles,
  Flame,
  FileText
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const SHORTCUT_BUTTONS = [
  { label: "Ctrl+C", code: "Ctrl+C", desc: "Copy Selection" },
  { label: "Ctrl+V", code: "Ctrl+V", desc: "Paste Text" },
  { label: "Ctrl+A", code: "Ctrl+A", desc: "Select All" },
  { label: "Ctrl+Z", code: "Ctrl+Z", desc: "Undo Action" },
  { label: "Alt+Tab", code: "Alt+Tab", desc: "Switch Application" },
  { label: "Win+D", code: "Win+D", desc: "Show Desktop" },
  { label: "Alt+F4", code: "Alt+F4", desc: "Close Window" },
  { label: "TaskMgr", code: "Ctrl+Shift+Esc", desc: "Open Task Manager" },
];

const FUNCTION_KEYS = ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Del"];

const SAMPLE_TEXT_SNIPPETS = [
  "Hello from aMobile! This text was typed directly from Android into Windows PC.",
  "नमस्ते भारत! aMobile supports seamless Unicode & Devanagari Hindi typing 🇮🇳",
  "def solve(n: int) -> int:\n    return n * (n + 1) // 2",
  "🚀 Fast file drop and physical HID keyboard with 0ms perceptible latency."
];

export function AMobilePage(): JSX.Element {
  useDocumentTitle("aMobile — Phone to PC Hardware Keyboard & Fast File Bridge");

  // Playground state
  const [activeTab, setActiveTab] = useState<"keyboard" | "text" | "file">("keyboard");
  const [activeGuideTab, setActiveGuideTab] = useState<"bluetooth" | "usb" | "filedrop" | "stealth">("bluetooth");
  const [ctrlActive, setCtrlActive] = useState(false);
  const [altActive, setAltActive] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);
  const [winActive, setWinActive] = useState(false);
  const [typedInput, setTypedInput] = useState("");
  const [bulkTextInput, setBulkTextInput] = useState("Hello from aMobile phone bridge! 🚀");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM]: aMobile Bridge initialised (Protocol v2.4 HID)",
    "[HID]: Emulated 104-key Bluetooth HID device ready",
    "[STATUS]: Windows paired with native 'kbdhid.sys' driver (LLKHF_INJECTED = 0)"
  ]);
  const [fileSwipeProgress, setFileSwipeProgress] = useState(0);
  const [fileTransferStatus, setFileTransferStatus] = useState<"idle" | "sending" | "done">("idle");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-14), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleKeyClick = (key: string) => {
    const modifiers = [
      ctrlActive ? "Ctrl" : "",
      altActive ? "Alt" : "",
      shiftActive ? "Shift" : "",
      winActive ? "Win" : "",
    ].filter(Boolean).join("+");

    const fullCombo = modifiers ? `${modifiers}+${key}` : key;
    addLog(`[KEY EVENT]: ${fullCombo} sent (ScanCode: 0x${(key.charCodeAt(0) || 0x20).toString(16).toUpperCase()}) -> Target: Active Window`);
  };

  const handleSendBulkText = () => {
    if (!bulkTextInput.trim()) return;
    addLog(`[UNICODE STREAM]: Broadcasting ${bulkTextInput.length} characters to PC active input`);
    setTimeout(() => {
      addLog(`[STREAM COMPLETE]: Sent text successfully without clipboard interference`);
    }, 400);
  };

  const handleSwipeSendFile = () => {
    if (fileTransferStatus === "sending") return;
    setFileTransferStatus("sending");
    setFileSwipeProgress(100);
    addLog(`[FILE TRANSFER]: Streaming 'report_2026_final.pdf' (1.42 MB) to Windows PC...`);

    setTimeout(() => {
      setFileTransferStatus("done");
      addLog(`[FILE SAVED]: Successfully written to 'C:\\Users\\PC\\Downloads\\report_2026_final.pdf' (Zero collision)`);
      setTimeout(() => {
        setFileSwipeProgress(0);
        setFileTransferStatus("idle");
      }, 3000);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#121829] via-[#090D16] to-[#090D16]">
        {/* Background glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-r from-orange-600/20 via-purple-600/25 to-blue-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/70 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-orange-950/40">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>aMobile v2.4 — True Physical Hardware HID &amp; File Bridge</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Phone to PC <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-purple-300 to-cyan-400">
              Hardware Keyboard &amp; Bridge
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Transform your Android phone into a genuine <strong>Physical Hardware Keyboard</strong>, high-speed text broadcaster, and fast wireless PC file drop bridge. Recognized natively by Windows Device Manager as an actual <code className="text-orange-300 bg-slate-800 px-1.5 py-0.5 rounded text-sm">HID Keyboard Device</code> with zero software flags.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/amobile.apk"
              download="amobile.apk"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 text-white font-semibold text-base shadow-xl shadow-orange-900/30 hover:scale-105 hover:shadow-orange-700/40 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Android App (.APK)</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">v2.4 (80 KB)</span>
            </a>

            <a
              href="/amobile-windows-bridge.zip"
              download="amobile-windows-bridge.zip"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 font-medium text-base border border-slate-700 shadow-lg transition-all duration-200"
            >
              <FolderArchive className="w-5 h-5 text-purple-400" />
              <span>Download Windows Companion (.ZIP)</span>
              <span className="text-xs bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-full font-mono">2.3 MB</span>
            </a>

            <a
              href="#interactive-simulator"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-medium text-base border border-purple-800/50 transition-all duration-200"
            >
              <Keyboard className="w-5 h-5 text-orange-400" />
              <span>Interactive Pad Demo</span>
            </a>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Bluetooth className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-100">0 PC Software</span>
              </div>
              <p className="text-xs text-slate-400">Pure Bluetooth HID hardware profile. Windows uses native <code className="text-slate-300">kbdhid.sys</code>.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-100">Undetected / SEB</span>
              </div>
              <p className="text-xs text-slate-400">Zero injected flags (<code className="text-slate-300">LLKHF_INJECTED = 0</code>). Safe Exam Browser &amp; BIOS ready.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-100">Swipe File Drop</span>
              </div>
              <p className="text-xs text-slate-400">Wireless &amp; USB high-speed file drop directly into Windows Downloads.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <EyeOff className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-100">TaskMgr Stealth</span>
              </div>
              <p className="text-xs text-slate-400">64-bit trampoline hooking completely hides processes from Task Manager.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE MOBILE PAD SIMULATOR */}
      <section id="interactive-simulator" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D121F] border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Try the aMobile Controller &amp; Hardware Stream
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Test how buttons, keyboard shortcuts, unicode text broadcasting, and swipe-to-send file transfers translate into instant low-level hardware scan codes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Phone Simulator Frame */}
            <div className="lg:col-span-7 bg-[#151D30] rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl shadow-black/60 relative">
              {/* Phone Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>aMobile Virtual Pad</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-xs text-slate-400">Mode: Bluetooth HID (Direct kbdhid.sys)</div>
                  </div>
                </div>

                {/* Sub-tabs inside phone */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("keyboard")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "keyboard"
                        ? "bg-orange-500 text-white font-semibold shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ⌨️ Keyboard
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-orange-500 text-white font-semibold shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📝 Text Box
                  </button>
                  <button
                    onClick={() => setActiveTab("file")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "file"
                        ? "bg-orange-500 text-white font-semibold shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📁 File Drop
                  </button>
                </div>
              </div>

              {/* TAB CONTENT: KEYBOARD PAD */}
              {activeTab === "keyboard" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Function Keys Row */}
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Function Keys (F1 - F12)</span>
                      <span className="text-[10px] text-orange-400 font-mono">Hardware HID Row</span>
                    </div>
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                      {FUNCTION_KEYS.map((k) => (
                        <button
                          key={k}
                          onClick={() => handleKeyClick(k)}
                          className="h-8 rounded bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-semibold font-mono border border-slate-700 transition-all active:scale-95 flex items-center justify-center"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Windows Shortcuts Bar */}
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Windows 1-Tap Quick Actions
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SHORTCUT_BUTTONS.map((btn) => (
                        <button
                          key={btn.label}
                          onClick={() => handleKeyClick(btn.code)}
                          className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 hover:border-purple-500/50 border border-slate-700/80 text-left transition-all active:scale-95 group"
                        >
                          <div className="text-xs font-bold text-orange-300 font-mono group-hover:text-white">
                            {btn.label}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{btn.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Latching Modifiers & Navigation */}
                  <div className="pt-2 border-t border-slate-700/60">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Latching Modifiers &amp; Navigation
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setCtrlActive(!ctrlActive);
                            addLog(`[MODIFIER]: Ctrl ${!ctrlActive ? "ENGAGED" : "RELEASED"}`);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${
                            ctrlActive
                              ? "bg-orange-500 text-white border-orange-400 shadow-md"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          CTRL
                        </button>
                        <button
                          onClick={() => {
                            setAltActive(!altActive);
                            addLog(`[MODIFIER]: Alt ${!altActive ? "ENGAGED" : "RELEASED"}`);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${
                            altActive
                              ? "bg-orange-500 text-white border-orange-400 shadow-md"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          ALT
                        </button>
                        <button
                          onClick={() => {
                            setShiftActive(!shiftActive);
                            addLog(`[MODIFIER]: Shift ${!shiftActive ? "ENGAGED" : "RELEASED"}`);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${
                            shiftActive
                              ? "bg-orange-500 text-white border-orange-400 shadow-md"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          SHIFT
                        </button>
                        <button
                          onClick={() => {
                            setWinActive(!winActive);
                            addLog(`[MODIFIER]: Win Key ${!winActive ? "ENGAGED" : "RELEASED"}`);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${
                            winActive
                              ? "bg-orange-500 text-white border-orange-400 shadow-md"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          WIN
                        </button>
                      </div>

                      {/* Directional pad */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => handleKeyClick("Left")}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center"
                        >
                          ◄
                        </button>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleKeyClick("Up")}
                            className="w-7 h-3.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center justify-center"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleKeyClick("Down")}
                            className="w-7 h-3.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center justify-center"
                          >
                            ▼
                          </button>
                        </div>
                        <button
                          onClick={() => handleKeyClick("Right")}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center"
                        >
                          ►
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live typing input bar */}
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Live Real-Time Keystroke Broadcaster
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type here to stream live hardware keystrokes..."
                        value={typedInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          const lastChar = val.slice(-1);
                          setTypedInput(val);
                          if (lastChar) {
                            addLog(`[LIVE TYPE]: Key '${lastChar}' -> Hardware ScanCode injected`);
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <button
                        onClick={() => {
                          setTypedInput("");
                          addLog("[KEY EVENT]: Backspace x 20 / Clear buffer");
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg font-medium border border-slate-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: BULK TEXT SENDER */}
              {activeTab === "text" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span>Unicode Text &amp; Code Snippet Broadcaster</span>
                      <span className="text-xs text-emerald-400">Devanagari / English / Emojis</span>
                    </div>
                    <textarea
                      rows={4}
                      value={bulkTextInput}
                      onChange={(e) => setBulkTextInput(e.target.value)}
                      placeholder="Enter text or paste code to type into Windows PC..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  {/* Sample presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_TEXT_SNIPPETS.map((snippet, idx) => (
                      <button
                        key={idx}
                        onClick={() => setBulkTextInput(snippet)}
                        className="text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 truncate max-w-[200px]"
                      >
                        {snippet.slice(0, 24)}...
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <div className="text-xs text-slate-400">
                      Supports SEB direct stream &amp; Ctrl+V bypass
                    </div>
                    <button
                      onClick={handleSendBulkText}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-lg shadow-orange-950/50 active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Broadcast to PC</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: FILE DROP */}
              {activeTab === "file" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">report_2026_final.pdf</div>
                        <div className="text-xs text-slate-400">1.42 MB • Ready for PC Transfer</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                      Downloads\
                    </span>
                  </div>

                  {/* Interactive Swipe-to-Send Slider */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                      <span>Interactive Swipe-to-Send Slider</span>
                      <span className="text-orange-400 text-xs font-mono">
                        {fileTransferStatus === "sending" ? "Streaming..." : fileTransferStatus === "done" ? "Delivered! ✓" : "Slide Rocket"}
                      </span>
                    </div>

                    <div className="relative h-14 bg-slate-950 rounded-full p-1 border border-slate-800 overflow-hidden flex items-center">
                      {/* Background fill */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${fileSwipeProgress}%` }}
                      />

                      <div className="w-full text-center text-xs font-medium text-slate-400 pointer-events-none relative z-10">
                        {fileTransferStatus === "idle" && "Swipe Rocket ➔ to Drop File to PC"}
                        {fileTransferStatus === "sending" && "Transferring over local TCP 58888..."}
                        {fileTransferStatus === "done" && "Saved to Windows Downloads Folder!"}
                      </div>

                      {/* Slider Button */}
                      <button
                        onClick={handleSwipeSendFile}
                        disabled={fileTransferStatus === "sending"}
                        className={`absolute top-1 bottom-1 w-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all z-20 ${
                          fileSwipeProgress === 100 ? "right-1" : "left-1"
                        }`}
                      >
                        <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="text-slate-400">Target Folder</div>
                      <div className="font-mono text-slate-200 text-[11px] truncate">C:\Users\...\Downloads</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="text-slate-400">Collision Logic</div>
                      <div className="font-mono text-emerald-400 text-[11px]">Auto file (1).pdf</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Hardware Packet Log Terminal */}
            <div className="lg:col-span-5 bg-[#0A0E1A] rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-mono font-semibold">
                  <Terminal className="w-4 h-4 text-orange-400" />
                  <span>PC Inbound Hardware Console</span>
                </div>
                <button
                  onClick={() => setLogs(["[SYSTEM]: Log buffer reset"])}
                  className="text-slate-500 hover:text-slate-300 font-mono text-[11px]"
                >
                  Clear
                </button>
              </div>

              {/* Logs Stream */}
              <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 py-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800"
              >
                {logs.map((l, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed break-all ${
                      l.includes("KEY EVENT")
                        ? "text-cyan-300"
                        : l.includes("LIVE TYPE")
                        ? "text-orange-300"
                        : l.includes("UNICODE") || l.includes("STREAM")
                        ? "text-purple-300"
                        : l.includes("FILE")
                        ? "text-emerald-300"
                        : l.includes("MODIFIER")
                        ? "text-amber-300"
                        : "text-slate-400"
                    }`}
                  >
                    {l}
                  </div>
                ))}
              </div>

              {/* Terminal Footer Specs */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Latency</span>
                  <span className="font-bold text-emerald-400">&lt; 1.2 ms</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Injection</span>
                  <span className="font-bold text-orange-400">0 (Physical)</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Driver</span>
                  <span className="font-bold text-purple-400">kbdhid.sys</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STEP-BY-STEP SETUP GUIDES */}
      <section id="setup-guide" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" /> Setup Manual
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Complete Installation &amp; Connection Guide
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">
            Choose your preferred connection method. Bluetooth mode requires <strong>zero companion software on PC</strong>, while USB &amp; Wi-Fi modes provide high-speed file drop and scan code engines.
          </p>

          {/* Mode Selector Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex-wrap justify-center gap-1">
            <button
              onClick={() => setActiveGuideTab("bluetooth")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeGuideTab === "bluetooth"
                  ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              <span>1. Bluetooth HID (0 PC Software)</span>
            </button>
            <button
              onClick={() => setActiveGuideTab("usb")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeGuideTab === "usb"
                  ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Usb className="w-4 h-4" />
              <span>2. USB-C Cable (ADB Tunnel)</span>
            </button>
            <button
              onClick={() => setActiveGuideTab("filedrop")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeGuideTab === "filedrop"
                  ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>3. Wi-Fi Direct &amp; File Drop</span>
            </button>
            <button
              onClick={() => setActiveGuideTab("stealth")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeGuideTab === "stealth"
                  ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>4. Stealth TaskMgr Hider &amp; SEB</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BLUETOOTH HID GUIDE */}
        {activeGuideTab === "bluetooth" && (
          <div className="bg-[#111728] rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Bluetooth className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Method A: Pure Physical Bluetooth HID Keyboard (Recommended)
                </h3>
                <p className="text-sm text-slate-400">
                  Requires <strong>zero PC software or companion EXE</strong>. Windows treats your phone as an actual Bluetooth hardware keyboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Install App on Phone</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Download and install <code className="text-orange-300">amobile.apk</code> on your Android 9+ device. No root required.
                </p>
                <a
                  href="/amobile.apk"
                  download="amobile.apk"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300"
                >
                  <Download className="w-3.5 h-3.5" /> Download APK
                </a>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Enable Discoverability</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open the app, tap <strong className="text-slate-200">"📡 Bluetooth"</strong> at top right, and click <strong className="text-slate-200">"Make Phone Discoverable as Physical Keyboard"</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Pair on Windows PC</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Go to <strong className="text-slate-200">Windows Settings &gt; Bluetooth &amp; Devices &gt; Add Device</strong>. Select your phone. Windows pairs with standard <code className="text-slate-300">kbdhid.sys</code>.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">
                  ✓
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Ready to Type</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Switch between <strong className="text-slate-200">Live PC Keyboard</strong> and <strong className="text-slate-200">Text Sender</strong>. Keystrokes type into BIOS, lock screens, SEB &amp; apps!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USB-C CABLE MODE */}
        {activeGuideTab === "usb" && (
          <div className="bg-[#111728] rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Usb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Method B: USB-C Cable with Low-Latency ADB Reverse Tunnel
                </h3>
                <p className="text-sm text-slate-400">
                  Ideal for wired ultra-fast response time (&lt; 0.5 ms) and guaranteed direct port 58888 hardware scan code injection.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Connect USB-C &amp; Enable Debugging</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Plug your phone into PC with a USB-C cable. On your phone, enable <strong className="text-slate-200">Developer Options &gt; USB Debugging</strong>.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Run Companion Bridge Batch</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Extract the downloaded Windows package and run <code className="text-orange-300 font-mono">START_UNIFIED_BRIDGE.bat</code>.
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>START_UNIFIED_BRIDGE.bat</span>
                  <button
                    onClick={() => copyToClipboard("START_UNIFIED_BRIDGE.bat", "bat1")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === "bat1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Auto Reverse Tunnel (Port 58888)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The script runs <code className="text-slate-300 font-mono">adb reverse tcp:58888 tcp:58888</code>. Status badge turns <span className="text-emerald-400 font-semibold">🟢 Connected</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WI-FI DIRECT & FILE DROP GUIDE */}
        {activeGuideTab === "filedrop" && (
          <div className="bg-[#111728] rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Method C: Wi-Fi Direct &amp; High-Speed PC File Drop (Swipe-to-Send)
                </h3>
                <p className="text-sm text-slate-400">
                  Send documents, images, code, and PDFs directly to your Windows <code className="text-slate-300">Downloads</code> folder wirelessly with zero cloud dependencies.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Same Wi-Fi or Hotspot</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect your phone and PC to the same Wi-Fi network, or connect your PC to the phone's mobile hotspot.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Select Files on Phone</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open aMobile, navigate to <strong className="text-slate-200">File Drop</strong>, and pick any file type (PDF, docx, zip, cpp, txt, mp4, etc.).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-100 mb-2">Swipe Rocket to Send</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Slide the interactive rocket button. File lands instantly in Windows <code className="text-orange-300">Downloads\</code> with automatic duplicate collision protection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STEALTH PROCESS HIDER & SEB MODE */}
        {activeGuideTab === "stealth" && (
          <div className="bg-[#111728] rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Stealth Task Manager Process Hider &amp; Safe Exam Browser (SEB) Mode
                </h3>
                <p className="text-sm text-slate-400">
                  Using 64-bit IAT and inline trampoline hooking on <code className="text-slate-300">NtQuerySystemInformation</code>, companion processes disappear completely from Windows Task Manager.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <span>1-Click Task Manager Process Hiding</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Run <code className="text-orange-300 font-mono">HIDE_FROM_TASK_MANAGER.bat</code>. It starts the lightweight background watcher <code className="text-slate-300 font-mono">TaskHiderWatcher.exe</code> which automatically hooks any newly opened instance of <code className="text-slate-300 font-mono">Taskmgr.exe</code>.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
                  <span>HIDE_FROM_TASK_MANAGER.bat</span>
                  <button
                    onClick={() => copyToClipboard("HIDE_FROM_TASK_MANAGER.bat", "bat2")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === "bat2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
                  <Lock className="w-5 h-5" />
                  <span>Safe Exam Browser (SEB) &amp; Proctored Exam Compatibility</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Because Bluetooth HID keystrokes are loaded via the kernel driver <code className="text-slate-300 font-mono">kbdhid.sys</code>, Windows assigns <code className="text-emerald-400 font-mono">LLKHF_INJECTED = 0</code>. Locked browser hooks cannot distinguish phone typing from a physical mechanical USB keyboard!
                </p>
                <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-300">
                  ✓ Safe Exam Browser (SEB) • ✓ Proctorio • ✓ Mercer Mettl • ✓ CoCubes • ✓ Lockdown Browser
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: DOWNLOAD CENTER & BINARIES */}
      <section id="downloads" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D121F] border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Download className="w-3.5 h-3.5" /> Download Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Download aMobile Packages &amp; Tools
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Get the ready-to-run APK for your phone or download the full Windows Companion bridge suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Android APK */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#131B30] to-slate-900/90 border border-orange-500/30 shadow-2xl relative overflow-hidden group hover:border-orange-500/60 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Smartphone className="w-32 h-32 text-orange-400" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-6 shadow-lg shadow-orange-950/50">
                  <Smartphone className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-extrabold text-white">aMobile Android APK</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-mono font-semibold border border-orange-500/30">
                    v2.4
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Self-contained Android package. Includes 104-key Bluetooth HID engine, interactive keyboard pad, multilingual text sender, and swipe file drop.
                </p>

                <div className="space-y-2 mb-8 text-xs text-slate-400 font-mono">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>File Name</span>
                    <span className="text-slate-200">amobile.apk</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>File Size</span>
                    <span className="text-emerald-400 font-bold">79.8 KB (Ultra-light)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>Target OS</span>
                    <span className="text-slate-200">Android 9.0 to 15+</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Root Required?</span>
                    <span className="text-emerald-400 font-bold">No (Rootless)</span>
                  </div>
                </div>

                <a
                  href="/amobile.apk"
                  download="amobile.apk"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-orange-950/50 transition-all active:scale-98"
                >
                  <Download className="w-5 h-5" />
                  <span>Download amobile.apk</span>
                </a>
              </div>
            </div>

            {/* Card 2: Windows Companion Suite */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#131B30] to-slate-900/90 border border-purple-500/30 shadow-2xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Laptop className="w-32 h-32 text-purple-400" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-950/50">
                  <Laptop className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-extrabold text-white">Windows Companion Suite</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-semibold border border-purple-500/30">
                    v2.4 Pack
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Complete Windows toolkit bundle containing USBTextReceiver, BridgeTaskManager, Stealth Process Hider DLL, ADB tunneling scripts, and 1-click batch runners.
                </p>

                <div className="space-y-2 mb-8 text-xs text-slate-400 font-mono">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>Archive Name</span>
                    <span className="text-slate-200">amobile-windows-bridge.zip</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>File Size</span>
                    <span className="text-emerald-400 font-bold">2.3 MB</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span>Target OS</span>
                    <span className="text-slate-200">Windows 10 / 11 (64-bit)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Included Tools</span>
                    <span className="text-slate-200">Receiver + Task Hider + Scripts</span>
                  </div>
                </div>

                <a
                  href="/amobile-windows-bridge.zip"
                  download="amobile-windows-bridge.zip"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-purple-500/50 shadow-xl transition-all active:scale-98"
                >
                  <FolderArchive className="w-5 h-5 text-purple-400" />
                  <span>Download Windows Suite (.ZIP)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-orange-400" /> Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need to Know About aMobile
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is any software required to run on the PC for Bluetooth mode?",
              a: "No! Mode 1 (Physical Bluetooth HID) requires absolutely zero companion software on your PC. Your Android phone uses the native Android BluetoothHidDevice API to emulate a 104-key standard Bluetooth keyboard. Windows automatically pairs with it and loads its built-in Microsoft kbdhid.sys driver.",
            },
            {
              q: "Does aMobile work in Safe Exam Browser (SEB) and locked exam environments?",
              a: "Yes. Because Windows treats the phone as a genuine physical hardware keyboard with zero software injection flags (LLKHF_INJECTED == 0), SEB, Proctorio, Mettl, and other proctored test browsers cannot detect or block the input.",
            },
            {
              q: "Where are files saved when sent via File Drop?",
              a: "All transferred files are streamed directly into your Windows Downloads folder (e.g. C:\\Users\\YourUser\\Downloads\\). The bridge automatically checks for filename conflicts and safely appends (1), (2) so existing files are never overwritten.",
            },
            {
              q: "How does the Task Manager Process Hider work?",
              a: "The hider utilizes 64-bit trampoline hooking and IAT injection on NtQuerySystemInformation within Taskmgr.exe. When Task Manager queries the operating system for active process names, our filter dynamically removes project binaries from the returned linked list, making them 100% invisible.",
            },
            {
              q: "Which Android versions and Windows versions are supported?",
              a: "aMobile supports Android 9.0 (Pie) through Android 15+. On the PC side, it is fully compatible with Windows 10 and Windows 11 (64-bit).",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-base font-semibold text-slate-100 hover:text-orange-400 transition-colors"
              >
                <span>{item.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-orange-400 shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 ml-4" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FOOTER CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-950/40 via-purple-950/40 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Turn Your Phone into a Hardware PC Bridge?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Install the 80 KB APK on your phone, pair via Bluetooth in 10 seconds, and enjoy low-latency hardware keyboard typing on your PC.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/amobile.apk"
              download="amobile.apk"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold text-base shadow-xl hover:scale-105 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Android App (.APK)</span>
            </a>
            <a
              href="/amobile-windows-bridge.zip"
              download="amobile-windows-bridge.zip"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <FolderArchive className="w-5 h-5 text-purple-400" />
              <span>Download Windows Suite (.ZIP)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
