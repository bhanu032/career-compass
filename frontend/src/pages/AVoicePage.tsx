import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  RefreshCw,
  Square,
  Activity,
  Zap,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { David3DAvatar } from "@/components/David3DAvatar";
import { callGeminiLiveConversation } from "@/services/geminiVoiceClient";
import {
  speechEngine,
  PRESET_PERSONAS,
  type VoicePersona,
} from "@/utils/voice/speechEngine";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export function AVoicePage(): JSX.Element {
  useDocumentTitle("David 3D — Live Voice AI Companion & Gemini Conversation");

  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(PRESET_PERSONAS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "नमस्ते! मैं David हूँ, आपका 3D एआई साथी। आप माइक दबाकर मुझसे सरकारी भर्ती, करियर सलाह, या कोई भी प्रश्न पूछ सकते हैं। मैं सुनकर तुरंत उत्तर बोलूँगा।",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingWord, setSpeakingWord] = useState("");
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechRate, setSpeechRate] = useState(1.05);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const autoListenRef = useRef(false);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isThinking]);

  // Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "hi-IN";

      rec.onstart = () => {
        setIsListening(true);
        setInterimText("");
      };

      rec.onresult = (event: any) => {
        let currentInterim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        const currentSaid = (finalTranscript || currentInterim).trim();
        setInterimText(currentSaid);

        if (finalTranscript.trim().length > 1) {
          rec.stop();
          handleSendMessage(finalTranscript.trim());
          setInterimText("");
        }
      };

      rec.onerror = (e: any) => {
        if (e.error !== "no-speech") {
          setIsListening(false);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedPersona]);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      autoListenRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        speechEngine.stop();
        setIsSpeaking(false);
        autoListenRef.current = true;
        recognitionRef.current.start();
      } catch (err) {
        alert("Microphone permission is required for live voice conversation. Please allow mic access in browser settings.");
      }
    }
  };

  // Gemini API Key State
  const [geminiApiKey] = useState<string>(
    () => localStorage.getItem("gemini_api_key") || ""
  );

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputText("");
    setIsThinking(true);

    try {
      const geminiReply = await callGeminiLiveConversation(
        nextHistory.map((m) => ({ role: m.role, text: m.text })),
        geminiApiKey
      );

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: geminiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      speakText(geminiReply);
    } catch (err) {
      console.error("Gemini conversation error:", err);
      setIsThinking(false);
    }
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    speechEngine.speakScript({
      text,
      persona: selectedPersona,
      pitch: speechPitch,
      rate: speechRate,
      onBoundary: (word) => setSpeakingWord(word),
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingWord("");
        if (autoListenRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // Already active
          }
        }
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeakingWord("");
      },
    });
  };

  const stopSpeaking = () => {
    autoListenRef.current = false;
    speechEngine.stop();
    setIsSpeaking(false);
    setSpeakingWord("");
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-3.5 w-3.5" /> 3D AI Voice Companion
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <Activity className="h-3 w-3" /> Live 3D WebGL Avatar
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                <Zap className="h-3 w-3" /> Google Gemini AI
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              David 3D — <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">Live Voice AI</span>
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
              Real-time duplex voice conversation with David 3D avatar powered by Google Gemini AI, hands-free speech recognition, and lip-sync audio synthesis.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleListening}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                isListening
                  ? "bg-rose-600 animate-pulse ring-4 ring-rose-500/40"
                  : "bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500"
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span>{isListening ? "Stop Voice Chat" : "Start Live Voice Chat"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN WORKSPACE: INFO LEFT | CHAT MIDDLE | DAVID RIGHT ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Info & Controls */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="card border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-bold text-white text-sm">Assistant Info</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              David is your 3D Gemini AI Companion. Ask about Government Jobs, Exam Preparation, or Resume Building in natural Hindi or English.
            </p>

            {/* Persona Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voice Persona</span>
              <div className="flex flex-col gap-2">
                {PRESET_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                      selectedPersona.id === p.id
                        ? "bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{p.avatar}</span>
                      <span className="text-slate-200">{p.name.split("(")[0]}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{p.gender}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch & Rate Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Pitch</span>
                  <span className="text-cyan-400">{speechPitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Speed</span>
                  <span className="text-violet-400">{speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Live Conversational Chat Window */}
        <div className="lg:col-span-5 flex flex-col card p-6 bg-slate-900/90 border-slate-800 h-[580px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-100 text-sm">Live Voice AI Conversation</span>
            </div>
            <div className="flex gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-rose-400 hover:text-rose-300"
                >
                  <Square className="h-3 w-3 fill-current" /> Stop Audio
                </button>
              )}
              <button
                onClick={() => setMessages([messages[0]])}
                className="btn-ghost text-xs py-1 px-2 text-slate-400 hover:text-slate-200"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-cyan-400 flex items-center gap-1 font-semibold"
                      >
                        <Volume2 className="h-3 w-3" /> Speak
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {interimText && (
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] rounded-2xl p-3 text-sm bg-violet-950/40 text-violet-300 border border-violet-700/50 italic animate-pulse">
                  "{interimText}"
                </div>
              </div>
            )}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 italic p-2">
                <Sparkles className="h-4 w-4 animate-spin" /> Gemini AI processing response...
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Form & Mic Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center shrink-0 ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40"
                  : "bg-gradient-to-r from-cyan-600 to-violet-600 text-white hover:from-cyan-500 hover:to-violet-500"
              }`}
              title={isListening ? "Stop Listening" : "Start Speaking Hindi"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <input
              type="text"
              placeholder="Type your question or click mic to speak..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isThinking}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: 3D David Avatar Viewport */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="card overflow-hidden border-cyan-500/30 bg-slate-950 p-4 relative flex flex-col items-center h-[580px] justify-center">
            <David3DAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={isThinking}
              speakingWord={speakingWord}
              className="h-[520px] w-full"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Activity className="h-3.5 w-3.5" /> David 3D Avatar
              </span>
              <span className="text-[10px] text-slate-400">Face to Knee · Rested Arms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
