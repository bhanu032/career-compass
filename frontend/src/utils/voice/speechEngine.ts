// Real-Time Speech Engine for Devanagari Hindi & Indic Multilingual Audio
// Uses Web Audio API to unlock browser audio policy, then speaks via SpeechSynthesis.

export interface VoicePersona {
  id: string;
  name: string;
  gender: string;
  age: string;
  lang: string;
  accent: string;
  tag: string;
  defaultEmotion: string;
  pitch: number;
  rate: number;
  avatar: string;
  description: string;
  customApiEndpoint?: string;
}

export const PRESET_PERSONAS: VoicePersona[] = [
  {
    id: 'david_devanagari_male',
    name: 'David — Male Hindi',
    gender: 'Male',
    age: 'Adult Native Speaker',
    lang: 'hi-IN',
    accent: 'Devanagari Hindi Male',
    tag: '👨 David Male Hindi',
    defaultEmotion: 'natural',
    pitch: 0.90,
    rate: 0.98,
    avatar: '👨',
    description: 'Trained Devanagari Hindi Male voice with deep pitch, native phoneme alignment and proper Hindi-English pronunciation.'
  },
  {
    id: 'aura_devanagari_female',
    name: 'Aura — Female Hindi',
    gender: 'Female',
    age: 'Adult Native Speaker',
    lang: 'hi-IN',
    accent: 'Devanagari Hindi Female',
    tag: '👩 Aura Female Hindi',
    defaultEmotion: 'natural',
    pitch: 1.15,
    rate: 1.0,
    avatar: '👩',
    description: 'Trained Devanagari Hindi Female voice with soft clear tone and proper Hindi-English dictionary pronunciation.'
  },
  {
    id: 'no_agent',
    name: 'No Voice (Text Only)',
    gender: 'None',
    age: 'N/A',
    lang: 'hi-IN',
    accent: 'Silent',
    tag: '🔇 No Voice',
    defaultEmotion: 'none',
    pitch: 1.0,
    rate: 1.0,
    avatar: '🔇',
    description: 'Disables all voice output. AI responses appear as text only. No browser speech synthesis is used.'
  },
  {
    id: 'custom_devanagari_api',
    name: 'Custom Trained Voice API',
    gender: 'Custom Neural',
    age: 'Universal',
    lang: 'hi-IN',
    accent: 'Custom Trained Weights Endpoint',
    tag: '⚡ Custom API',
    defaultEmotion: 'natural',
    pitch: 1.0,
    rate: 1.0,
    avatar: '⚡',
    description: 'Connect your custom trained Devanagari Hindi TTS backend (ElevenLabs, Coqui, VITS, Bark, etc.).'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE HINDI-ENGLISH PRONUNCIATION DICTIONARY
// Maps common English/tech/Hinglish words to their proper Devanagari equivalents
// so SpeechSynthesis reads them correctly in Hindi context.
// ─────────────────────────────────────────────────────────────────────────────
export const HINDI_ENGLISH_DICT: Record<string, string> = {
  // Technology
  ai: 'एआई',
  api: 'एपीआई',
  url: 'यूआरएल',
  html: 'एचटीएमएल',
  css: 'सीएसएस',
  js: 'जेएस',
  ui: 'यूआई',
  ux: 'यूएक्स',
  seo: 'एसईओ',
  cpu: 'सीपीयू',
  gpu: 'जीपीयू',
  ram: 'रैम',
  rom: 'रोम',
  usb: 'यूएसबी',
  lan: 'लैन',
  wan: 'वैन',
  vpn: 'वीपीएन',
  sms: 'एसएमएस',
  otp: 'ओटीपी',
  pin: 'पिन',
  id: 'आईडी',
  pdf: 'पीडीएफ',
  jpg: 'जेपीजी',
  png: 'पीएनजी',
  mp3: 'एमपी3',
  mp4: 'एमपी4',

  // AI & Tech companies
  chatgpt: 'चैटजीपीटी',
  gpt: 'जीपीटी',
  gemini: 'जेमिनी',
  google: 'गूगल',
  openai: 'ओपनएआई',
  microsoft: 'माइक्रोसॉफ्ट',
  amazon: 'अमेज़न',
  apple: 'एप्पल',
  samsung: 'सैमसंग',
  facebook: 'फेसबुक',
  instagram: 'इंस्टाग्राम',
  youtube: 'यूट्यूब',
  twitter: 'ट्विटर',
  whatsapp: 'व्हाट्सएप',
  linkedin: 'लिंक्डइन',

  // Programming languages & tools
  python: 'पायथन',
  javascript: 'जावास्क्रिप्ट',
  java: 'जावा',
  react: 'रिएक्ट',
  nodejs: 'नोड जेएस',
  github: 'गिटहब',
  git: 'गिट',
  docker: 'डॉकर',
  linux: 'लिनक्स',
  ubuntu: 'उबुंटू',

  // Devices & platforms
  app: 'ऐप',
  apps: 'ऐप्स',
  android: 'एंड्रॉइड',
  ios: 'आईओएस',
  windows: 'विंडोज',
  laptop: 'लैपटॉप',
  mobile: 'मोबाइल',
  phone: 'फ़ोन',
  tablet: 'टैबलेट',
  smartwatch: 'स्मार्टवॉच',

  // General tech
  developer: 'डेवलपर',
  software: 'सॉफ्टवेयर',
  hardware: 'हार्डवेयर',
  database: 'डेटाबेस',
  cloud: 'क्लाउड',
  server: 'सर्वर',
  website: 'वेबसाइट',
  wifi: 'वाईफ़ाई',
  bluetooth: 'ब्लूटूथ',
  online: 'ऑनलाइन',
  offline: 'ऑफ़लाइन',
  download: 'डाउनलोड',
  upload: 'अपलोड',
  update: 'अपडेट',
  install: 'इंस्टॉल',
  login: 'लॉगिन',
  logout: 'लॉगआउट',
  signup: 'साइनअप',
  password: 'पासवर्ड',
  email: 'ईमेल',
  link: 'लिंक',
  search: 'सर्च',
  audio: 'ऑडियो',
  video: 'वीडियो',
  file: 'फ़ाइल',
  data: 'डेटा',
  internet: 'इंटरनेट',
  network: 'नेटवर्क',
  browser: 'ब्राउज़र',
  scanner: 'स्कैनर',
  printer: 'प्रिंटर',
  keyboard: 'कीबोर्ड',
  mouse: 'माउस',
  monitor: 'मॉनिटर',
  charger: 'चार्जर',
  battery: 'बैटरी',
  screen: 'स्क्रीन',
  camera: 'कैमरा',
  speaker: 'स्पीकर',
  headphone: 'हेडफ़ोन',
  microphone: 'माइक्रोफ़ोन',

  // Government & exam
  exam: 'परीक्षा',
  job: 'नौकरी',
  jobs: 'नौकरियां',
  admitcard: 'एडमिट कार्ड',
  result: 'रिजल्ट',
  syllabus: 'सिलेबस',
  form: 'फ़ॉर्म',
  fee: 'शुल्क',
  merit: 'मेरिट',
  rank: 'रैंक',
  interview: 'इंटरव्यू',
  vacancy: 'वेकेंसी',
  post: 'पद',
  department: 'विभाग',
  ministry: 'मंत्रालय',
  board: 'बोर्ड',
  commission: 'आयोग',
  notification: 'अधिसूचना',
  admit: 'एडमिट',
  hall: 'हॉल',
  center: 'केंद्र',
  district: 'जिला',
  state: 'राज्य',
  central: 'केंद्रीय',
  officer: 'अधिकारी',
  clerk: 'क्लर्क',
  inspector: 'निरीक्षक',
  constable: 'कांस्टेबल',
  teacher: 'शिक्षक',
  professor: 'प्रोफेसर',
  engineer: 'इंजीनियर',
  doctor: 'डॉक्टर',
  manager: 'प्रबंधक',

  // Finance
  bank: 'बैंक',
  loan: 'लोन',
  emi: 'ईएमआई',
  upi: 'यूपीआई',
  payment: 'पेमेंट',
  transfer: 'ट्रांसफर',
  account: 'अकाउंट',
  balance: 'बैलेंस',
  tax: 'टैक्स',
  gst: 'जीएसटी',
  pan: 'पैन',
  ifsc: 'आईएफएससी',

  // Education
  class: 'कक्षा',
  course: 'कोर्स',
  degree: 'डिग्री',
  college: 'कॉलेज',
  university: 'विश्वविद्यालय',
  school: 'स्कूल',
  coaching: 'कोचिंग',
  tuition: 'ट्यूशन',
  scholarship: 'छात्रवृत्ति',
  certificate: 'सर्टिफिकेट',
  diploma: 'डिप्लोमा',

  // Career
  resume: 'रेज्यूमे',
  cv: 'सीवी',
  career: 'करियर',
  skill: 'कौशल',
  skills: 'कौशल',
  training: 'प्रशिक्षण',
  experience: 'अनुभव',
  salary: 'वेतन',
  package: 'पैकेज',
  company: 'कंपनी',
  office: 'ऑफिस',
  hr: 'एचआर',
  team: 'टीम',

  // Common Hinglish / mixed words
  ok: 'ठीक है',
  okay: 'ठीक है',
  yes: 'हाँ',
  no: 'नहीं',
  hello: 'हेलो',
  hi: 'हाय',
  bye: 'बाय',
  thanks: 'धन्यवाद',
  sorry: 'माफ़ करें',
  please: 'कृपया',
  'thank you': 'धन्यवाद',
  compass: 'कम्पास',
};

// ─────────────────────────────────────────────────────────────────────────────
// Text normalizer: converts English tech words → Hindi Devanagari equivalents
// before passing to SpeechSynthesis so Hindi voice engine reads them correctly.
// ─────────────────────────────────────────────────────────────────────────────
export function normalizeHindiText(text: string): string {
  if (!text) return '';
  let clean = text;

  // Currency symbols
  clean = clean.replace(/₹\s*(\d[\d,]*)/g, '$1 रुपये');
  clean = clean.replace(/\$\s*(\d[\d,]*)/g, '$1 डॉलर');
  clean = clean.replace(/€\s*(\d[\d,]*)/g, '$1 यूरो');

  // Percentages
  clean = clean.replace(/(\d+)\s*%/g, '$1 प्रतिशत');

  // Numbers with common suffixes
  clean = clean.replace(/(\d+)\s*km\b/gi, '$1 किलोमीटर');
  clean = clean.replace(/(\d+)\s*kg\b/gi, '$1 किलोग्राम');
  clean = clean.replace(/(\d+)\s*mg\b/gi, '$1 मिलीग्राम');
  clean = clean.replace(/(\d+)\s*cm\b/gi, '$1 सेंटीमीटर');
  clean = clean.replace(/(\d+)\s*mm\b/gi, '$1 मिलीमीटर');
  clean = clean.replace(/(\d+)\s*hr\b/gi, '$1 घंटे');
  clean = clean.replace(/(\d+)\s*min\b/gi, '$1 मिनट');
  clean = clean.replace(/(\d+)\s*sec\b/gi, '$1 सेकंड');
  clean = clean.replace(/(\d+)\s*yrs?\b/gi, '$1 वर्ष');

  // Multi-word phrases first (longest match first)
  const multiWord = Object.entries(HINDI_ENGLISH_DICT)
    .filter(([k]) => k.includes(' '))
    .sort((a, b) => b[0].length - a[0].length);
  for (const [eng, hin] of multiWord) {
    const reg = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    clean = clean.replace(reg, hin);
  }

  // Single word replacements
  for (const [eng, hin] of Object.entries(HINDI_ENGLISH_DICT)) {
    if (eng.includes(' ')) continue;
    const reg = new RegExp(`\\b${eng}\\b`, 'gi');
    clean = clean.replace(reg, hin);
  }

  // Strip markdown symbols that would be read aloud awkwardly
  clean = clean.replace(/[*_#`~>|]/g, ' ');
  clean = clean.replace(/\s{2,}/g, ' ').trim();

  return clean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SpeechEngine — main class
// ─────────────────────────────────────────────────────────────────────────────
export class SpeechEngine {
  public speaking: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private wordTimer: ReturnType<typeof setInterval> | null = null;
  private audioCtx: AudioContext | null = null;
  private _voicesCached: SpeechSynthesisVoice[] = [];

  /**
   * Call ONCE during a user gesture (button click) to permanently unlock
   * Chrome/Edge's audio autoplay policy for the session.
   */
  public unlockAudio(): void {
    if (typeof window === 'undefined') return;

    // Resume SpeechSynthesis if suspended
    try {
      if (window.speechSynthesis) {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        // Cache voices now while in gesture context
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) this._voicesCached = v;
      }
    } catch { /* ignore */ }

    // Create + play a 0-sample silent AudioContext buffer to unlock Web Audio API
    if (this.audioCtx) return;
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      const buffer = this.audioCtx.createBuffer(1, 1, 22050);
      const src = this.audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(this.audioCtx.destination);
      src.start(0);
    } catch { /* ignore */ }
  }

  /** Returns all available browser voices (may be empty on first call). */
  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) this._voicesCached = v;
    return this._voicesCached;
  }

  /**
   * Pick the best voice for the requested gender.
   *
   * Male priority:
   *   1. Hindi male-named voice (Hemant, Ravi, Madhav…)
   *   2. Google Hindi (neutral — we apply very low pitch)
   *   3. Any Hindi voice
   *   4. en-IN male (Hemanth-like)
   *   5. English male (David, George, Mark, James) — reliable deep voice
   *   6. voices[0]
   *
   * Female priority:
   *   1. Hindi female-named voice (Swara, Kalpana, Heera, Lekha…)
   *   2. Google Hindi
   *   3. Any Hindi voice
   *   4. en-IN female
   *   5. English female (Zira, Hazel, Aria, Eva)
   *   6. voices[0]
   */
  private _pickVoice(gender: 'Male' | 'Female' | 'None'): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    if (!voices.length) return undefined;

    if (gender === 'Male') {
      // 1. Hindi + explicitly male name
      const hindiMale = voices.find(v =>
        v.lang.startsWith('hi') && /hemant|ravi|madhav|male/i.test(v.name)
      );
      if (hindiMale) return hindiMale;

      // 2. Google Hindi (we'll apply very low pitch externally)
      const googleHindi = voices.find(v => /google.*hindi|google.*hi/i.test(v.name));
      if (googleHindi) return googleHindi;

      // 3. Any Hindi
      const anyHindi = voices.find(v => v.lang.startsWith('hi'));
      if (anyHindi) return anyHindi;

      // 4. en-IN male
      const enInMale = voices.find(v => v.lang === 'en-IN' && /male|hemant|ravi/i.test(v.name));
      if (enInMale) return enInMale;

      // 5. English male — guaranteed deep voice fallback
      const engMale = voices.find(v =>
        v.lang.startsWith('en') && /\bdavid\b|\bgeorge\b|\bmark\b|\bjames\b|\briku\b/i.test(v.name)
      );
      if (engMale) return engMale;

      // 6. Any English
      return voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    // ── FEMALE ──────────────────────────────────────────────────────────
    // 1. Hindi + explicitly female name
    const hindiFemale = voices.find(v =>
      v.lang.startsWith('hi') && /swara|kalpana|heera|lekha|female/i.test(v.name)
    );
    if (hindiFemale) return hindiFemale;

    // 2. Google Hindi
    const googleHindi = voices.find(v => /google.*hindi|google.*hi/i.test(v.name));
    if (googleHindi) return googleHindi;

    // 3. Any Hindi
    const anyHindi = voices.find(v => v.lang.startsWith('hi'));
    if (anyHindi) return anyHindi;

    // 4. en-IN female
    const enInFemale = voices.find(v => v.lang === 'en-IN' && /female|swara|kalpana/i.test(v.name));
    if (enInFemale) return enInFemale;

    // 5. English female
    const engFemale = voices.find(v =>
      v.lang.startsWith('en') && /\bzira\b|\bharzel\b|\baria\b|\beva\b|\bhazel\b|\bsamantha\b|\bcortana\b/i.test(v.name)
    );
    if (engFemale) return engFemale;

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  public speakScript({
    text,
    persona = PRESET_PERSONAS[0],
    pitch = 1.0,
    rate = 1.0,
    customEndpoint,
    onBoundary,
    onEnd,
    onError
  }: {
    text: string;
    persona?: VoicePersona;
    pitch?: number;
    rate?: number;
    customEndpoint?: string;
    onBoundary?: (word: string) => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }): void {
    this.stop();

    // ── NO VOICE MODE ──────────────────────────────────────────────────────
    if (persona.id === 'no_agent' || persona.gender === 'None') {
      if (onEnd) onEnd();
      return;
    }

    const normalized = normalizeHindiText(text.trim());
    if (!normalized) {
      if (onEnd) onEnd();
      return;
    }

    this.speaking = true;
    const words = normalized.split(/\s+/);

    // Resume AudioContext if suspended
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    const endpoint = customEndpoint || persona.customApiEndpoint;
    const gender = persona.gender as 'Male' | 'Female' | 'None';

    // ── PATH 1: Custom endpoint (if explicitly set) ───────────────────────
    if (endpoint && persona.id === 'custom_devanagari_api') {
      const url = `${endpoint}?text=${encodeURIComponent(normalized)}&gender=${gender.toLowerCase()}&pitch=${pitch}&rate=${rate}`;
      this._playAudio(url, words, rate, persona, onBoundary, onEnd, onError);
      return;
    }

    // ── PATH 2: Trained Hindi TTS backend (localhost:8000) ────────────────
    // Calls facebook/mms-tts-hin for Male, microsoft/speecht5_tts for Female
    const BACKEND = 'http://localhost:8000';
    const speakerId = gender === 'Male' ? 'devanagari_male_vits' : 'devanagari_female_vits';
    const isMale = gender === 'Male';

    const backendUrl = `${BACKEND}/api/tts/generate`;
    const body = JSON.stringify({
      text: normalized,
      speaker_id: speakerId,
      language: 'hi',
      pitch: pitch,
      speed: isMale ? (rate * 0.95) : (rate * 1.05),
      amplification: 1.0,
    });

    const tryBackend = (): Promise<boolean> => {
      return new Promise((resolve) => {
        fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: AbortSignal.timeout(5000),
        })
          .then(async (res) => {
            if (!res.ok) { resolve(false); return; }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            this._playAudio(url, words, rate, persona,
              onBoundary,
              () => { URL.revokeObjectURL(url); if (onEnd) onEnd(); },
              () => { URL.revokeObjectURL(url); resolve(false); }
            );
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    };

    tryBackend().then((ok) => {
      if (!ok) {
        // ── PATH 3: Browser SpeechSynthesis fallback ──────────────────────
        this._browserSpeak(normalized, gender, isMale, words, pitch, rate, persona, onBoundary, onEnd, onError);
      }
    });
  }

  private _browserSpeak(
    normalized: string,
    gender: 'Male' | 'Female' | 'None',
    isMale: boolean,
    words: string[],
    pitch: number,
    rate: number,
    persona: VoicePersona,
    onBoundary?: (w: string) => void,
    onEnd?: () => void,
    onError?: (e: unknown) => void
  ): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    if (window.speechSynthesis.paused) window.speechSynthesis.resume();

    const attemptSpeak = () => {
      const voice = this._pickVoice(gender);
      const utter = new SpeechSynthesisUtterance(normalized);
      if (voice) utter.voice = voice;
      utter.lang = voice?.lang || persona.lang || 'hi-IN';
      utter.pitch = isMale ? 0.1 : 1.8;
      utter.rate = isMale
        ? Math.max(0.75, Math.min(1.1, (persona.rate || 0.92) * rate))
        : Math.max(0.85, Math.min(1.3, (persona.rate || 1.05) * rate));
      utter.volume = 1.0;

      let wordIdx = 0;
      utter.onboundary = (evt) => {
        if (evt.name === 'word' && onBoundary) {
          const w = normalized.substring(evt.charIndex, evt.charIndex + (evt.charLength || 8)).trim();
          if (w) onBoundary(w);
        }
      };
      utter.onstart = () => {
        this.speaking = true;
        this.wordTimer = setInterval(() => {
          if (wordIdx < words.length) { if (onBoundary) onBoundary(words[wordIdx++]); }
          else { if (this.wordTimer) clearInterval(this.wordTimer); }
        }, Math.max(100, Math.round(260 / (utter.rate || 1))));
      };
      utter.onend = () => {
        this.speaking = false;
        if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
        if (onBoundary) onBoundary('');
        if (onEnd) onEnd();
      };
      utter.onerror = (e) => {
        this.speaking = false;
        if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
        if (onBoundary) onBoundary('');
        if (onError) onError(e);
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utter);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this._voicesCached = voices;
      attemptSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        this._voicesCached = window.speechSynthesis.getVoices();
        attemptSpeak();
      };
      setTimeout(() => { if (!this.speaking) attemptSpeak(); }, 800);
    }
  }

  // Old speakScript PATH 2 block replaced by _browserSpeak above
  private _unusedSpeakScript_placeholder = null;


  private _playAudio(
    url: string,
    words: string[],
    rate: number,
    persona: VoicePersona,
    onBoundary?: (w: string) => void,
    onEnd?: () => void,
    onError?: (e: unknown) => void
  ): void {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = url;
    audio.playbackRate = Math.max(0.8, Math.min(1.5, rate * (persona.rate || 1)));
    this.currentAudio = audio;

    let wordIdx = 0;

    audio.onplay = () => {
      const dur = (audio.duration && !isNaN(audio.duration)) ? audio.duration * 1000 : words.length * 300;
      const msPerWord = Math.max(100, Math.round(dur / words.length));
      this.wordTimer = setInterval(() => {
        if (wordIdx < words.length) {
          if (onBoundary) onBoundary(words[wordIdx++]);
        } else {
          if (this.wordTimer) clearInterval(this.wordTimer);
        }
      }, msPerWord);
    };

    audio.onended = () => {
      this.speaking = false;
      if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
      if (onBoundary) onBoundary('');
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      this.speaking = false;
      if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
      if (onBoundary) onBoundary('');
      if (onEnd) onEnd();
    };

    audio.play().catch((err) => {
      this.speaking = false;
      if (onError) onError(err);
      if (onEnd) onEnd();
    });
  }

  public stop(): void {
    if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch { /* ignore */ }
    this.speaking = false;
  }
}

export const speechEngine = new SpeechEngine();
