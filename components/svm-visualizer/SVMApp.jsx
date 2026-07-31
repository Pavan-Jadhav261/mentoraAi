"use client";
import React, { useState, useEffect } from 'react';
import './svm-index.css';
import StageNav from './StageNav';
import Stage1_Sorting from './Stages/Stage1_Sorting';
import Stage2_FenceIntro from './Stages/Stage2_FenceIntro';
import Stage3_FenceSafety from './Stages/Stage3_FenceSafety';
import Stage4_SafetyGap from './Stages/Stage4_SafetyGap';
import Stage5_SupportVectors from './Stages/Stage5_SupportVectors';
import Stage6_BeatComputer from './Stages/Stage6_BeatComputer';
import Stage7_Prediction from './Stages/Stage7_Prediction';
import Stage8_StraightFail from './Stages/Stage8_StraightFail';
import Stage9_KernelTrick3D from './Stages/Stage9_KernelTrick3D';
import { soundFX } from './SoundFX';
import { ttsEngine } from './TextToSpeech';
import confetti from 'canvas-confetti';
import { Sun, Moon, Volume2, VolumeX, Eye, Sparkles, Trophy, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);
  const [stars, setStars] = useState({ 1: 3 });

  // App settings
  const [theme, setTheme] = useState('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isQuestComplete, setIsQuestComplete] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', highContrast);
  }, [highContrast]);

  const handleCompleteStage = (stageId) => {
    soundFX.playSuccess();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });

    setStars(prev => ({ ...prev, [stageId]: 3 }));

    if (stageId === 9) {
      setIsQuestComplete(true);
    } else {
      const nextStage = stageId + 1;
      setMaxUnlockedStage(prev => Math.max(prev, nextStage));
      setCurrentStage(nextStage);
    }
  };

  const handleToggleSound = () => {
    const next = !isSoundActive;
    setIsSoundActive(next);
    soundFX.toggleSound(next);
  };

  const handleToggleVoice = (val) => {
    setIsVoiceActive(val);
    ttsEngine.toggleVoice(val);
  };

  const handleRestartQuest = () => {
    setCurrentStage(1);
    setIsQuestComplete(false);
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="game-header">
        <div className="brand-title rounded-font">
          <span className="brand-emoji">🍎</span>
          <span>SVM Discovery Quest</span>
        </div>

        <StageNav
          currentStage={currentStage}
          maxUnlockedStage={maxUnlockedStage}
          onSelectStage={(id) => setCurrentStage(id)}
          stars={stars}
        />

        <div className="header-actions">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`icon-btn ${highContrast ? 'active' : ''}`}
            title="Toggle High Contrast / Colorblind Mode"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={handleToggleSound}
            className={`icon-btn ${isSoundActive ? 'active' : ''}`}
            title={isSoundActive ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {isSoundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* Main Interactive Stage Area */}
      <main className="stage-main-area">
        {currentStage === 1 && (
          <Stage1_Sorting
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 2 && (
          <Stage2_FenceIntro
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 3 && (
          <Stage3_FenceSafety
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 4 && (
          <Stage4_SafetyGap
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 5 && (
          <Stage5_SupportVectors
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 6 && (
          <Stage6_BeatComputer
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 7 && (
          <Stage7_Prediction
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 8 && (
          <Stage8_StraightFail
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
        {currentStage === 9 && (
          <Stage9_KernelTrick3D
            onCompleteStage={handleCompleteStage}
            isVoiceActive={isVoiceActive}
            onToggleVoice={handleToggleVoice}
          />
        )}
      </main>

      {/* Quest Completion Overlay */}
      {isQuestComplete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px',
          textAlign: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '540px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '4rem', animation: 'bounce 1.5s infinite' }}>🏆</div>
            <h1 style={{ fontSize: '2.2rem', color: '#10b981' }}>Quest Complete!</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              You didn't memorize Support Vector Machines...<br />
              <strong>You DISCOVERED them!</strong>
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              width: '100%',
              textAlign: 'left',
              margin: '10px 0',
              fontSize: '0.9rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                ✨ Classification
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                🛡️ Decision Boundary
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                🎈 Margin
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                ✨ Support Vectors
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                🔮 Prediction
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                🌋 Kernel Trick
              </div>
            </div>

            <button
              onClick={handleRestartQuest}
              className="action-btn action-btn-primary rounded-font"
              style={{ fontSize: '1.1rem', padding: '14px 28px' }}
            >
              <RotateCcw size={20} /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
