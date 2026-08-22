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

  const [avatarGender, setAvatarGender] = useState<"male" | "female">("male");
  const [armPose, setArmPose] = useState<"elbows_front" | "behind_back" | "front_stomach" | "default_gltf" | "facing_shoes" | "joined_palms" | "front_pockets" | "front_face" | "natural_sides">("elbows_front");
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
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [autoSpeakResponse, setAutoSpeakResponse] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const autoListenRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenRef = useRef<string>("");
  const handleSendMessageRef = useRef<(text?: string) => Promise<void>>(() => Promise.resolve());

  // Auto scroll ONLY internal chat box (never scroll main window)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, interimText, isThinking]);

  // Web Speech Recognition Initialization
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
        lastSpokenRef.current = "";
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
        if (currentSaid) {
          setInterimText(currentSaid);
          lastSpokenRef.current = currentSaid;

          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Auto-submit after 1.1 seconds of silence when user stops talking
          silenceTimerRef.current = setTimeout(() => {
            const textToSubmit = lastSpokenRef.current.trim();
            if (textToSubmit && !isThinking) {
              try {
                rec.stop();
              } catch {
                // Ignore
              }
              setIsListening(false);
              setInterimText("");
              lastSpokenRef.current = "";
              if (handleSendMessageRef.current) {
                handleSendMessageRef.current(textToSubmit);
              }
            }
          }, 1100);
        }

        if (finalTranscript.trim().length > 1) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          const finalVal = finalTranscript.trim();
          try {
            rec.stop();
          } catch {
            // Ignore
          }
          setIsListening(false);
          setInterimText("");
          lastSpokenRef.current = "";
          if (handleSendMessageRef.current) {
            handleSendMessageRef.current(finalVal);
          }
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

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      autoListenRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
    } else {
      // ── Unlock browser audio policy on this user gesture ──────────────
      speechEngine.unlockAudio();
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        speechEngine.stop();
        setIsSpeaking(false);
        autoListenRef.current = true;
        setInterimText("");
        lastSpokenRef.current = "";
        try {
          recognitionRef.current.start();
        } catch {
          // Ignore
        }
      } catch (err) {
        alert("Microphone permission is required for live voice conversation. Please allow mic access in browser settings.");
      }
    }
  };


  // Gemini API Key State
  const [geminiApiKey] = useState<string>(
    () => localStorage.getItem("gemini_api_key") || ""
  );

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentHistory = [...messagesRef.current, userMsg];
    setMessages(currentHistory);
    setInputText("");
    setIsThinking(true);

    try {
      const geminiReply = await callGeminiLiveConversation(
        currentHistory.map((m) => ({ role: m.role, text: m.text })),
        geminiApiKey,
        avatarGender
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

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  const speakText = (text: string) => {
    // Ensure audio is unlocked before speaking
    speechEngine.unlockAudio();
    setIsSpeaking(true);
    speechEngine.speakScript({
      text,
      persona: selectedPersona,
      pitch: speechPitch,
      rate: speechRate,
      customEndpoint: customEndpoint.trim() || undefined,
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
    <div className="h-[calc(100vh-4.2rem)] flex flex-col gap-3 p-3 overflow-hidden bg-slate-950 text-slate-100">
      {/* ── TOP COMPACT HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>{avatarGender === "female" ? "👩 Aura 3D" : "👨 David 3D"}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">Live Voice AI Companion</span>
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> Devanagari Trained v2
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Agent Mode Switcher: Male / Female / No Voice */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                speechEngine.unlockAudio();
                setAvatarGender("male");
                setSelectedPersona(PRESET_PERSONAS[0]);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                avatarGender === "male" && selectedPersona.id !== "no_agent"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👨 Male
            </button>
            <button
              type="button"
              onClick={() => {
                speechEngine.unlockAudio();
                setAvatarGender("female");
                setSelectedPersona(PRESET_PERSONAS[1]);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                avatarGender === "female" && selectedPersona.id !== "no_agent"
                  ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👩 Female
            </button>
            <button
              type="button"
              onClick={() => {
                speechEngine.stop();
                setSelectedPersona(PRESET_PERSONAS[2]);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPersona.id === "no_agent"
                  ? "bg-slate-800 text-slate-300 border border-slate-600"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              🔇 No Voice
            </button>
          </div>

          <button
            type="button"
            onClick={toggleListening}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-md ${
              isListening
                ? "bg-rose-600 animate-pulse ring-2 ring-rose-500/40"
                : "bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500"
            }`}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            <span>{isListening ? "Stop Voice Chat" : "Live Voice Chat"}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN WORKSPACE: INFO LEFT | CHAT MIDDLE | AVATAR RIGHT ───── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: Info & Voice Models */}
        <div className="lg:col-span-3 h-full flex flex-col gap-2.5 overflow-y-auto pr-1">
          {/* Active 3D Hand Pose Card */}
          <div className="p-3 rounded-2xl border border-cyan-500/30 bg-slate-900/90 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>3D Hand Pose</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
            </div>
            <div className="p-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/70 to-slate-900/90 text-cyan-300 text-xs font-bold flex items-center gap-2">
              <span className="text-base">💪</span>
              <div>
                <div className="text-slate-100 font-bold text-[12px]">Elbows In Front</div>
                <div className="text-[10px] text-cyan-400/90 font-mono">Original GLTF + Forward Elbow Bend</div>
              </div>
            </div>
          </div>

          {/* Hindi Voice Models */}
          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hindi Voice Models</span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">Devanagari</span>
            </div>
            <div className="flex flex-col gap-2">
              {PRESET_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (p.gender === 'Male') { speechEngine.unlockAudio(); setAvatarGender('male'); }
                    else if (p.gender === 'Female') { speechEngine.unlockAudio(); setAvatarGender('female'); }
                    else if (p.id === 'no_agent') { speechEngine.stop(); }
                    setSelectedPersona(p);
                  }}
                  className={`flex flex-col p-2.5 rounded-xl border transition-all text-xs text-left ${
                    selectedPersona.id === p.id
                      ? p.id === 'no_agent'
                        ? "bg-slate-800 border-slate-600 text-slate-200 font-bold"
                        : "bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold shadow-md shadow-cyan-950/40"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-slate-100 text-[12px]">
                      <span>{p.avatar}</span>
                      <span>{p.name}</span>
                    </span>
                    {selectedPersona.id === p.id && (
                      <span className={`h-2 w-2 rounded-full animate-pulse ${p.id === 'no_agent' ? 'bg-slate-400' : 'bg-cyan-400'}`} />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal leading-relaxed">{p.description}</p>
                </button>
              ))}
            </div>

            {/* Custom Endpoint Input — shown only for custom_devanagari_api persona */}
            {selectedPersona.id === 'custom_devanagari_api' && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1.5 mt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                  <span>⚡ Trained Voice API Endpoint</span>
                </div>
                <input
                  type="text"
                  placeholder="http://localhost:5000/api/tts..."
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full text-[11px] font-mono bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>


          {/* Auto-Speak Toggle */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-100">Auto-Speak Response</div>
                <div className="text-[10px] text-slate-400">Speaks AI reply automatically</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoSpeakResponse(!autoSpeakResponse)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                autoSpeakResponse ? "bg-cyan-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoSpeakResponse ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Middle Column: Chat Window */}
        <div className="lg:col-span-5 h-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl p-3 min-h-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-100 text-xs">Live Voice AI Conversation</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Duplex Real-Time</span>
          </div>

          {/* Prompt Suggestions */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar border-b border-slate-800/80 shrink-0">
            <span className="text-slate-500 font-semibold shrink-0">सुझाव:</span>
            {[
              "सरकारी नौकरी की तैयारी कैसे करें?",
              "SSC CGL परीक्षा पैटर्न बताओ",
              "रिज्यूम में क्या लिखना चाहिए?",
              "UPSC परीक्षा की रणनीति"
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-lg bg-slate-800/80 hover:bg-cyan-950/60 border border-slate-700/60 hover:border-cyan-500/50 px-2 py-0.5 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-3 text-[9px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-cyan-400 flex items-center gap-1 font-semibold text-slate-300"
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
                <div className="max-w-[85%] rounded-2xl p-2.5 text-xs bg-violet-950/40 text-violet-300 border border-violet-700/50 italic animate-pulse">
                  "{interimText}"
                </div>
              </div>
            )}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 italic p-2">
                <Sparkles className="h-3.5 w-3.5 animate-spin" /> Gemini AI processing response...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center shrink-0 ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-2 ring-rose-500/40"
                  : "bg-gradient-to-r from-cyan-600 to-violet-600 text-white hover:from-cyan-500 hover:to-violet-500"
              }`}
              title={isListening ? "Stop Listening" : "Start Speaking Hindi"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              placeholder="Type your question or click mic..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isThinking}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: 3D Avatar WebGL Canvas */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <div className="card overflow-hidden border-cyan-500/30 bg-slate-950 p-1.5 relative flex flex-col items-center h-full w-full justify-center rounded-2xl">
            {/* Live Audio Visualizer Overlay */}
            {(isSpeaking || isListening) && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 z-20 shadow-lg">
                <div className="flex items-center gap-1 h-3.5">
                  {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30].map((h, idx) => (
                    <span
                      key={idx}
                      className={`w-0.5 rounded-full ${isListening ? "bg-rose-500" : "bg-cyan-400"} animate-pulse`}
                      style={{
                        height: `${h}%`,
                        animationDuration: `${0.35 + (idx % 4) * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="ml-2 text-[11px] font-bold text-slate-200 truncate">
                  {isListening ? "Listening to your voice..." : `Speaking: "${speakingWord || 'AI response'}"`}
                </span>
              </div>
            )}

            <David3DAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={isThinking}
              speakingWord={speakingWord}
              gender={avatarGender}
              armPose={armPose}
              className="h-full w-full"
            />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/85 border border-slate-800 text-xs backdrop-blur-md z-20">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                <Activity className="h-3 w-3" />
                {avatarGender === "female" ? "Aura 3D Avatar" : "David 3D Avatar"}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                💪 Elbows In Front
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
