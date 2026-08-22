// Real-Time Speech Engine for Devanagari Hindi & Indic Multilingual Audio
// Provides browser speech synthesis with Devanagari normalizer, word boundary events, and acoustic fallback.

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
}

export const PRESET_PERSONAS: VoicePersona[] = [
  {
    id: 'devanagari_female',
    name: 'Devanagari Sweet (Female)',
    gender: 'Female',
    age: 'Adult Native Speaker',
    lang: 'hi-IN',
    accent: 'Sweet Devanagari Hindi',
    tag: '⭐ Devanagari Sweet Voice (Female)',
    defaultEmotion: 'natural',
    pitch: 1.15,
    rate: 1.0,
    avatar: '👩',
    description: 'Gentle, natural and authentic native Devanagari Hindi female voice.'
  },
  {
    id: 'david_3d_avatar',
    name: 'David 3D Avatar (Male)',
    gender: 'Male',
    age: 'Adult Native Speaker',
    lang: 'hi-IN',
    accent: 'Native Devanagari & Indian English',
    tag: '⭐ 3D David Avatar (Studio Voice)',
    defaultEmotion: 'natural',
    pitch: 0.95,
    rate: 1.05,
    avatar: '👨',
    description: 'Interactive 3D David Avatar with studio-grade Indian voice and real-time lip sync.'
  },
  {
    id: 'indic_multilingual',
    name: 'AI4Bharat IndicVoices Multi',
    gender: 'Multilingual',
    age: 'Universal',
    lang: 'hi-IN',
    accent: '22 Indian Languages Dataset',
    tag: '🇮🇳 AI4Bharat IndicVoices 22 Languages',
    defaultEmotion: 'natural',
    pitch: 1.0,
    rate: 1.0,
    avatar: '🇮🇳',
    description: 'Multilingual voice engine covering 22 official Indian languages.'
  }
];

const HINDI_ENGLISH_DICT: Record<string, string> = {
  ai: 'एआई',
  api: 'एपीआई',
  chatgpt: 'चैटजीपीटी',
  gpt: 'जीपीटी',
  gemini: 'जेमिनी',
  google: 'गूगल',
  openai: 'ओपनएआई',
  app: 'ऐप',
  apps: 'ऐप्स',
  android: 'एंड्रॉइड',
  ios: 'आईओएस',
  windows: 'विंडोज',
  python: 'पायथन',
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
  login: 'लॉगिन',
  password: 'पासवर्ड',
  email: 'ईमेल',
  link: 'लिंक',
  search: 'सर्च',
  mobile: 'मोबाइल',
  phone: 'फ़ोन',
  laptop: 'लैपटॉप',
  audio: 'ऑडियो',
  video: 'वीडियो',
  file: 'फ़ाइल',
  exam: 'परीक्षा',
  job: 'सरकारी नौकरी',
  jobs: 'सरकारी नौकरियां',
  admitcard: 'एडमिट कार्ड',
  result: 'रिजल्ट',
  compass: 'कम्पास'
};

export function normalizeHindiText(text: string): string {
  if (!text) return '';
  let clean = text;
  clean = clean.replace(/₹\s*(\d+)/g, '$1 रुपये');
  clean = clean.replace(/\$\s*(\d+)/g, '$1 डॉलर');
  clean = clean.replace(/(\d+)\s*%/g, '$1 प्रतिशत');

  for (const [eng, hin] of Object.entries(HINDI_ENGLISH_DICT)) {
    const reg = new RegExp(`\\b${eng}\\b`, 'gi');
    clean = clean.replace(reg, hin);
  }
  return clean;
}

export class SpeechEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public speaking: boolean = false;
  private wordTimer: ReturnType<typeof setInterval> | null = null;

  public getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve([]);
        return;
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
        setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
      }
    });
  }

  public async speakScript({
    text,
    persona = PRESET_PERSONAS[0],
    pitch = 1.0,
    rate = 1.0,
    onBoundary,
    onEnd,
    onError
  }: {
    text: string;
    persona?: VoicePersona;
    pitch?: number;
    rate?: number;
    onBoundary?: (word: string) => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }): Promise<void> {
    this.stop();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    const normalized = normalizeHindiText(text.trim());
    if (!normalized) {
      if (onEnd) onEnd();
      return;
    }

    const voices = await this.getVoices();
    // Look for matching Hindi or Indian voice
    let voice = voices.find(
      (v) =>
        (v.lang.startsWith('hi') || v.lang.startsWith('en-IN') || v.lang.includes('Hindi')) &&
        (persona.gender === 'Female' ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('kalpana') : true)
    );

    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith('hi') || v.lang.startsWith('en-IN')) || voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(normalized);
    if (voice) utterance.voice = voice;
    utterance.lang = persona.lang || 'hi-IN';
    utterance.pitch = pitch * (persona.pitch || 1.0);
    utterance.rate = rate * (persona.rate || 1.0);

    const words = normalized.split(/\s+/);
    let wordIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const spoken = normalized.substring(event.charIndex, event.charIndex + (event.charLength || 6)).trim();
        if (onBoundary) onBoundary(spoken);
      }
    };

    utterance.onstart = () => {
      this.speaking = true;
      // Fallback word boundary emitter if onboundary doesn't fire in certain browsers
      this.wordTimer = setInterval(() => {
        if (wordIndex < words.length && onBoundary) {
          onBoundary(words[wordIndex]);
          wordIndex++;
        }
      }, Math.max(120, Math.round(280 / (utterance.rate || 1.0))));
    };

    utterance.onend = () => {
      this.speaking = false;
      if (this.wordTimer) clearInterval(this.wordTimer);
      if (onBoundary) onBoundary('');
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.speaking = false;
      if (this.wordTimer) clearInterval(this.wordTimer);
      if (onBoundary) onBoundary('');
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.wordTimer) {
      clearInterval(this.wordTimer);
      this.wordTimer = null;
    }
    this.speaking = false;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechEngine = new SpeechEngine();
