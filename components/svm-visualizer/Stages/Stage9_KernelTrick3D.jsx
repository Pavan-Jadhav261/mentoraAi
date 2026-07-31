"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';

export default function Stage9_KernelTrick3D({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const mountRef = useRef(null);
  const [liftProgress, setLiftProgress] = useState(0); // 0 (flat 2D) to 1 (full 3D mountain)
  const [showSlicingPlane, setShowSlicingPlane] = useState(false);

  const [stepState, setStepState] = useState('flat_prompt'); // 'flat_prompt' | 'lifting' | 'sliced' | 'question' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Match app dark theme

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 12, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 3. Deformable Surface Mesh (The 3D Mountain)
    const gridSize = 40;
    const planeGeo = new THREE.PlaneGeometry(16, 16, gridSize, gridSize);
    planeGeo.rotateX(-Math.PI / 2);

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      wireframe: true,
      emissive: 0x0f172a,
      roughness: 0.4
    });

    const mesh = new THREE.Mesh(planeGeo, planeMat);
    scene.add(mesh);

    // Store base vertices for morphing
    const posAttr = planeGeo.attributes.position;
    const basePositions = posAttr.array.slice();

    // 4. Create 3D Fruit Markers
    const fruitsGroup = new THREE.Group();
    scene.add(fruitsGroup);

    // Create Canvas Texture for Apple & Orange Sprites
    const createEmojiSprite = (emoji) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.font = '90px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.5, 1.5, 1);
      return sprite;
    };

    // Inner Apples
    const appleData = [
      { x: 0, z: 0 },
      { x: 1.2, z: 1.2 },
      { x: -1.2, z: 1.0 },
      { x: 1.0, z: -1.2 },
      { x: -1.0, z: -1.0 }
    ];

    const appleSprites = appleData.map(d => {
      const s = createEmojiSprite('🍎');
      s.userData = { baseX: d.x, baseZ: d.z, type: 'apple' };
      fruitsGroup.add(s);
      return s;
    });

    // Outer Oranges
    const orangeData = Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 5.5;
      return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    });

    const orangeSprites = orangeData.map(d => {
      const s = createEmojiSprite('🍊');
      s.userData = { baseX: d.x, baseZ: d.z, type: 'orange' };
      fruitsGroup.add(s);
      return s;
    });

    // 5. Horizontal Slicing Plane Sheet
    const sliceGeo = new THREE.PlaneGeometry(18, 18);
    sliceGeo.rotateX(-Math.PI / 2);
    const sliceMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const sliceMesh = new THREE.Mesh(sliceGeo, sliceMat);
    sliceMesh.position.y = 2.8;
    sliceMesh.visible = false;
    scene.add(sliceMesh);

    // 6. Animation Loop
    let reqId;
    let angleCam = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Slow cinematic camera rotation around origin
      angleCam += 0.005;
      camera.position.x = Math.sin(angleCam) * 18;
      camera.position.z = Math.cos(angleCam) * 18;
      camera.lookAt(0, 1.5, 0);

      // Morph Mountain Geometry based on liftProgress
      const currentLift = mesh.userData.lift || 0;
      for (let i = 0; i < posAttr.count; i++) {
        const x = basePositions[i * 3];
        const z = basePositions[i * 3 + 2];
        const distSq = x * x + z * z;
        // Gaussian 3D peak at center: z_height = 5 * exp(-distSq / 12)
        const heightVal = Math.exp(-distSq / 14) * 5 * currentLift;
        posAttr.setY(i, heightVal);
      }
      posAttr.needsUpdate = true;

      // Update fruit heights
      [...appleSprites, ...orangeSprites].forEach(s => {
        const { baseX, baseZ } = s.userData;
        const distSq = baseX * baseX + baseZ * baseZ;
        const heightVal = Math.exp(-distSq / 14) * 5 * currentLift + 0.8;
        s.position.set(baseX, heightVal, baseZ);
      });

      // Update slicing plane visibility
      sliceMesh.visible = mesh.userData.showSlice || false;

      renderer.render(scene, camera);
    };

    animate();

    mesh.userData.meshRef = mesh;
    container.userData = { scene, mesh, sliceMesh };

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleLiftWorld = () => {
    soundFX.playRadarSweep();
    setStepState('lifting');

    let p = 0;
    const interval = setInterval(() => {
      p += 0.05;
      setLiftProgress(p);

      const container = mountRef.current;
      if (container && container.userData.mesh) {
        container.userData.mesh.userData.lift = Math.min(1, p);
      }

      if (p >= 1) {
        clearInterval(interval);
        soundFX.playSuccess();
        setTimeout(() => {
          if (container && container.userData.sliceMesh) {
            container.userData.sliceMesh.userData.showSlice = true;
            setShowSlicingPlane(true);
            soundFX.playSnap();
            confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
          }
          setStepState('sliced');
        }, 500);
      }
    }, 50);
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    soundFX.playSuccess();
    setStepState('discovered');
  };

  return (
    <div className="interactive-canvas-wrapper" style={{ cursor: 'grab' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {stepState === 'flat_prompt' && (
        <DialogueBox
          mascot="🌋"
          promptText="Ready for the ultimate trick? Tap 'Lift the World into 3D' to warp space!"
          onNext={handleLiftWorld}
          nextBtnText="Lift the World into 3D!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'lifting' && (
        <DialogueBox
          mascot="🚀"
          promptText="Lifting center apples into 3D height..."
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'sliced' && (
        <DialogueBox
          mascot="🎉"
          promptText="LOOK! A simple flat sheet sliced perfectly right under the mountain top!"
          onNext={() => setStepState('question')}
          nextBtnText="Continue"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🤔"
          promptText="What changed when we popped the flat 2D world into 3D space?"
          options={[
            { text: 'Adding height (3rd dimension) allowed a flat plane to slice between them!' },
            { text: 'Nothing changed.' }
          ]}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'discovered' && (
        <DialogueBox
          mascot="🏆"
          promptText="YOU DID IT! When data is impossible to separate in 2D, we lift it into 3D using a Kernel Trick!"
          unlockedTerm="The Kernel Trick"
          onNext={() => onCompleteStage(9)}
          nextBtnText="Complete Quest! 🎉"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
