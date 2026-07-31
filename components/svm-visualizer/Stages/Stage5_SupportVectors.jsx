"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';

const INITIAL_FRUITS = [
  // Support vectors (nearest to boundary at offset 0.5)
  { id: 'sv1', type: 'apple', emoji: '🍎', x: 0.35, y: 0.35, isSupport: true },
  { id: 'sv2', type: 'orange', emoji: '🍊', x: 0.65, y: 0.65, isSupport: true },
  
  // Faraway background fruits
  { id: 'f1', type: 'apple', emoji: '🍎', x: 0.15, y: 0.15, isSupport: false },
  { id: 'f2', type: 'apple', emoji: '🍎', x: 0.2, y: 0.3, isSupport: false },
  { id: 'f3', type: 'orange', emoji: '🍊', x: 0.85, y: 0.85, isSupport: false },
  { id: 'f4', type: 'orange', emoji: '🍊', x: 0.8, y: 0.7, isSupport: false }
];

export default function Stage5_SupportVectors({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const containerRef = useRef(null);
  const [fruits, setFruits] = useState(INITIAL_FRUITS);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasTestedFar, setHasTestedFar] = useState(false);
  const [hasTestedNear, setHasTestedNear] = useState(false);

  const [stepState, setStepState] = useState('explore'); // 'explore' | 'question' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  // Dynamic line calculated from support vectors sv1 and sv2
  const sv1 = fruits.find(f => f.id === 'sv1');
  const sv2 = fruits.find(f => f.id === 'sv2');

  // Midpoint between support vectors determines line offset & slope
  const lineMidX = (sv1.x + sv2.x) / 2;
  const lineMidY = (sv1.y + sv2.y) / 2;

  useEffect(() => {
    if (hasTestedFar && hasTestedNear && stepState === 'explore') {
      soundFX.playSuccess();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      setTimeout(() => setStepState('question'), 600);
    }
  }, [hasTestedFar, hasTestedNear, stepState]);

  const handlePointerDown = (id, e) => {
    e.preventDefault();
    soundFX.playPop();
    setDraggedId(id);
    const rect = containerRef.current.getBoundingClientRect();
    const item = fruits.find(i => i.id === id);
    const itemX = item.x * rect.width;
    const itemY = item.y * rect.height;

    setDragOffset({
      x: e.clientX - rect.left - itemX,
      y: e.clientY - rect.top - itemY
    });

    if (item.isSupport) {
      setHasTestedNear(true);
    } else {
      setHasTestedFar(true);
    }
  };

  const handlePointerMove = (e) => {
    if (!draggedId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const mouseX = clientX - rect.left - dragOffset.x;
    const mouseY = clientY - rect.top - dragOffset.y;

    const normX = Math.max(0.1, Math.min(0.9, mouseX / rect.width));
    const normY = Math.max(0.1, Math.min(0.9, mouseY / rect.height));

    setFruits(prev => prev.map(f => f.id === draggedId ? { ...f, x: normX, y: normY } : f));
  };

  const handlePointerUp = () => {
    if (draggedId) {
      soundFX.playPop();
      setDraggedId(null);
    }
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    soundFX.playSuccess();
    setStepState('discovered');
  };

  // Render Fence Line SVG
  const angle = Math.atan2(sv2.y - sv1.y, sv2.x - sv1.x);
  const perpAngle = angle + Math.PI / 2;
  const dirX = Math.cos(perpAngle);
  const dirY = Math.sin(perpAngle);

  const p1x = (lineMidX + dirX * 1.5) * 100;
  const p1y = (lineMidY + dirY * 1.5) * 100;
  const p2x = (lineMidX - dirX * 1.5) * 100;
  const p2y = (lineMidY - dirY * 1.5) * 100;

  return (
    <div
      ref={containerRef}
      className="interactive-canvas-wrapper"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* SVG Fence Line */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line
          x1={`${p1x}%`}
          y1={`${p1y}%`}
          x2={`${p2x}%`}
          y2={`${p2y}%`}
          stroke="#3b82f6"
          strokeWidth="6"
        />
      </svg>

      {/* Render Fruits */}
      {fruits.map(fruit => (
        <div
          key={fruit.id}
          onPointerDown={(e) => handlePointerDown(fruit.id, e)}
          style={{
            position: 'absolute',
            left: `${fruit.x * 100}%`,
            top: `${fruit.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '3.2rem',
            cursor: 'grab',
            zIndex: draggedId === fruit.id ? 30 : 10,
            opacity: fruit.isSupport ? 1 : 0.45,
            filter: fruit.isSupport ? 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.9))' : 'none',
            transition: draggedId === fruit.id ? 'none' : 'all 0.2s ease',
            scale: draggedId === fruit.id ? 1.3 : fruit.isSupport ? 1.1 : 1
          }}
        >
          {fruit.emoji}
          {fruit.isSupport && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '1.2rem',
              animation: 'bounce 1.5s infinite'
            }}>✨</span>
          )}
        </div>
      ))}

      {stepState === 'explore' && (
        <DialogueBox
          mascot="✨"
          promptText="Try moving the glowing fruits vs the faded fruits. Watch which ones actually change the fence!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🎉"
          promptText="Did you see that? Which fruits actually controlled and held up the fence?"
          options={[
            { text: 'Only the glowing fruits sitting right on the edge!' },
            { text: 'All fruits controlled the fence equally.' }
          ]}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'discovered' && (
        <DialogueBox
          mascot="✨"
          promptText="Exactly! The key items sitting right on the edge of the cushion are called Support Vectors. They support the entire boundary."
          unlockedTerm="Support Vectors"
          onNext={() => onCompleteStage(5)}
          nextBtnText="Unlock Stage 6"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
