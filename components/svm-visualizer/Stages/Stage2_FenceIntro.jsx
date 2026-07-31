"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';

// Fixed fruit positions for stage 2
const APPLES = [
  { id: 'a1', x: 0.25, y: 0.25 },
  { id: 'a2', x: 0.35, y: 0.2 },
  { id: 'a3', x: 0.2, y: 0.4 },
  { id: 'a4', x: 0.3, y: 0.35 }
];

const ORANGES = [
  { id: 'o1', x: 0.7, y: 0.75 },
  { id: 'o2', x: 0.8, y: 0.65 },
  { id: 'o3', x: 0.65, y: 0.85 },
  { id: 'o4', x: 0.75, y: 0.8 }
];

export default function Stage2_FenceIntro({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  // Fence line parameters: y = m * x + c
  const [lineAngle, setLineAngle] = useState(-0.8); // Radians
  const [lineOffset, setLineOffset] = useState(0.5); // Center normalized offset (0 to 1)

  const [isDraggingHandle, setIsDraggingHandle] = useState(null);
  const [validFencesCount, setValidFencesCount] = useState(0);

  const [stepState, setStepState] = useState('explore'); // 'explore' | 'question' | 'curious'
  const [selectedOption, setSelectedOption] = useState(null);

  // Check if current line separates apples & oranges perfectly
  const checkSeparation = (angle, offset) => {
    // Normal vector to the line
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    // Point on the line: (0.5, offset)
    const px = 0.5;
    const py = offset;

    const getSide = (pt) => (pt.x - px) * nx + (pt.y - py) * ny;

    const appleSides = APPLES.map(getSide);
    const orangeSides = ORANGES.map(getSide);

    const allApplesPositive = appleSides.every(s => s > 0.04);
    const allOrangesNegative = orangeSides.every(s => s < -0.04);

    const allApplesNegative = appleSides.every(s => s < -0.04);
    const allOrangesPositive = orangeSides.every(s => s > 0.04);

    return (allApplesPositive && allOrangesNegative) || (allApplesNegative && allOrangesPositive);
  };

  const isCurrentValid = checkSeparation(lineAngle, lineOffset);

  useEffect(() => {
    if (isCurrentValid) {
      soundFX.playPop();
      setValidFencesCount(prev => Math.min(5, prev + 1));
    }
  }, [lineAngle, lineOffset, isCurrentValid]);

  useEffect(() => {
    if (validFencesCount >= 3 && stepState === 'explore') {
      soundFX.playSuccess();
      setStepState('question');
    }
  }, [validFencesCount, stepState]);

  // Render Canvas graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Line endpoints
    const nx = Math.cos(lineAngle);
    const ny = Math.sin(lineAngle);
    const dirX = -ny;
    const dirY = nx;

    const cx = w * 0.5;
    const cy = h * lineOffset;

    const p1x = cx + dirX * w * 1.5;
    const p1y = cy + dirY * h * 1.5;
    const p2x = cx - dirX * w * 1.5;
    const p2y = cy - dirY * h * 1.5;

    // Draw Line aura glow if valid
    if (isCurrentValid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Main Fence Line
    ctx.strokeStyle = isCurrentValid ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Draw Drag Handles on the line
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = isCurrentValid ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 4;

    // Center handle
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Angle handle
    const handleAngleX = cx + dirX * 120;
    const handleAngleY = cy + dirY * 120;
    ctx.beginPath();
    ctx.arc(handleAngleX, handleAngleY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Fruits
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

  }, [lineAngle, lineOffset, isCurrentValid]);

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const cx = w * 0.5;
    const cy = h * lineOffset;

    const distCenter = Math.hypot(mx - cx, my - cy);
    if (distCenter < 24) {
      setIsDraggingHandle('offset');
      return;
    }

    const dirX = -Math.sin(lineAngle);
    const dirY = Math.cos(lineAngle);
    const hx = cx + dirX * 120;
    const hy = cy + dirY * 120;

    const distAngle = Math.hypot(mx - hx, my - hy);
    if (distAngle < 20) {
      setIsDraggingHandle('angle');
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingHandle || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    if (isDraggingHandle === 'offset') {
      const normY = Math.max(0.1, Math.min(0.9, my / h));
      setLineOffset(normY);
    } else if (isDraggingHandle === 'angle') {
      const cx = w * 0.5;
      const cy = h * lineOffset;
      const dx = mx - cx;
      const dy = my - cy;
      const newAngle = Math.atan2(dx, -dy);
      setLineAngle(newAngle);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingHandle(null);
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    soundFX.playSuccess();
    setStepState('curious');
  };

  return (
    <div
      className="interactive-canvas-wrapper"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {stepState === 'explore' && (
        <DialogueBox
          mascot="📏"
          promptText="Drag the white handles on the fence to separate the apples from the oranges!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🤔"
          promptText="Notice how MANY different fences glow green! Do you think all these fences are equally good?"
          options={[
            { text: 'Yes, any line that separates them is fine!' },
            { text: 'No, some fences might be safer than others!' }
          ]}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'curious' && (
        <DialogueBox
          mascot="💡"
          promptText="Interesting thought! Let's put these fences to the test in the next stage to see what happens when new fruits appear!"
          onNext={() => onCompleteStage(2)}
          nextBtnText="Test Fences in Stage 3"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
