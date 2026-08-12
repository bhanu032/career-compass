/**
 * DavidAvatar — Polished CSS animated avatar for David the AI assistant.
 *
 * No GLB/Three.js needed — works everywhere, zero build issues.
 * Drop david.glb into frontend/public/ and swap the import for the 3D version anytime.
 */

interface DavidAvatarProps {
  isTalking: boolean;
  size?: number;
}

export function FallbackAvatar({ isTalking, size = 40 }: DavidAvatarProps) {
  return <DavidAvatarSafe isTalking={isTalking} size={size} />;
}

export function DavidAvatar({ isTalking, size = 40 }: DavidAvatarProps) {
  return <DavidAvatarSafe isTalking={isTalking} size={size} />;
}

export function DavidAvatarSafe({ isTalking, size = 40 }: DavidAvatarProps) {
  const r = size / 2;
  const fontSize = Math.round(size * 0.38);

  return (
    <>
      <style>{`
        @keyframes david-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @keyframes david-talk {
          0%   { transform: scale(1) rotate(-1.5deg); }
          25%  { transform: scale(1.05) rotate(0deg); }
          50%  { transform: scale(0.97) rotate(1.5deg); }
          75%  { transform: scale(1.04) rotate(-0.5deg); }
          100% { transform: scale(1) rotate(-1.5deg); }
        }
        @keyframes david-glow {
          0%, 100% { box-shadow: 0 0 0 2px rgba(124,58,237,0.4), 0 0 8px rgba(124,58,237,0.3); }
          50%       { box-shadow: 0 0 0 4px rgba(124,58,237,0.6), 0 0 16px rgba(124,58,237,0.5); }
        }
      `}</style>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0891b2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          animation: isTalking
            ? `david-talk 0.4s ease-in-out infinite, david-glow 0.4s ease-in-out infinite`
            : "david-breathe 3s ease-in-out infinite",
          boxShadow: isTalking
            ? "0 0 0 3px rgba(124,58,237,0.5)"
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.2s",
        }}
      >
        {/* Letter D */}
        <span style={{
          color: "#fff",
          fontSize,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}>
          D
        </span>

        {/* Talking mouth indicator */}
        {isTalking && (
          <div style={{
            position: "absolute",
            bottom: Math.round(size * 0.15),
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
          }}>
            {[3, 5, 3].map((h, i) => (
              <div key={i} style={{
                width: 2,
                height: h,
                background: "rgba(255,255,255,0.8)",
                borderRadius: 1,
                animation: `david-talk ${0.3 + i * 0.1}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
