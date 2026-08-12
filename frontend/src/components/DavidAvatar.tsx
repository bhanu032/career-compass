/**
 * DavidAvatar — renders the david.glb 3D model in the chat widget.
 *
 * Place david.glb in:  frontend/public/david.glb
 *
 * Features:
 * - Idle breathing animation (gentle scale pulse)
 * - Talking animation (head bob + subtle scale) when `isTalking` is true
 * - Falls back to a simple animated gradient avatar if the GLB fails to load
 */
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import type { Group } from "three";

interface ModelProps {
  isTalking: boolean;
}

function DavidModel({ isTalking }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const clock = useRef(0);

  // Load the GLB — useGLTF caches after first load
  const { scene } = useGLTF("/david.glb");

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    clock.current += delta;
    const t = clock.current;

    if (isTalking) {
      // Talking: bob head + slight scale pulse
      groupRef.current.position.y = Math.sin(t * 8) * 0.04;
      const s = 1 + Math.sin(t * 12) * 0.015;
      groupRef.current.scale.setScalar(s);
    } else {
      // Idle: gentle breathing
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.015;
      const s = 1 + Math.sin(t * 1.2) * 0.008;
      groupRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload so it's ready before the widget opens
useGLTF.preload("/david.glb");

interface FallbackAvatarProps {
  isTalking: boolean;
  size?: number;
}

/** Simple CSS fallback when GLB is missing or loading fails */
export function FallbackAvatar({ isTalking, size = 40 }: FallbackAvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.4,
        fontWeight: 700,
        boxShadow: isTalking
          ? "0 0 0 3px rgba(124,58,237,0.4), 0 0 12px rgba(124,58,237,0.6)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.2s",
        animation: isTalking ? "david-talk 0.3s ease-in-out infinite alternate" : undefined,
        flexShrink: 0,
      }}
    >
      D
    </div>
  );
}

interface DavidAvatarProps {
  isTalking: boolean;
  /** px size of the canvas — default 40 */
  size?: number;
}

export function DavidAvatar({ isTalking, size = 40 }: DavidAvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: isTalking
          ? "0 0 0 3px rgba(124,58,237,0.5), 0 0 16px rgba(124,58,237,0.4)"
          : "0 2px 8px rgba(0,0,0,0.25)",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 35 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <DavidModel isTalking={isTalking} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

/** Smart wrapper: renders 3D if WebGL available, otherwise CSS fallback */
export function DavidAvatarSafe({ isTalking, size = 40 }: DavidAvatarProps) {
  // Check WebGL support once
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch {
      return false;
    }
  })();

  if (!hasWebGL) {
    return <FallbackAvatar isTalking={isTalking} size={size} />;
  }

  return <DavidAvatar isTalking={isTalking} size={size} />;
}
