"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';

const BASE_APPLES = [
  { x: 0.25, y: 0.25 },
  { x: 0.35, y: 0.2 },
  { x: 0.2, y: 0.35 }
];

const BASE_ORANGES = [
  { x: 0.75, y: 0.75 },
  { x: 0.8, y: 0.65 },
  { x: 0.65, y: 0.85 }
];

// Test fruits that drop during the safety test
const TEST_FRUITS = [
  { type: 'apple', emoji: '🍎', x: 0.42, y: 0.42 }, // Wobbling apple near boundary
  { type: 'orange', emoji: '🍊', x: 0.58, y: 0.58 } // Wobbling orange near boundary
];

export default function Stage3_FenceSafety({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  const [lineOffset, setLineOffset] = useState(0.35); // 0.35 is risky (close to apples), 0.5 is safe
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // 'fail' | 'pass'
  const [testFruits, setTestFruits] = useState([]);

  const [stepState, setStepState] = useState('position'); // 'position' | 'testing' | 'question' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  // Distances to nearest Apple and Orange relative to lineOffset
  // Nearest apple is around y = 0.35, nearest orange is around y = 0.65
  const appleDistUnits = Math.round(Math.abs(lineOffset - 0.25) * 200);
  const orangeDistUnits = Math.round(Math.abs(0.75 - lineOffset) * 200);
  const isBalanced = Math.abs(appleDistUnits - orangeDistUnits) <= 12;

  const handleTestFence = () => {
    setIsTesting(true);
    soundFX.playPop();
    setStepState('testing');
    setTestFruits([]);

    // Animate falling test fruits
    setTimeout(() => {
      setTestFruits(TEST_FRUITS);
      // Evaluate line position: offset 0.46 to 0.54 is safe (middle position)
      if (lineOffset >= 0.45 && lineOffset <= 0.55) {
        setTestResult('pass');
        soundFX.playSuccess();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setStepState('question'), 1000);
      } else {
        setTestResult('fail');
        soundFX.playPop();
      }
      setIsTesting(false);
    }, 600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Line across canvas (slope = -1)
    const cy = h * lineOffset;

    const p1x = 0;
    const p1y = cy + w * 0.5;
    const p2x = w;
    const p2y = cy - w * 0.5;

    // Draw Fence Line
    ctx.strokeStyle = testResult === 'pass' ? '#10b981' : testResult === 'fail' ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Draw Handle at center of fence
    const midX = w * 0.5;
    const midY = cy;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = testResult === 'pass' ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(midX, midY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Distance Rulers / Measurement Lines from Fence to Nearest Apple and Orange
    const nearestApple = { x: 0.35 * w, y: 0.25 * h };
    const nearestOrange = { x: 0.65 * w, y: 0.75 * h };

    // Distance vector 1: Apple to line (perpendicular projection to y + x = cy_norm)
    ctx.save();
    ctx.strokeStyle = isBalanced ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Apple distance line
    const appleLineY = cy - (nearestApple.x - w * 0.5);
    ctx.beginPath();
    ctx.moveTo(nearestApple.x, nearestApple.y);
    ctx.lineTo(nearestApple.x, appleLineY);
    ctx.stroke();

    // Orange distance line
    const orangeLineY = cy - (nearestOrange.x - w * 0.5);
    ctx.beginPath();
    ctx.moveTo(nearestOrange.x, nearestOrange.y);
    ctx.lineTo(nearestOrange.x, orangeLineY);
    ctx.stroke();

    ctx.restore();

    // Distance Label Badges on Canvas
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apple dist text badge
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(nearestApple.x - 45, (nearestApple.y + appleLineY) / 2 - 12, 90, 24);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`🍎 ${appleDistUnits} units`, nearestApple.x, (nearestApple.y + appleLineY) / 2);

    // Orange dist text badge
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(nearestOrange.x - 45, (nearestOrange.y + orangeLineY) / 2 - 12, 90, 24);
    ctx.fillStyle = '#f97316';
    ctx.fillText(`🍊 ${orangeDistUnits} units`, nearestOrange.x, (nearestOrange.y + orangeLineY) / 2);

    // Draw Base Fruits
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    BASE_APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    BASE_ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

    // Draw Test Fruits if dropped
    testFruits.forEach(t => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10;
      ctx.fillText(t.emoji, t.x * w, t.y * h);
      ctx.restore();
    });

  }, [lineOffset, testFruits, testResult, appleDistUnits, orangeDistUnits, isBalanced]);

  const handlePointerDown = (e) => {
    if (stepState !== 'position' && testResult !== 'fail') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const normY = Math.max(0.25, Math.min(0.75, my / rect.height));

    setLineOffset(normY);
    setTestResult(null);
    if (stepState === 'testing') setStepState('position');
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

      {/* Real-time Distance Balance HUD Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(12px)',
        border: `2px solid ${isBalanced ? '#10b981' : '#f97316'}`,
        padding: '10px 20px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.95rem' }}>
          🍎 Dist: <strong>{appleDistUnits}</strong>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>|</div>
        <div style={{ color: isBalanced ? '#10b981' : '#f59e0b', fontWeight: 'bold', fontSize: '0.95rem' }}>
          {isBalanced ? '⚖️ Balanced Safest Middle!' : appleDistUnits < orangeDistUnits ? '⚠️ Risky: Too close to Apples!' : '⚠️ Risky: Too close to Oranges!'}
        </div>
        <div style={{ color: 'var(--text-muted)' }}>|</div>
        <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.95rem' }}>
          🍊 Dist: <strong>{orangeDistUnits}</strong>
        </div>
      </div>

      {stepState === 'position' && (
        <DialogueBox
          mascot="🛡️"
          promptText="Move the fence into the middle! Watch the distances equal out, then tap 'Test Fence Safety'."
          onNext={handleTestFence}
          nextBtnText="Test Fence Safety!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'testing' && testResult === null && (
        <DialogueBox
          mascot="🚀"
          promptText="Dropping new mystery fruits to test your fence..."
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {testResult === 'fail' && (
        <DialogueBox
          mascot="😟"
          promptText="Uh oh! The fence was too close to one side and failed! Adjust it so the distances are balanced."
          onReset={() => { setStepState('position'); setTestResult(null); }}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🎉"
          promptText="Your fence passed! Why did placing the fence right in the middle succeed?"
          options={[
            { text: 'The middle fence leaves extra room for surprise fruits!' },
            { text: 'It was just luck.' }
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
          promptText="Spot on! This dividing fence that decides where new fruits belong is called a Decision Boundary."
          unlockedTerm="Decision Boundary"
          onNext={() => onCompleteStage(3)}
          nextBtnText="Unlock Stage 4"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
