"use client";
import React from 'react';
import { CheckCircle2, Lock, Star } from 'lucide-react';

export const STAGES_DATA = [
  { id: 1, title: '1. Separate Things', concept: 'Classification', icon: '🍎' },
  { id: 2, title: '2. One Line?', concept: 'Multiple Fences', icon: '📏' },
  { id: 3, title: '3. Safer Fence', concept: 'Decision Boundary', icon: '🛡️' },
  { id: 4, title: '4. Safety Gap', concept: 'Margin', icon: '🎈' },
  { id: 5, title: '5. Who Matters?', concept: 'Support Vectors', icon: '✨' },
  { id: 6, title: '6. Beat AI', concept: 'Optimal Boundary', icon: '🏆' },
  { id: 7, title: '7. Predict', concept: 'Prediction', icon: '🔮' },
  { id: 8, title: '8. Fence Fails', concept: 'Non-Linearity', icon: '🌀' },
  { id: 9, title: '9. Lift World', concept: 'Kernel Trick', icon: '🌋' },
];

export default function StageNav({ currentStage, maxUnlockedStage, onSelectStage, stars = {} }) {
  return (
    <div className="stage-pills-container" role="navigation" aria-label="Stage Navigation">
      {STAGES_DATA.map((stage) => {
        const isCurrent = stage.id === currentStage;
        const isUnlocked = stage.id <= maxUnlockedStage;
        const isCompleted = stage.id < maxUnlockedStage;
        const stageStars = stars[stage.id] || 0;

        return (
          <button
            key={stage.id}
            onClick={() => isUnlocked && onSelectStage(stage.id)}
            className={`stage-pill ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            disabled={!isUnlocked}
            title={isUnlocked ? `Go to Stage ${stage.id}: ${stage.concept}` : 'Complete earlier stages to unlock'}
          >
            <span style={{ fontSize: '1rem' }}>{stage.icon}</span>
            <span>{stage.title}</span>

            {isCompleted && <CheckCircle2 size={14} style={{ marginLeft: 4 }} />}
            {!isUnlocked && <Lock size={12} style={{ marginLeft: 4, opacity: 0.6 }} />}
            
            {stageStars > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#f59e0b', marginLeft: 4 }}>
                <Star size={12} fill="#f59e0b" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
