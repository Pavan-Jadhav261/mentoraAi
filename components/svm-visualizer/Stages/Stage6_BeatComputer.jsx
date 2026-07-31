"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';
import { Star, Zap } from 'lucide-react';

const APPLES = [
  { x: 0.2, y: 0.2 },
  { x: 0.35, y: 0.25 },
  { x: 0.25, y: 0.4 }
];

const ORANGES = [
  { x: 0.75, y: 0.75 },
  { x: 0.85, y: 0.65 },
  { x: 0.65, y: 0.85 }
];

export default function Stage6_BeatComputer({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  const [userOffset, setUserOffset] = useState(0.42); // 0.5 is optimal
  const [isScanning, setIsScanning] = useState(false);
  const [scanAngle, setScanAngle] = useState(0);
  const [aiFound, setAiFound] = useState(false);

  const [stepState, setStepState] = useState('position'); // 'position' | 'scanning' | 'results' | 'discovered'

  // Safety Score: 0.5 is 100%, 0.42 is ~84%
  const closenessPercent = Math.round(100 - Math.abs(userOffset - 0.5) * 200);

  const handleStartAIScan = () => {
    setIsScanning(true);
    setStepState('scanning');
    soundFX.playRadarSweep();

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setScanAngle(prev => prev + 0.3);
      soundFX.playRadarSweep();

      if (count > 12) {
        clearInterval(interval);
        setIsScanning(false);
        setUserOffset(0.5); // Snap to optimal
        setAiFound(true);
        soundFX.playSnap();
        soundFX.playSuccess();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setStepState('results');
      }
    }, 120);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // If scanning, draw sweeping candidate radar lines
    if (isScanning) {
      ctx.save();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;

      for (let i = 0; i < 6; i++) {
        const offset = 0.2 + (i * 0.12) + Math.sin(scanAngle + i) * 0.05;
        const cy = h * offset;
        ctx.beginPath();
        ctx.moveTo(0, cy + w * 0.4);
        ctx.lineTo(w, cy - w * 0.4);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Fence Line
    const cy = h * userOffset;
    const p1x = 0;
    const p1y = cy + w * 0.5;
    const p2x = w;
    const p2y = cy - w * 0.5;

    ctx.strokeStyle = aiFound ? '#10b981' : '#3b82f6';
    ctx.lineWidth = aiFound ? 8 : 6;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Handle
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = aiFound ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w * 0.5, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Fruits
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

  }, [userOffset, isScanning, scanAngle, aiFound]);

  const handlePointerDown = (e) => {
    if (stepState !== 'position') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const normY = Math.max(0.3, Math.min(0.7, my / rect.height));
    setUserOffset(normY);
    soundFX.playPop();
  };

  return (
    <div className="interactive-canvas-wrapper" onPointerDown={handlePointerDown}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {/* Safety Score Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '12px 20px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 20
      }}>
        <Zap size={20} color="#f59e0b" />
        <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#ffffff' }}>
          Your Safety Score:
        </span>
        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={18}
              fill={star <= Math.ceil(closenessPercent / 20) ? '#f59e0b' : 'none'}
            />
          ))}
        </div>
      </div>

      {stepState === 'position' && (
        <DialogueBox
          mascot="🏆"
          promptText="Position your safest fence, then press 'Let AI Search' to see how close you got!"
          onNext={handleStartAIScan}
          nextBtnText="Let AI Search!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'scanning' && (
        <DialogueBox
          mascot="📡"
          promptText="AI radar scanning candidate fences across space..."
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'results' && (
        <DialogueBox
          mascot="🎉"
          promptText={`Amazing! You were ${closenessPercent}% close to the mathematically optimal maximum-margin fence!`}
          onNext={() => setStepState('discovered')}
          nextBtnText="Continue"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'discovered' && (
        <DialogueBox
          mascot="✨"
          promptText="You now know how SVM algorithms work! They search for the boundary that maximizes the margin."
          unlockedTerm="Optimal Hyperplane"
          onNext={() => onCompleteStage(6)}
          nextBtnText="Unlock Stage 7"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
