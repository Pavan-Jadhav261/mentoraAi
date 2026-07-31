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

export default function Stage7_Prediction({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const canvasRef = useRef(null);
  const [mysteryPoint, setMysteryPoint] = useState(null); // { x, y }
  const [predictedFruit, setPredictedFruit] = useState(null); // 'apple' | 'orange'

  const [stepState, setStepState] = useState('tap_prompt'); // 'tap_prompt' | 'question' | 'animating' | 'result' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  // Line equation: y = -x + 1  (Offset = 0.5)
  // Side test: y + x - 1 > 0 => Orange side, < 0 => Apple side
  const getSide = (pt) => (pt.x + pt.y - 1.0);

  const handleCanvasClick = (e) => {
    if (stepState !== 'tap_prompt') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    setMysteryPoint({ x: nx, y: ny });
    soundFX.playPop();
    setStepState('question');
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    setStepState('animating');
    soundFX.playPop();

    const actualSide = getSide(mysteryPoint) > 0 ? 'orange' : 'apple';

    setTimeout(() => {
      setPredictedFruit(actualSide);
      soundFX.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setStepState('result');
    }, 700);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Fence line (x + y = 1 => line from (0, h) to (w, 0))
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
    ctx.stroke();

    // Base fruits
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    BASE_APPLES.forEach(a => ctx.fillText('🍎', a.x * w, a.y * h));
    ORANGES: BASE_ORANGES.forEach(o => ctx.fillText('🍊', o.x * w, o.y * h));

    // Mystery Point
    if (mysteryPoint) {
      const px = mysteryPoint.x * w;
      const py = mysteryPoint.y * h;

      if (stepState === 'animating') {
        // Draw animated scan beam
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px, py, 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.font = '48px sans-serif';
      if (predictedFruit === 'apple') {
        ctx.fillText('🍎', px, py);
      } else if (predictedFruit === 'orange') {
        ctx.fillText('🍊', px, py);
      } else {
        ctx.fillText('❓', px, py);
      }
    }

  }, [mysteryPoint, stepState, predictedFruit]);

  return (
    <div className="interactive-canvas-wrapper" onClick={handleCanvasClick}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

      {stepState === 'tap_prompt' && (
        <DialogueBox
          mascot="🔮"
          promptText="Tap anywhere on the screen to drop a new mystery fruit!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🤔"
          promptText="Where do YOU think this new mystery fruit belongs?"
          options={[
            { text: '🍎 Apple Territory (Top Left)' },
            { text: '🍊 Orange Territory (Bottom Right)' }
          ]}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'result' && (
        <DialogueBox
          mascot="🎉"
          promptText="The boundary predicted it perfectly based on which side of the fence it fell on!"
          onNext={() => setStepState('discovered')}
          nextBtnText="Continue"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'discovered' && (
        <DialogueBox
          mascot="✨"
          promptText="That's Prediction! SVM classifies future data by simply checking which side of the decision boundary it lands."
          unlockedTerm="Classification Prediction"
          onNext={() => onCompleteStage(7)}
          nextBtnText="Unlock Stage 8"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
