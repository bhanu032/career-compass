import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Phonetic & Vowel Classifier for Devanagari and English words
function analyzeWordPhonemes(word: string) {
  if (!word || typeof word !== 'string') {
    return { vowels: ['aa'], consonants: [], openIntensity: 0.55, syllables: 1 };
  }
  const clean = word.toLowerCase().trim();
  const vowels: string[] = [];
  const consonants: string[] = [];
  let openIntensity = 0.5;

  // 1. Vowel Formants
  if (/[आाऔौऐैaA]/.test(clean)) {
    vowels.push('aa');
    openIntensity = Math.max(openIntensity, 0.85);
  }
  if (/[ओोउूुoOwW]/.test(clean)) {
    vowels.push('O');
    openIntensity = Math.max(openIntensity, 0.7);
  }
  if (/[ईइिीएेeEiIyY]/.test(clean)) {
    vowels.push('E');
    openIntensity = Math.max(openIntensity, 0.6);
  }
  if (vowels.length === 0 || /[अ]/.test(clean)) {
    vowels.push('aa');
    openIntensity = Math.max(openIntensity, 0.55);
  }

  // 2. Consonants
  if (/[पफबभमpbmPBM]/.test(clean)) consonants.push('PP'); // Bilabial
  if (/[सशषचछजतथदधनszSZtTdD]/.test(clean)) consonants.push('SS'); // Sibilants / Dentals
  if (/[कखगघहkgKhh]/.test(clean)) consonants.push('kk'); // Velar
  if (/[ररलrRlL]/.test(clean)) consonants.push('RR');

  // Estimate syllable count from character length
  const syllables = Math.max(1, Math.min(4, Math.round(clean.length / 2.5)));

  return { vowels, consonants, openIntensity, syllables };
}

interface David3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  speakingWord?: string;
  className?: string;
  gender?: "male" | "female";
}

