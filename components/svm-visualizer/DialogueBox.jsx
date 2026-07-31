"use client";
import React, { useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { ttsEngine } from './TextToSpeech';

export default function DialogueBox({
  mascot = '🤖',
  promptText = '',
  unlockedTerm = null,
  options = [],
  onSelectOption = null,
  selectedOption = null,
  onNext = null,
  nextBtnText = 'Continue',
  onReset = null,
  isVoiceActive = false,
  onToggleVoice = null
}) {
  useEffect(() => {
    if (isVoiceActive && promptText) {
      ttsEngine.speak(promptText);
    }
  }, [promptText, isVoiceActive]);

  return (
    <div
      className="dialogue-overlay"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="dialogue-card glass-panel">
        <div className="mascot-avatar" role="img" aria-label="Mascot">
          {mascot}
        </div>

        <div className="dialogue-content">
          {unlockedTerm && (
            <div>
              <span className="dialogue-unlocked-badge">
                <Sparkles size={16} /> New Concept Unlocked: <strong>{unlockedTerm}</strong>
              </span>
            </div>
          )}

          <div className="dialogue-text">
            {promptText}
          </div>

          {/* Interactive Question Options if present */}
          {options && options.length > 0 && (
            <div className="question-options-grid">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectOption && onSelectOption(idx)}
                    className={`option-card ${isSelected ? 'selected-correct' : ''}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          )}

          <div className="dialogue-actions">
            {onReset && (
              <button onClick={onReset} className="action-btn action-btn-secondary" title="Try Again">
                <RefreshCw size={16} /> Reset
              </button>
            )}

            <button
              onClick={() => onToggleVoice && onToggleVoice(!isVoiceActive)}
              className={`icon-btn ${isVoiceActive ? 'active' : ''}`}
              title={isVoiceActive ? 'Turn off voice narration' : 'Read prompt aloud'}
            >
              {isVoiceActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {onNext && (
              <button onClick={onNext} className="action-btn action-btn-primary rounded-font">
                {nextBtnText} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
