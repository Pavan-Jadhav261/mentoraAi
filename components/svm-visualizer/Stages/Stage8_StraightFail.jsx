"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';

// Inner circle of apples
const INNER_APPLES = [
  { x: 0.5, y: 0.5 },
  { x: 0.45, y: 0.45 },
  { x: 0.55, y: 0.45 },
  { x: 0.45, y: 0.55 },
  { x: 0.55, y: 0.55 }
];

// Outer ring of oranges
const OUTER_ORANGES = Array.from({ length: 8 }).map((_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  const radius = 0.32;
  return {
    x: 0.5 + Math.cos(angle) * radius,
    y: 0.5 + Math.sin(angle) * radius
  };
});

export default function Stage8_StraightFail({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  const [lineAngle, setLineAngle] = useState(0);
  const [lineOffset, setLineOffset] = useState(0.5);
  const [attempts, setAttempts] = useState(0);

  const [stepState, setStepState] = useState('try_fence'); // 'try_fence' | 'failed_prompt' | 'question' | 'curious'
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (attempts >= 3 && stepState === 'try_fence') {
      soundFX.playPop();
      setStepState('question');
    }
  }, [attempts, stepState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Draw Fence Line (Always cuts through because circle is unseparable in 2D by a straight line)
    const nx = Math.cos(lineAngle);
    const ny = Math.sin(lineAngle);
    const dirX = -ny;
    const dirY = nx;

    const cx = w * 0.5;
    const cy = h * lineOffset;

    const p1x = cx + dirX * w;
    const p1y = cy + dirY * h;
    const p2x = cx - dirX * w;
    const p2y = cy - dirY * h;

    // Red line indicator showing failure
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Confusion emoji at center of fence
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('😵', cx, cy);

    // Draw Fruits
    ctx.font = '38px sans-serif';

    INNER_APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    OUTER_ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

  }, [lineAngle, lineOffset]);

  const handlePointerDown = (e) => {
    if (stepState !== 'try_fence') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const normY = Math.max(0.2, Math.min(0.8, my / rect.height));

    setLineOffset(normY);
    setLineAngle(prev => prev + 0.5);
    setAttempts(prev => prev + 1);
    soundFX.playPop();
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    soundFX.playSuccess();
    setStepState('curious');
  };

  return (
    <div className="interactive-canvas-wrapper" onPointerDown={handlePointerDown}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {stepState === 'try_fence' && (
        <DialogueBox
          mascot="🌀"
          promptText="Try dragging the straight fence line to separate the inner apples from the outer oranges!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🤔"
          promptText="No matter how you angle it, every straight line cuts through! Maybe... the problem isn't YOU. Maybe a 2D flat world is impossible for a straight fence!"
          options={[
            { text: 'You are right! A 2D straight fence can never separate an inner circle from an outer ring.' },
            { text: 'Keep trying straight lines.' }
          ]}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'curious' && (
        <DialogueBox
          mascot="🚀"
          promptText="What if we could LIFT the world into 3D? Let's pop into 3D space in Stage 9!"
          onNext={() => onCompleteStage(8)}
          nextBtnText="Lift the World in Stage 9!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