export function David3DAvatar({
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  speakingWord = '',
  className = '',
  gender = 'male'
}: David3DAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const modelRef = useRef<THREE.Group | null>(null);
  const morphMeshesRef = useRef<THREE.Mesh[]>([]);
  const bonesRef = useRef<Record<string, THREE.Bone>>({});
  const initialBonesRef = useRef<Record<string, { x: number; y: number; z: number }>>({});
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const blinkStateRef = useRef({ lastBlink: 0, nextInterval: 3.5, blinking: false, blinkStart: 0 });

  // Persistent Live State Refs
  const isSpeakingRef = useRef(isSpeaking);
  const isListeningRef = useRef(isListening);
  const isThinkingRef = useRef(isThinking);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
    isListeningRef.current = isListening;
    isThinkingRef.current = isThinking;
  }, [isSpeaking, isListening, isThinking]);

  // Word-driven timing tracker
  const wordTrackRef = useRef({
    currentWord: '',
    startTime: 0,
    duration: 0.28,
    profile: { vowels: ['aa'], consonants: [] as string[], openIntensity: 0.55, syllables: 1 }
  });

  const morphWeightsRef = useRef({
    mouthOpen: 0,
    jawOpen: 0,
    viseme_aa: 0,
    viseme_O: 0,
    viseme_E: 0,
    viseme_PP: 0,
    viseme_SS: 0,
    viseme_kk: 0,
    mouthFunnel: 0,
    mouthSmile: 0,
    browInnerUp: 0,
    eyeBlinkLeft: 0,
    eyeBlinkRight: 0
  });

  // Track word transitions
  useEffect(() => {
    if (speakingWord && speakingWord !== wordTrackRef.current.currentWord) {
      const now = performance.now() / 1000;
      const profile = analyzeWordPhonemes(speakingWord);
      const duration = Math.min(0.42, Math.max(0.18, speakingWord.length * 0.055));
      wordTrackRef.current = {
        currentWord: speakingWord,
        startTime: now,
        duration: duration,
        profile: profile
      };
    }
  }, [speakingWord]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 560;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, -0.05, 2.35);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch {
      setLoadError(true);
      setLoading(false);
      return;
    }

    // Dynamic Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 3.4);
    keyLight.position.set(2.0, 2.5, 2.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc084fc, 2.0);
    fillLight.position.set(-2.0, 1.2, 1.4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 4.8, 15);
    rimLight.position.set(0, 1.6, -1.2);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x06b6d4, 2.0, 10);
    bottomGlow.position.set(0, -1.2, 0.8);
    scene.add(bottomGlow);

    // Load David.glb Model
    morphMeshesRef.current = [];
    bonesRef.current = {};
    initialBonesRef.current = {};

    let animFrameId: number;
    let isDisposed = false;

    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);
    modelRef.current = pivotGroup;

    const loader = new GLTFLoader();
    loader.load(
      '/david.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        const foundBones: Record<string, THREE.Bone> = {};
        const initialRot: Record<string, { x: number; y: number; z: number }> = {};

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
              morphMeshesRef.current.push(mesh);
            }
            if (mesh.material && !Array.isArray(mesh.material)) {
              (mesh.material as THREE.MeshStandardMaterial).roughness = 0.45;
              (mesh.material as THREE.MeshStandardMaterial).metalness = 0.1;
            }
          }

          if ((child as THREE.Bone).isBone) {
            const bone = child as THREE.Bone;
            const bName = bone.name.toLowerCase();
            if (bName.includes('head')) foundBones.head = bone;
            else if (bName.includes('neck')) foundBones.neck = bone;
            else if (bName.includes('spine2') || bName.includes('chest')) foundBones.chest = bone;
            else if (bName.includes('spine1')) foundBones.spine1 = bone;
            else if (bName.includes('spine') && !foundBones.spine) foundBones.spine = bone;
            else if (bName.includes('leftarm') || bName.includes('leftupperarm') || bName.includes('arm_l')) foundBones.leftArm = bone;
            else if (bName.includes('rightarm') || bName.includes('rightupperarm') || bName.includes('arm_r')) foundBones.rightArm = bone;
            else if (bName.includes('leftforearm') || bName.includes('forearm_l')) foundBones.leftForeArm = bone;
            else if (bName.includes('rightforearm') || bName.includes('forearm_r')) foundBones.rightForeArm = bone;
          }
        });

        for (const [key, bone] of Object.entries(foundBones)) {
          initialRot[key] = {
            x: bone.rotation.x,
            y: bone.rotation.y,
            z: bone.rotation.z
          };
        }

        // Adjust arm bones so hands rest in front of body near front pockets
        if (foundBones.leftArm) {
          foundBones.leftArm.rotation.x = 0.38;
          foundBones.leftArm.rotation.z = Math.min(foundBones.leftArm.rotation.z, -1.1);
        }
        if (foundBones.rightArm) {
          foundBones.rightArm.rotation.x = 0.38;
          foundBones.rightArm.rotation.z = Math.max(foundBones.rightArm.rotation.z, 1.1);
        }

        bonesRef.current = foundBones;
        initialBonesRef.current = initialRot;

        // Auto center bounding box
        const bbox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        model.position.sub(center);

        // Face to Knee body framing
        model.position.y -= 0.65;
        model.position.z += 0.05;

        pivotGroup.add(model);
        setLoading(false);
      },
      undefined,
      () => {
        // Build Procedural 3D Male / Female Avatar directly in Three.js
        const avatarGroup = new THREE.Group();
        pivotGroup.add(avatarGroup);
        modelRef.current = pivotGroup;

        const skinColor = gender === 'female' ? 0xf5d0a9 : 0xe0ac69;
        const suitColor = gender === 'female' ? 0x6b21a8 : 0x1e293b;
        const hairColor = gender === 'female' ? 0x4a154b : 0x1a1a1a;

        const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.4, metalness: 0.1 });
        const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.3, metalness: 0.2 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
        const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.7 });
        const eyeMat = new THREE.MeshBasicMaterial({ color: gender === 'female' ? 0x9333ea : 0x0284c7 });
        const jawMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.4 });

        // Head
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.65, 0);
        avatarGroup.add(headGroup);

        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), skinMat);
        headMesh.scale.set(1, 1.25, 0.95);
        headGroup.add(headMesh);

        // Hair (Male Short / Female Elegant Ponytail)
        const hairMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.255, 32, 32, 0, Math.PI * 2, 0, gender === 'female' ? Math.PI * 0.65 : Math.PI * 0.5),
          hairMat
        );
        hairMesh.position.set(0, 0.05, -0.01);
        headGroup.add(hairMesh);

        if (gender === 'female') {
          const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.4, 16), hairMat);
          ponytail.position.set(0, -0.1, -0.26);
          ponytail.rotation.x = -0.3;
          headGroup.add(ponytail);
        }

        // Eyes
        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), eyeMat);
        leftEye.position.set(-0.08, 0.04, 0.21);
        headGroup.add(leftEye);

        const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), eyeMat);
        rightEye.position.set(0.08, 0.04, 0.21);
        headGroup.add(rightEye);

        // Mouth / Jaw Mesh for visemes
        const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.08), jawMat);
        jawMesh.position.set(0, -0.15, 0.18);
        headGroup.add(jawMesh);

        // Torso / Suit (Down to Knees)
        const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.27, 1.0, 32), suitMat);
        torsoMesh.position.set(0, -0.05, 0);
        avatarGroup.add(torsoMesh);

        const shirtMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.7, 0.1), shirtMat);
        shirtMesh.position.set(0, 0.05, 0.22);
        avatarGroup.add(shirtMesh);

        // Arms (Tilted forward in front of body near front pockets!)
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-0.28, -0.05, 0.06);
        avatarGroup.add(leftArmGroup);

        const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.68, 16), suitMat);
        leftArm.rotation.z = 0.22;
        leftArm.rotation.x = 0.38; // Tilted forward towards pockets!
        leftArmGroup.add(leftArm);

        const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), skinMat);
        leftHand.position.set(0.08, -0.36, 0.18);
        leftArmGroup.add(leftHand);

        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.28, -0.05, 0.06);
        avatarGroup.add(rightArmGroup);

        const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.68, 16), suitMat);
        rightArm.rotation.z = -0.22;
        rightArm.rotation.x = 0.38; // Tilted forward towards pockets!
        rightArmGroup.add(rightArm);

        const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), skinMat);
        rightHand.position.set(-0.08, -0.36, 0.18);
        rightArmGroup.add(rightHand);

        // Legs (Down to knees)
        const legsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.6, 32), suitMat);
        legsMesh.position.set(0, -0.75, 0);
        avatarGroup.add(legsMesh);

        // Setup morph mesh ref for jaw animation
        morphMeshesRef.current = [jawMesh as any];
        jawMesh.morphTargetDictionary = { mouthopen: 0, viseme_aa: 0 };
        jawMesh.morphTargetInfluences = [0, 0];

        avatarGroup.position.y -= 0.18;

        setLoading(false);
        setLoadError(false);
      }
    );

    // Mouse interactive tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const talking = isSpeakingRef.current;
      const listening = isListeningRef.current;
      const thinking = isThinkingRef.current;

      // 1. Natural Eyelid Blink
      const blink = blinkStateRef.current;
      let blinkVal = 0;
      if (!blink.blinking && time - blink.lastBlink > blink.nextInterval) {
        blink.blinking = true;
        blink.blinkStart = time;
        blink.nextInterval = 2.5 + Math.random() * 3.5;
      }
      if (blink.blinking) {
        const prog = (time - blink.blinkStart) / 0.18;
        if (prog >= 1.0) {
          blink.blinking = false;
          blink.lastBlink = time;
          blinkVal = 0;
        } else {
          blinkVal = Math.sin(prog * Math.PI);
        }
      }

      // 2. Word-Driven Viseme Synthesis
      let targetMouth = 0;
      let targetAA = 0;
      let targetO = 0;
      let targetE = 0;
      let targetPP = 0;
      let targetSS = 0;

      if (talking) {
        const track = wordTrackRef.current;
        const nowSec = performance.now() / 1000;
        const wordElapsed = nowSec - track.startTime;
        const duration = track.duration || 0.28;
        const profile = track.profile;

        if (wordElapsed <= duration * 1.5) {
          const normTime = (wordElapsed % duration) / duration;
          const syllableFreq = profile.syllables || 1;
          const openCycle = Math.abs(Math.sin(normTime * Math.PI * syllableFreq));

          targetMouth = openCycle * profile.openIntensity;

          if (profile.vowels.includes('aa')) targetAA = openCycle * 0.85;
          if (profile.vowels.includes('O')) targetO = openCycle * 0.75;
          if (profile.vowels.includes('E')) targetE = openCycle * 0.65;
          if (profile.consonants.includes('PP')) targetPP = (1.0 - openCycle) * 0.8;
          if (profile.consonants.includes('SS')) targetSS = openCycle * 0.55;
        } else {
          // Subtle idle mouth flutter
          targetMouth = 0.25 + 0.2 * Math.sin(time * 12);
          targetAA = 0.3 * Math.abs(Math.sin(time * 10));
        }
      }

      // 3. Smooth morph transitions
      const mw = morphWeightsRef.current;
      const lerpSpd = talking ? 0.35 : 0.2;
      mw.mouthOpen += (targetMouth - mw.mouthOpen) * lerpSpd;
      mw.viseme_aa += (targetAA - mw.viseme_aa) * lerpSpd;
      mw.viseme_O += (targetO - mw.viseme_O) * lerpSpd;
      mw.viseme_E += (targetE - mw.viseme_E) * lerpSpd;
      mw.viseme_PP += (targetPP - mw.viseme_PP) * lerpSpd;
      mw.viseme_SS += (targetSS - mw.viseme_SS) * lerpSpd;
      mw.eyeBlinkLeft += (blinkVal - mw.eyeBlinkLeft) * 0.45;
      mw.eyeBlinkRight += (blinkVal - mw.eyeBlinkRight) * 0.45;
      mw.browInnerUp += ((thinking ? 0.4 : listening ? 0.2 : 0) - mw.browInnerUp) * 0.1;

      // Apply morph influences to mesh
      for (const mesh of morphMeshesRef.current) {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) continue;
        const dict = mesh.morphTargetDictionary;
        const inf = mesh.morphTargetInfluences;

        for (const [key, val] of Object.entries(mw)) {
          if (dict[key] !== undefined) {
            inf[dict[key]] = val;
          }
          // Alternative common naming
          const altKey = key.toLowerCase();
          if (dict[altKey] !== undefined) {
            inf[dict[altKey]] = val;
          }
        }
      }

      // 4. Head & Spine Breathing Motion
      const bones = bonesRef.current;
      const initBones = initialBonesRef.current;

      const breathY = Math.sin(time * 2.2) * 0.02;
      const talkNod = talking ? Math.sin(time * 9) * 0.035 : 0;
      const thinkTilt = thinking ? 0.08 : 0;
      const listenTurn = listening ? -0.05 : 0;

      if (bones.head && initBones.head) {
        bones.head.rotation.x = initBones.head.x - mouseRef.current.y * 0.18 + talkNod + breathY * 0.5;
        bones.head.rotation.y = initBones.head.y + mouseRef.current.x * 0.25 + listenTurn;
        bones.head.rotation.z = initBones.head.z + thinkTilt - mouseRef.current.x * 0.06;
      }

      if (bones.neck && initBones.neck) {
        bones.neck.rotation.x = initBones.neck.x - mouseRef.current.y * 0.08 + breathY * 0.3;
        bones.neck.rotation.y = initBones.neck.y + mouseRef.current.x * 0.12;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="h-full w-full min-h-[320px] max-h-[500px]" />

      {/* Fallback CSS Avatar if WebGL or Model unavailable */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 text-center">
          <div
            className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 text-white shadow-2xl transition-all duration-300 ${
              isSpeaking ? 'scale-110 ring-8 ring-cyan-500/40 animate-pulse' : isListening ? 'ring-4 ring-emerald-400/50' : ''
            }`}
          >
            <span className="text-5xl font-black tracking-tight">D</span>
            {isSpeaking && (
              <div className="absolute -bottom-2 flex gap-1 rounded-full bg-slate-950/90 px-3 py-1 text-xs text-cyan-400">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce [animation-delay:0.15s]">●</span>
                <span className="animate-bounce [animation-delay:0.3s]">●</span>
              </div>
            )}
          </div>
          <h4 className="mt-4 font-bold text-white">David 3D Voice Assistant</h4>
          <p className="mt-1 text-xs text-slate-400">Real-time Devanagari Hindi & Indian English Intelligence</p>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <span className="mt-3 text-xs font-semibold text-cyan-300">Initializing David 3D Avatar...</span>
        </div>
      )}

      {/* Dynamic State Badges */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-md backdrop-blur-md border border-cyan-500/30">
          <span
            className={`h-2 w-2 rounded-full ${
              isSpeaking
                ? 'bg-cyan-400 animate-ping'
                : isListening
                ? 'bg-emerald-400 animate-pulse'
                : isThinking
                ? 'bg-amber-400 animate-spin'
                : 'bg-emerald-500'
            }`}
          />
          <span>
            {isSpeaking
              ? 'Speaking Hindi / English...'
              : isListening
              ? 'Listening to your voice...'
              : isThinking
              ? 'Formulating response...'
              : 'David 3D Active'}
          </span>
        </div>

        {speakingWord && (
          <div className="rounded-lg bg-slate-900/90 px-2.5 py-0.5 text-xs font-bold text-violet-300 shadow-md backdrop-blur-md border border-violet-500/30">
            "{speakingWord}"
          </div>
        )}
      </div>
    </div>
  );
}
