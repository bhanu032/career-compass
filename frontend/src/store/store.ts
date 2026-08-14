/**
 * Redux store with localStorage persistence for the resume slice.
 *
 * On store creation:
 *   1. We try to load persisted state from localStorage.
 *   2. We also check the legacy sessionStorage key and migrate it once.
 *
 * On every state change:
 *   A subscribe listener debounce-writes the resume slice to localStorage
 *   so the user never loses their work across page refreshes or navigation.
 */

import { configureStore } from "@reduxjs/toolkit";
import resumeReducer, {
  hydrateResume,
  RESUME_INITIAL_STATE,
  type ResumeState,
} from "./resumeSlice";

// ── Storage keys ──────────────────────────────────────────────────────────────

const LS_KEY = "career-compass-resume-redux";
const SS_LEGACY_KEY = "career-compass-resume-flow"; // old sessionStorage key

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadFromLocalStorage(): Partial<ResumeState> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<ResumeState>;
  } catch {
    return null;
  }
}

function saveToLocalStorage(state: ResumeState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

/** One-time migration: read old sessionStorage → return as partial state */
function migrateLegacySessionStorage(): Partial<ResumeState> | null {
  try {
    const raw = sessionStorage.getItem(SS_LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      data?: ResumeState["data"];
      templateId?: ResumeState["templateId"];
      customization?: ResumeState["customization"];
      fromUpload?: boolean;
    };
    // Remove the old key so migration only happens once
    sessionStorage.removeItem(SS_LEGACY_KEY);
    return {
      data: parsed.data,
      templateId: parsed.templateId,
      customization: parsed.customization,
      fromUpload: parsed.fromUpload,
    };
  } catch {
    return null;
  }
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
});

// Hydrate from localStorage (primary) or legacy sessionStorage (one-time migration)
const persisted = loadFromLocalStorage() ?? migrateLegacySessionStorage();
if (persisted) {
  store.dispatch(hydrateResume(persisted));
}

// Debounce helper — avoid writing on every keystroke
let saveTimer: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveToLocalStorage(store.getState().resume);
  }, 300);
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Convenience selector ──────────────────────────────────────────────────────

export const selectResume = (state: RootState): ResumeState => state.resume;
