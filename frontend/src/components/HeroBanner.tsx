"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  FileCheck,
  FileText,
  GraduationCap,
  Landmark,
  Scale,
  ScrollText,
  Shield,
  Star,
  Train,
  Trophy,
  Users,
  Wallet,
  Stethoscope,
  Cpu,
  Flame,
  Globe,
  Anchor,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Custom SVG icons for government symbols not in lucide
// ─────────────────────────────────────────────────────────────────────────────

function AshokaChakra({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  // Ashoka Chakra: circle with 24 spokes
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const r1 = 8, r2 = 22;
    return (
      <line
        key={i}
        x1={24 + Math.cos(rad) * r1}
        y1={24 + Math.sin(rad) * r1}
        x2={24 + Math.cos(rad) * r2}
        y2={24 + Math.sin(rad) * r2}
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="1.8" />
      <circle cx="24" cy="24" r="3" fill={color} />
      {spokes}
    </svg>
  );
}

function ArmyStar({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  // 5-pointed star
  const pts = Array.from({ length: 5 }, (_, i) => {
    const outer = 22, inner = 9;
    const a1 = ((i * 72 - 90) * Math.PI) / 180;
    const a2 = (((i * 72 + 36) - 90) * Math.PI) / 180;
    return [
      `${24 + Math.cos(a1) * outer},${24 + Math.sin(a1) * outer}`,
      `${24 + Math.cos(a2) * inner},${24 + Math.sin(a2) * inner}`,
    ];
  }).flat().join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <polygon points={pts} fill={color} opacity="0.9" />
      <polygon points={pts} stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

function NavalAnchor({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* ring */}
      <circle cx="24" cy="10" r="5" />
      {/* vertical */}
      <line x1="24" y1="15" x2="24" y2="40" />
      {/* crossbar */}
      <line x1="14" y1="20" x2="34" y2="20" />
      {/* bottom curve left */}
      <path d="M24 40 C14 40 10 34 10 28" />
      {/* bottom curve right */}
      <path d="M24 40 C34 40 38 34 38 28" />
      {/* left tip */}
      <line x1="10" y1="28" x2="14" y2="32" />
      {/* right tip */}
      <line x1="38" y1="28" x2="34" y2="32" />
    </svg>
  );
}

function ArmyRifle({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* barrel */}
      <line x1="6" y1="22" x2="36" y2="22" />
      {/* body */}
      <rect x="14" y="20" width="22" height="6" rx="1.5" fill={color} fillOpacity="0.15" stroke={color} />
      {/* stock */}
      <path d="M36 22 L42 19 L42 25 L36 25" fill={color} fillOpacity="0.2" />
      {/* trigger guard */}
      <path d="M22 26 Q21 33 26 33 Q31 33 30 26" strokeWidth="1.5" />
      {/* trigger */}
      <line x1="26" y1="26" x2="26" y2="30" />
      {/* muzzle sight */}
      <line x1="6" y1="19" x2="6" y2="22" />
      {/* magazine */}
      <rect x="18" y="26" width="8" height="6" rx="1" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

function MilitaryHelmet({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 30 Q8 14 24 12 Q40 14 40 30 Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <line x1="6" y1="30" x2="42" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 30 Q10 36 14 38 L34 38 Q38 36 36 30" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function WingedCrest({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  // Simplified Indian Air Force eagle / wings crest
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* body */}
      <ellipse cx="24" cy="26" rx="5" ry="7" fill={color} fillOpacity="0.2" />
      {/* left wing */}
      <path d="M19 24 C14 18 8 22 6 28 C10 26 15 27 19 26" fill={color} fillOpacity="0.15" />
      {/* right wing */}
      <path d="M29 24 C34 18 40 22 42 28 C38 26 33 27 29 26" fill={color} fillOpacity="0.15" />
      {/* head */}
      <circle cx="24" cy="18" r="4" fill={color} fillOpacity="0.2" />
      {/* beak */}
      <path d="M24 21 L22 24" strokeWidth="2" />
      {/* tail */}
      <path d="M22 33 L24 38 L26 33" />
    </svg>
  );
}

function IndiaMap({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  // Simplified India silhouette outline
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4 L28 8 L32 8 L34 12 L36 14 L34 17 L36 20 L34 24 L30 26 L32 30 L30 34 L28 36 L26 40 L24 44 L22 40 L20 36 L18 34 L16 30 L18 26 L14 24 L12 20 L14 17 L12 14 L14 12 L16 8 L20 8 Z"
        stroke={color}
        strokeWidth="1.8"
        fill={color}
        fillOpacity="0.15"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="22" r="2" fill={color} opacity="0.7" />
    </svg>
  );
}

function GovernmentSeal({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  // Hexagonal seal with star inside
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 30) * Math.PI) / 180;
    return `${24 + Math.cos(a) * 20},${24 + Math.sin(a) * 20}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <polygon points={pts} stroke={color} strokeWidth="2" fill={color} fillOpacity="0.12" />
      <polygon points={pts} stroke={color} strokeWidth="0.8" fill="none" opacity="0.3"
        transform="rotate(30 24 24)" />
      <circle cx="24" cy="24" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="2.5" fill={color} opacity="0.8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon Registry — defines each icon's visual properties + which lane it's in
// Lane controls the sine-wave row it travels along (0 = top, 1 = mid, 2 = bot)
// ─────────────────────────────────────────────────────────────────────────────

type IconEntry = {
  type: "lucide" | "custom";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: any;
  label: string;
  baseColor: string;
  glowColor: string;
  size: number;
  lane: 0 | 1 | 2;          // which horizontal ribbon (top / middle / bottom)
  speed: number;             // travel speed multiplier (1 = normal)
  phaseOffset: number;       // starting x-offset (0–1, so icons don't stack at start)
  depth: number;             // parallax depth vs mouse
  pulse: number;             // zoom-pulse amplitude
};

const ICON_DEFS: IconEntry[] = [
  // ── Lane 0 (top ribbon) ──
  { type:"custom",  Component:AshokaChakra,  label:"Ashoka1",     baseColor:"#fde68a", glowColor:"#f59e0b", size:32, lane:0, speed:1.0,  phaseOffset:0.00, depth:0.5, pulse:0.13 },
  { type:"custom",  Component:NavalAnchor,   label:"Navy1",       baseColor:"#a5f3fc", glowColor:"#06b6d4", size:28, lane:0, speed:1.1,  phaseOffset:0.09, depth:0.4, pulse:0.10 },
  { type:"custom",  Component:ArmyStar,      label:"ArmyStar1",   baseColor:"#fca5a5", glowColor:"#ef4444", size:26, lane:0, speed:0.9,  phaseOffset:0.18, depth:0.6, pulse:0.14 },
  { type:"custom",  Component:WingedCrest,   label:"AirForce1",   baseColor:"#e9d5ff", glowColor:"#a855f7", size:30, lane:0, speed:1.2,  phaseOffset:0.27, depth:0.3, pulse:0.09 },
  { type:"custom",  Component:ArmyRifle,     label:"Rifle1",      baseColor:"#fdba74", glowColor:"#f97316", size:26, lane:0, speed:1.0,  phaseOffset:0.36, depth:0.7, pulse:0.11 },
  { type:"lucide",  Component:Landmark,      label:"Parliament1", baseColor:"#fef08a", glowColor:"#eab308", size:28, lane:0, speed:0.85, phaseOffset:0.45, depth:0.5, pulse:0.08 },
  { type:"custom",  Component:GovernmentSeal,label:"Seal1",       baseColor:"#fecdd3", glowColor:"#f43f5e", size:24, lane:0, speed:1.15, phaseOffset:0.54, depth:0.4, pulse:0.12 },
  { type:"lucide",  Component:Shield,        label:"Shield1",     baseColor:"#bfdbfe", glowColor:"#3b82f6", size:24, lane:0, speed:0.95, phaseOffset:0.63, depth:0.6, pulse:0.09 },
  { type:"custom",  Component:MilitaryHelmet,label:"Helmet1",     baseColor:"#bbf7d0", glowColor:"#22c55e", size:26, lane:0, speed:1.05, phaseOffset:0.72, depth:0.35, pulse:0.11 },
  { type:"custom",  Component:IndiaMap,      label:"India1",      baseColor:"#fde68a", glowColor:"#f59e0b", size:28, lane:0, speed:0.9,  phaseOffset:0.81, depth:0.55, pulse:0.13 },
  { type:"lucide",  Component:Train,         label:"Train1",      baseColor:"#d9f99d", glowColor:"#84cc16", size:26, lane:0, speed:1.1,  phaseOffset:0.90, depth:0.5, pulse:0.09 },

  // ── Lane 1 (middle ribbon — opposite direction) ──
  { type:"lucide",  Component:GraduationCap, label:"Edu1",        baseColor:"#d9f99d", glowColor:"#84cc16", size:24, lane:1, speed:0.8,  phaseOffset:0.04, depth:0.4, pulse:0.10 },
  { type:"lucide",  Component:Anchor,        label:"Anchor1",     baseColor:"#bbf7d0", glowColor:"#22c55e", size:26, lane:1, speed:0.95, phaseOffset:0.13, depth:0.6, pulse:0.12 },
  { type:"custom",  Component:AshokaChakra,  label:"Ashoka2",     baseColor:"#c7d2fe", glowColor:"#6366f1", size:22, lane:1, speed:1.1,  phaseOffset:0.22, depth:0.3, pulse:0.10 },
  { type:"lucide",  Component:Scale,         label:"Scale1",      baseColor:"#e9d5ff", glowColor:"#a855f7", size:24, lane:1, speed:0.85, phaseOffset:0.31, depth:0.5, pulse:0.08 },
  { type:"lucide",  Component:Globe,         label:"Globe1",      baseColor:"#a5f3fc", glowColor:"#06b6d4", size:22, lane:1, speed:1.0,  phaseOffset:0.40, depth:0.7, pulse:0.11 },
  { type:"lucide",  Component:Stethoscope,   label:"Medical1",    baseColor:"#fca5a5", glowColor:"#ef4444", size:24, lane:1, speed:0.9,  phaseOffset:0.49, depth:0.45, pulse:0.09 },
  { type:"lucide",  Component:Cpu,           label:"DRDO1",       baseColor:"#bfdbfe", glowColor:"#3b82f6", size:22, lane:1, speed:1.2,  phaseOffset:0.58, depth:0.6, pulse:0.14 },
  { type:"custom",  Component:ArmyStar,      label:"ArmyStar2",   baseColor:"#fef08a", glowColor:"#eab308", size:20, lane:1, speed:0.8,  phaseOffset:0.67, depth:0.4, pulse:0.10 },
  { type:"lucide",  Component:Flame,         label:"Para1",       baseColor:"#fdba74", glowColor:"#f97316", size:22, lane:1, speed:1.05, phaseOffset:0.76, depth:0.55, pulse:0.08 },
  { type:"custom",  Component:WingedCrest,   label:"AirForce2",   baseColor:"#e9d5ff", glowColor:"#a855f7", size:24, lane:1, speed:0.95, phaseOffset:0.85, depth:0.35, pulse:0.13 },
  { type:"lucide",  Component:Building2,     label:"PSU1",        baseColor:"#fed7aa", glowColor:"#f97316", size:22, lane:1, speed:1.1,  phaseOffset:0.94, depth:0.5, pulse:0.09 },

  // ── Lane 2 (bottom ribbon) ──
  { type:"lucide",  Component:BookOpen,      label:"Exam1",       baseColor:"#fde68a", glowColor:"#f59e0b", size:24, lane:2, speed:1.1,  phaseOffset:0.02, depth:0.45, pulse:0.09 },
  { type:"lucide",  Component:Wallet,        label:"Banking1",    baseColor:"#d9f99d", glowColor:"#84cc16", size:22, lane:2, speed:0.9,  phaseOffset:0.11, depth:0.6, pulse:0.12 },
  { type:"lucide",  Component:Briefcase,     label:"Jobs1",       baseColor:"#fca5a5", glowColor:"#ef4444", size:26, lane:2, speed:1.0,  phaseOffset:0.20, depth:0.4, pulse:0.10 },
  { type:"custom",  Component:GovernmentSeal,label:"Seal2",       baseColor:"#e9d5ff", glowColor:"#a855f7", size:24, lane:2, speed:0.85, phaseOffset:0.29, depth:0.5, pulse:0.08 },
  { type:"lucide",  Component:FileText,      label:"Notice1",     baseColor:"#a5f3fc", glowColor:"#06b6d4", size:22, lane:2, speed:1.15, phaseOffset:0.38, depth:0.7, pulse:0.13 },
  { type:"custom",  Component:NavalAnchor,   label:"Navy2",       baseColor:"#bfdbfe", glowColor:"#3b82f6", size:26, lane:2, speed:1.0,  phaseOffset:0.47, depth:0.4, pulse:0.10 },
  { type:"lucide",  Component:BadgeCheck,    label:"Badge1",      baseColor:"#bbf7d0", glowColor:"#22c55e", size:24, lane:2, speed:0.9,  phaseOffset:0.56, depth:0.6, pulse:0.11 },
  { type:"lucide",  Component:Users,         label:"Recruit1",    baseColor:"#fdba74", glowColor:"#f97316", size:22, lane:2, speed:1.1,  phaseOffset:0.65, depth:0.35, pulse:0.09 },
  { type:"lucide",  Component:ScrollText,    label:"AdmitCard1",  baseColor:"#fef08a", glowColor:"#eab308", size:26, lane:2, speed:0.95, phaseOffset:0.74, depth:0.55, pulse:0.12 },
  { type:"lucide",  Component:Trophy,        label:"Trophy1",     baseColor:"#fca5a5", glowColor:"#ef4444", size:28, lane:2, speed:1.05, phaseOffset:0.83, depth:0.5, pulse:0.14 },
  { type:"custom",  Component:MilitaryHelmet,label:"Helmet2",     baseColor:"#c7d2fe", glowColor:"#6366f1", size:22, lane:2, speed:0.8,  phaseOffset:0.92, depth:0.4, pulse:0.08 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Gradient Variants
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
  jobs: {
    from: "#0f0c29", via: "#302b63", to: "#24243e",
    orb1: "rgba(99,102,241,0.45)",  orb2: "rgba(168,85,247,0.3)",  orb3: "rgba(59,130,246,0.25)",
    shine: "rgba(167,139,250,0.18)",
    accent: "#818cf8",
  },
  admit: {
    from: "#0a1628", via: "#0f3460", to: "#1a1a5e",
    orb1: "rgba(59,130,246,0.45)",  orb2: "rgba(6,182,212,0.3)",   orb3: "rgba(99,102,241,0.25)",
    shine: "rgba(96,165,250,0.18)",
    accent: "#60a5fa",
  },
  results: {
    from: "#052e16", via: "#064e3b", to: "#065f46",
    orb1: "rgba(34,197,94,0.4)",    orb2: "rgba(20,184,166,0.3)",  orb3: "rgba(16,185,129,0.25)",
    shine: "rgba(52,211,153,0.18)",
    accent: "#34d399",
  },
  search: {
    from: "#1c0a00", via: "#431407", to: "#7c2d12",
    orb1: "rgba(249,115,22,0.4)",   orb2: "rgba(234,179,8,0.3)",   orb3: "rgba(239,68,68,0.25)",
    shine: "rgba(251,146,60,0.18)",
    accent: "#fb923c",
  },
} as const;

// Tricolor overrides — saffron/white/green palette (used when theme="tricolor")
type VariantConfig = { from: string; via: string; to: string; orb1: string; orb2: string; orb3: string; shine: string; accent: string; };
const TRICOLOR_VARIANTS: Record<keyof typeof VARIANTS, VariantConfig> = {
  jobs: {
    from: "#7A1A00", via: "#B34700", to: "#4A1200",
    orb1: "rgba(255,153,51,0.55)",  orb2: "rgba(200,112,0,0.35)",  orb3: "rgba(255,180,100,0.25)",
    shine: "rgba(255,200,100,0.22)",
    accent: "#FFC266",
  },
  admit: {
    from: "#00280A", via: "#005215", to: "#001E08",
    orb1: "rgba(19,136,8,0.55)",    orb2: "rgba(10,100,5,0.35)",   orb3: "rgba(50,180,30,0.25)",
    shine: "rgba(80,220,60,0.18)",
    accent: "#6EE763",
  },
  results: {
    from: "#00004A", via: "#000080", to: "#000035",
    orb1: "rgba(0,0,180,0.55)",     orb2: "rgba(30,30,200,0.35)",  orb3: "rgba(60,60,220,0.25)",
    shine: "rgba(100,100,255,0.2)",
    accent: "#8888FF",
  },
  search: {
    from: "#7A1A00", via: "#3A0060", to: "#004A20",
    orb1: "rgba(255,153,51,0.45)",  orb2: "rgba(0,0,128,0.35)",    orb3: "rgba(19,136,8,0.3)",
    shine: "rgba(255,200,80,0.18)",
    accent: "#FFB347",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Lane config — each lane is a horizontal sine-wave ribbon
// lane 0 = top (y ≈ 10–20%), lane 1 = middle (y ≈ 40–55%), lane 2 = bottom (y ≈ 70–82%)
// Lane 1 travels right→left (reverse = true) for visual variety
// ─────────────────────────────────────────────────────────────────────────────

const LANE_CONFIG = [
  { centerY: 14, amplitude: 7,  baseSpeed: 0.018, reverse: false }, // top
  { centerY: 48, amplitude: 9,  baseSpeed: 0.015, reverse: true  }, // middle — goes right→left
  { centerY: 76, amplitude: 6,  baseSpeed: 0.020, reverse: false }, // bottom
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FloatingIcon — curvy conveyor belt movement
// ─────────────────────────────────────────────────────────────────────────────

interface FloatingIconProps extends IconEntry {
  mouseX: number;
  mouseY: number;
  tick: number;
  accent: string;
  bannerH: number; // banner pixel height (for %-to-px sine)
}

function FloatingIcon(props: FloatingIconProps) {
  const {
    Component, type, baseColor, glowColor, size,
    lane, speed, phaseOffset, depth, pulse,
    mouseX, mouseY, tick, accent, bannerH,
  } = props;

  const cfg = LANE_CONFIG[lane];

  // Time in seconds (~60fps)
  const t = tick * 0.016;

  // ── Conveyor X: travels from -10% to 110%, then wraps
  // Each icon starts at a different x position (phaseOffset 0–1)
  const travelDir = cfg.reverse ? -1 : 1;
  const rawX = ((phaseOffset + t * cfg.baseSpeed * speed * travelDir) % 1 + 1) % 1;
  // rawX goes 0→1 (left→right) or wraps in reverse
  const xPct = cfg.reverse
    ? 110 - rawX * 120   // right to left: 110% → -10%
    : rawX * 120 - 10;   // left to right: -10% → 110%

  // ── Sine-wave Y along the lane ribbon
  // x position drives the sine (so the curve moves with the icon)
  const sinePhase = rawX * Math.PI * 6; // 3 full waves across the banner
  const yPct = cfg.centerY + Math.sin(sinePhase + phaseOffset * Math.PI * 2) * cfg.amplitude;

  // ── Vertical bob on top of the sine path (gentle breathing)
  const bobY = Math.sin(t * 1.1 + phaseOffset * 8) * 3;

  // ── Rotation: sways as it travels along the curve
  // derivative of sin gives us the tangent angle → natural tilt
  const slopeFactor = Math.cos(sinePhase + phaseOffset * Math.PI * 2) * cfg.amplitude * 0.4;
  const rot = travelDir * slopeFactor + Math.sin(t * 0.7 + phaseOffset * 5) * 4;

  // ── Zoom pulse (scale breathes in/out)
  const scale = 1 + Math.sin(t * 1.3 + phaseOffset * 7) * pulse;

  // ── Parallax offset from mouse
  const px = (mouseX - 0.5) * 60 * depth;
  const py = (mouseY - 0.5) * 40 * depth;

  // ── Glow pulse
  const glowAmt = 0.35 + Math.sin(t * 0.9 + phaseOffset * 6) * 0.25;
  const glowHex = Math.round(glowAmt * 255).toString(16).padStart(2, "0");
  const glowRingSize = size + 12 + Math.sin(t * 1.4 + phaseOffset * 4) * 5;

  // ── Color alpha pulse on icon (subtle fade in/out)
  const iconOpacity = 0.65 + Math.sin(t * 0.6 + phaseOffset * 9) * 0.25;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: `${xPct}%`,
        top:  `${yPct}%`,
        transform: `translate(${px}px, ${py + bobY}px) rotate(${rot}deg) scale(${scale})`,
        willChange: "transform, left, top",
      }}
    >
      {/* Soft glow behind the icon */}
      <div
        style={{
          position: "absolute",
          width:  glowRingSize + 18,
          height: glowRingSize + 18,
          left:  -(glowRingSize + 18) / 2 + size / 2,
          top:   -(glowRingSize + 18) / 2 + size / 2,
          background: `radial-gradient(circle, ${glowColor}${glowHex} 0%, transparent 65%)`,
          filter: "blur(8px)",
          borderRadius: "50%",
        }}
      />

      {/* Bare icon — no background, no border, no box */}
      <div style={{ opacity: iconOpacity, position: "relative" }}>
        {type === "lucide" ? (
          <Component
            style={{ width: size, height: size, color: baseColor, display: "block" }}
            strokeWidth={1.3}
          />
        ) : (
          <Component size={size} color={baseColor} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main HeroBanner component
// ─────────────────────────────────────────────────────────────────────────────

interface HeroBannerProps {
  variant?: "jobs" | "admit" | "results" | "search";
  children: React.ReactNode;
  py?: string;
}

export function HeroBanner({ variant = "jobs", children, py = "py-20" }: HeroBannerProps) {
  const { theme } = useTheme();
  const v: VariantConfig = theme === "tricolor" ? TRICOLOR_VARIANTS[variant] : VARIANTS[variant];
  const ref = useRef<HTMLElement>(null);

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [tick, setTick] = useState(0);
  const [bannerH, setBannerH] = useState(320);
  const tickRef = useRef(0);
  const rafRef = useRef<number>(0);

  // rAF loop — drives all animation
  useEffect(() => {
    function loop() {
      tickRef.current += 1;
      setTick(tickRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Measure banner height for sine scaling
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBannerH(el.offsetHeight));
    ro.observe(el);
    setBannerH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top)  / rect.height)),
    });
  }, []);

  const handleMouseLeave = useCallback(() => setMouse({ x: 0.5, y: 0.5 }), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const orbX = (mouse.x - 0.5) * 70;
  const orbY = (mouse.y - 0.5) * 50;
  const bgRot = (tick * 0.018) % 360;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${py} text-white cursor-default`}
      style={{
        background: `linear-gradient(135deg, ${v.from} 0%, ${v.via} 50%, ${v.to} 100%)`,
        minHeight: 280,
      }}
    >
      {/* Layer 1 — slow rotating conic gradient */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          background: `conic-gradient(from ${bgRot}deg at 55% 45%, ${v.orb1} 0deg, ${v.orb2} 90deg, ${v.orb3} 180deg, transparent 270deg, ${v.orb1} 360deg)`,
        }}
      />

      {/* Layer 2 — grid mesh parallax */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${(mouse.x - 0.5) * -22}px ${(mouse.y - 0.5) * -22}px`,
        }}
      />

      {/* Layer 3 — cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 52% 48% at ${50 + orbX * 0.5}% ${50 + orbY * 0.5}%, ${v.shine} 0%, transparent 70%)`,
        }}
      />

      {/* Layer 4 — depth orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-3xl" style={{ width:500,height:500,left:"-12%",top:"-35%", background:v.orb1, transform:`translate(${orbX*1.4}px,${orbY}px)`, transition:"transform 0.45s ease-out" }} />
        <div className="absolute rounded-full blur-3xl" style={{ width:460,height:460,right:"-14%",bottom:"-35%", background:v.orb2, transform:`translate(${-orbX}px,${-orbY*0.9}px)`, transition:"transform 0.55s ease-out" }} />
        <div className="absolute rounded-full blur-2xl" style={{ width:320,height:320,left:"32%",top:"5%", background:v.orb3, transform:`translate(${orbX*0.5}px,${orbY*1.2}px)`, transition:"transform 0.38s ease-out" }} />
      </div>

      {/* Layer 5 — diagonal shine */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background:`linear-gradient(135deg,transparent 25%,${v.shine} 50%,transparent 75%)` }}
      />

      {/* Layer 5b — tricolor horizontal stripe overlay (tricolor theme only) */}
      {theme === "tricolor" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,153,51,0.18) 0%, transparent 30%, transparent 70%, rgba(19,136,8,0.18) 100%)",
          }}
        />
      )}

      {/* Layer 6 — curvy conveyor belt icons */}
      {ICON_DEFS.map((icon) => (
        <FloatingIcon
          key={icon.label}
          {...icon}
          mouseX={mouse.x}
          mouseY={mouse.y}
          tick={tick}
          accent={v.accent}
          bannerH={bannerH}
        />
      ))}

      {/* Content */}
      <div className="container-page relative z-10">
        {children}
      </div>
    </section>
  );
}
