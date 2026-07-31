"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';

const APPLES = [
  { x: 0.25, y: 0.25 },
  { x: 0.35, y: 0.2 },
  { x: 0.3, y: 0.35 }
];

const ORANGES = [
  { x: 0.75, y: 0.75 },
  { x: 0.8, y: 0.65 },
  { x: 0.65, y: 0.85 }
];

export default function Stage4_SafetyGap({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  const [lineOffset, setLineOffset] = useState(0.35); // 0.5 is optimal wide margin
  const [maxGapAchieved, setMaxGapAchieved] = useState(false);

  const [stepState, setStepState] = useState('explore'); // 'explore' | 'question' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  // Calculate gap width based on distance from nearest apple (around 0.3) and orange (around 0.7)
  // Distance to nearest fruit: min(offset - 0.35, 0.65 - offset)
  const distToApple = Math.max(0.02, lineOffset - 0.35);
  const distToOrange = Math.max(0.02, 0.65 - lineOffset);
  const currentMargin = Math.min(distToApple, distToOrange);

  const isWideMargin = currentMargin >= 0.14; // Near middle (offset 0.5)

  useEffect(() => {
    if (isWideMargin && !maxGapAchieved) {
      setMaxGapAchieved(true);
      soundFX.playSuccess();
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setStepState('question'), 800);
    }
  }, [isWideMargin, maxGapAchieved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    const cy = h * lineOffset;
    const p1x = 0;
    const p1y = cy + w * 0.5;
    const p2x = w;
    const p2y = cy - w * 0.5;

    // Draw Balloon Glowing Margin Aura (Parallel bands)
    const marginPx = currentMargin * h * 1.6;

    ctx.save();
    ctx.fillStyle = isWideMargin ? 'rgba(168, 85, 247, 0.25)' : 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    // Offset line 1
    ctx.moveTo(p1x, p1y - marginPx);
    ctx.lineTo(p2x, p2y - marginPx);
    // Offset line 2
    ctx.lineTo(p2x, p2y + marginPx);
    ctx.lineTo(p1x, p1y + marginPx);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Margin Outer Dashed Lines
    ctx.strokeStyle = isWideMargin ? '#a855f7' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    
    ctx.beginPath();
    ctx.moveTo(p1x, p1y - marginPx);
    ctx.lineTo(p2x, p2y - marginPx);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p1x, p1y + marginPx);
    ctx.lineTo(p2x, p2y + marginPx);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash

    // Draw Main Fence Line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Handle
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w * 0.5, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Fruits
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

    // Display Gap Indicator Emoji
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = isWideMargin ? '#10b981' : '#f97316';
    const statusText = isWideMargin ? 'Wide Safety Gap 😊' : 'Narrow Gap 😟';
    ctx.fillText(statusText, w * 0.5, 40);

  }, [lineOffset, currentMargin, isWideMargin]);

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const normY = Math.max(0.3, Math.min(0.7, my / rect.height));
    setLineOffset(normY);
    soundFX.playPop();
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    soundFX.playSuccess();
    setStepState('discovered');
  };

  return (
    <div className="interactive-canvas-wrapper" onPointerDown={handlePointerDown}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {stepState === 'explore' && (
        <DialogueBox
          mascot="🎈"
          promptText="Move the fence up and down. Watch how the purple safety gap inflates like a balloon!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🎉"
          promptText="You found the widest gap! What happens to the glowing safety cushion when the fence is perfectly centered?"
          options={[
            { text: 'The empty safety cushion grows as big as possible!' },
            { text: 'The empty space shrinks to zero.' }
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
          promptText="Exactly! This empty safety cushion has an official name. It is called the Margin."
          unlockedTerm="Margin"
          onNext={() => onCompleteStage(4)}
          nextBtnText="Unlock Stage 5"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
