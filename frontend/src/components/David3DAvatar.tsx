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
  armPose?: "elbows_front" | "behind_back" | "front_stomach" | "default_gltf" | "facing_shoes" | "joined_palms" | "front_pockets" | "front_face" | "natural_sides";
}

export function David3DAvatar({
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  speakingWord = '',
  className = '',
  gender = 'male',
  armPose = 'elbows_front'
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
  const armPoseRef = useRef(armPose);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
    isListeningRef.current = isListening;
    isThinkingRef.current = isThinking;
    armPoseRef.current = armPose;
  }, [isSpeaking, isListening, isThinking, armPose]);

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

          if ((child as THREE.Bone).isBone || child.type === 'Bone') {
            const bone = child as THREE.Bone;
            const bName = bone.name;
            if (bName === 'Head') foundBones.head = bone;
            else if (bName === 'Neck') foundBones.neck = bone;
            else if (bName === 'Spine2' || bName === 'Spine1') foundBones.chest = bone;
            else if (bName === 'LeftArm' || bName === 'LeftUpperArm') foundBones.leftArm = bone;
            else if (bName === 'LeftForeArm' || bName === 'LeftLowerArm') foundBones.leftForeArm = bone;
            else if (bName === 'LeftHand') foundBones.leftHand = bone;
            else if (bName === 'RightArm' || bName === 'RightUpperArm') foundBones.rightArm = bone;
            else if (bName === 'RightForeArm' || bName === 'RightLowerArm') foundBones.rightForeArm = bone;
            else if (bName === 'RightHand') foundBones.rightHand = bone;
          }
        });

        for (const [key, bone] of Object.entries(foundBones)) {
          initialRot[key] = {
            x: bone.rotation.x,
            y: bone.rotation.y,
            z: bone.rotation.z
          };
        }

        // Position hands in front of pant pockets
        if (foundBones.leftArm) {
          foundBones.leftArm.rotation.set(0.32, 0.15, -1.32);
        }
        if (foundBones.leftForeArm) {
          foundBones.leftForeArm.rotation.set(0.38, -0.22, 0.22);
        }
        if (foundBones.leftHand) {
          foundBones.leftHand.rotation.set(0.15, 0.10, -0.10);
        }
        if (foundBones.rightArm) {
          foundBones.rightArm.rotation.set(0.32, -0.15, 1.32);
        }
        if (foundBones.rightForeArm) {
          foundBones.rightForeArm.rotation.set(0.38, 0.22, -0.22);
        }
        if (foundBones.rightHand) {
          foundBones.rightHand.rotation.set(0.15, -0.10, 0.10);
        }

        bonesRef.current = foundBones;
        initialBonesRef.current = initialRot;

        // Auto center bounding box
        const bbox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        model.position.sub(center);

        // Move Avatar Upward to fill frame and eliminate blank area above head
        model.position.y -= 0.35;
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

        // Arms & Hands positioned tight & close to the body
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-0.17, -0.06, 0.04);
        avatarGroup.add(leftArmGroup);

        const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.65, 16), suitMat);
        leftArm.rotation.z = 0.03;
        leftArm.rotation.x = 0.20;
        leftArmGroup.add(leftArm);

        const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), skinMat);
        leftHand.position.set(0.01, -0.34, 0.05);
        leftArmGroup.add(leftHand);

        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.17, -0.06, 0.04);
        avatarGroup.add(rightArmGroup);

        const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.65, 16), suitMat);
        rightArm.rotation.z = -0.03;
        rightArm.rotation.x = 0.20;
        rightArmGroup.add(rightArm);

        const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), skinMat);
        rightHand.position.set(-0.01, -0.34, 0.05);
        rightArmGroup.add(rightHand);

        // Legs (Down to knees)
        const legsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.6, 32), suitMat);
        legsMesh.position.set(0, -0.75, 0);
        avatarGroup.add(legsMesh);

        // Setup morph mesh ref for jaw animation
        morphMeshesRef.current = [jawMesh as any];
        jawMesh.morphTargetDictionary = { mouthopen: 0, viseme_aa: 0 };
        jawMesh.morphTargetInfluences = [0, 0];

        avatarGroup.position.y += 0.12;

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

      // 5. Enforce Hands & Arms Positioned dynamically according to armPoseRef Every Frame
      const armBreath = Math.sin(time * 2.2) * 0.015;
      const talkGesture = talking ? Math.sin(time * 7) * 0.03 : 0;
      const currentPose = armPoseRef.current;

      if (currentPose === 'elbows_front') {
        // Original GLTF pose with elbows angled forward & lowered slightly below
        if (bones.leftArm && initBones.leftArm) {
          bones.leftArm.rotation.set(
            initBones.leftArm.x + 0.18 + armBreath + talkGesture,
            initBones.leftArm.y + 0.08,
            initBones.leftArm.z
          );
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm && initBones.leftForeArm) {
          bones.leftForeArm.rotation.set(
            initBones.leftForeArm.x + 0.15 + armBreath * 0.5,
            initBones.leftForeArm.y,
            initBones.leftForeArm.z
          );
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand && initBones.leftHand) {
          bones.leftHand.rotation.set(initBones.leftHand.x + 0.08, initBones.leftHand.y, initBones.leftHand.z);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm && initBones.rightArm) {
          bones.rightArm.rotation.set(
            initBones.rightArm.x + 0.18 + armBreath + talkGesture,
            initBones.rightArm.y - 0.08,
            initBones.rightArm.z
          );
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm && initBones.rightForeArm) {
          bones.rightForeArm.rotation.set(
            initBones.rightForeArm.x + 0.15 + armBreath * 0.5,
            initBones.rightForeArm.y,
            initBones.rightForeArm.z
          );
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand && initBones.rightHand) {
          bones.rightHand.rotation.set(initBones.rightHand.x + 0.08, initBones.rightHand.y, initBones.rightHand.z);
          bones.rightHand.updateMatrix();
        }
      } else if (currentPose === 'behind_back') {
        // Hands Positioned Behind Back / Opposite to Stomach
        if (bones.leftArm) {
          bones.leftArm.rotation.set(-0.45 + armBreath + talkGesture, -0.25, -1.35);
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm) {
          bones.leftForeArm.rotation.set(-0.40 + armBreath * 0.5, 0.45, -0.25);
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand) {
          bones.leftHand.rotation.set(-0.15, -0.20, 0.10);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm) {
          bones.rightArm.rotation.set(-0.45 + armBreath + talkGesture, 0.25, 1.35);
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.set(-0.40 + armBreath * 0.5, -0.45, 0.25);
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand) {
          bones.rightHand.rotation.set(-0.15, 0.20, -0.10);
          bones.rightHand.updateMatrix();
        }
      } else if (currentPose === 'front_stomach') {
        // Hands Positioned In Front of Stomach
        if (bones.leftArm) {
          bones.leftArm.rotation.set(0.50 + armBreath + talkGesture, 0.30, -1.20);
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm) {
          bones.leftForeArm.rotation.set(0.55 + armBreath * 0.5, -0.60, 0.35);
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand) {
          bones.leftHand.rotation.set(0.30, 0.20, -0.15);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm) {
          bones.rightArm.rotation.set(0.50 + armBreath + talkGesture, -0.30, 1.20);
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.set(0.55 + armBreath * 0.5, 0.60, -0.35);
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand) {
          bones.rightHand.rotation.set(0.30, -0.20, 0.15);
          bones.rightHand.updateMatrix();
        }
      } else if (currentPose === 'default_gltf') {
        // Original GLTF model pose as loaded from david.glb
        if (bones.leftArm && initBones.leftArm) {
          bones.leftArm.rotation.set(
            initBones.leftArm.x + armBreath + talkGesture,
            initBones.leftArm.y,
            initBones.leftArm.z
          );
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm && initBones.leftForeArm) {
          bones.leftForeArm.rotation.set(
            initBones.leftForeArm.x + armBreath * 0.5,
            initBones.leftForeArm.y,
            initBones.leftForeArm.z
          );
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand && initBones.leftHand) {
          bones.leftHand.rotation.set(initBones.leftHand.x, initBones.leftHand.y, initBones.leftHand.z);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm && initBones.rightArm) {
          bones.rightArm.rotation.set(
            initBones.rightArm.x + armBreath + talkGesture,
            initBones.rightArm.y,
            initBones.rightArm.z
          );
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm && initBones.rightForeArm) {
          bones.rightForeArm.rotation.set(
            initBones.rightForeArm.x + armBreath * 0.5,
            initBones.rightForeArm.y,
            initBones.rightForeArm.z
          );
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand && initBones.rightHand) {
          bones.rightHand.rotation.set(initBones.rightHand.x, initBones.rightHand.y, initBones.rightHand.z);
          bones.rightHand.updateMatrix();
        }
      } else if (currentPose === 'joined_palms') {
        // Namaste / Joined Palms Pose (Lowered down to waist level close to body)
        if (bones.leftArm) {
          bones.leftArm.rotation.set(0.40 + armBreath + talkGesture, 0.35, -1.15);
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm) {
          bones.leftForeArm.rotation.set(0.35 + armBreath * 0.5, -0.65, 0.30);
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand) {
          bones.leftHand.rotation.set(0.15, 0.50, -0.20);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm) {
          bones.rightArm.rotation.set(0.40 + armBreath + talkGesture, -0.35, 1.15);
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.set(0.35 + armBreath * 0.5, 0.65, -0.30);
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand) {
          bones.rightHand.rotation.set(0.15, -0.50, 0.20);
          bones.rightHand.updateMatrix();
        }
      } else {
        let armX = 0.15;
        let forearmX = 0.20;
        let forearmY = -0.15;
        let handX = 0.85;

        if (currentPose === 'front_pockets') {
          armX = 0.55;
          forearmX = 0.65;
          forearmY = -0.40;
          handX = 0.25;
        } else if (currentPose === 'front_face') {
          armX = 1.35;
          forearmX = 1.45;
          forearmY = -0.65;
          handX = 0.50;
        } else if (currentPose === 'natural_sides') {
          armX = 0.05;
          forearmX = 0.15;
          forearmY = -0.10;
          handX = 0.05;
        }

        if (bones.leftArm) {
          bones.leftArm.rotation.set(armX + armBreath + talkGesture, 0.05, -1.45);
          bones.leftArm.updateMatrix();
        }
        if (bones.leftForeArm) {
          bones.leftForeArm.rotation.set(forearmX + armBreath * 0.5, forearmY, 0.12);
          bones.leftForeArm.updateMatrix();
        }
        if (bones.leftHand) {
          bones.leftHand.rotation.set(handX, 0.08, -0.05);
          bones.leftHand.updateMatrix();
        }

        if (bones.rightArm) {
          bones.rightArm.rotation.set(armX + armBreath + talkGesture, -0.05, 1.45);
          bones.rightArm.updateMatrix();
        }
        if (bones.rightForeArm) {
          bones.rightForeArm.rotation.set(forearmX + armBreath * 0.5, -forearmY, -0.12);
          bones.rightForeArm.updateMatrix();
        }
        if (bones.rightHand) {
          bones.rightHand.rotation.set(handX, -0.08, 0.05);
          bones.rightHand.updateMatrix();
        }
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
