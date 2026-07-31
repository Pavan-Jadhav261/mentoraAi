"use client";
import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from '../DialogueBox';
import { soundFX } from '../SoundFX';
import confetti from 'canvas-confetti';

const INITIAL_ITEMS = [
  { id: 1, type: 'apple', emoji: '🍎', x: 0.25, y: 0.3, inBasket: null },
  { id: 2, type: 'orange', emoji: '🍊', x: 0.75, y: 0.35, inBasket: null },
  { id: 3, type: 'apple', emoji: '🍎', x: 0.45, y: 0.45, inBasket: null },
  { id: 4, type: 'orange', emoji: '🍊', x: 0.55, y: 0.25, inBasket: null },
  { id: 5, type: 'apple', emoji: '🍎', x: 0.35, y: 0.6, inBasket: null },
  { id: 6, type: 'orange', emoji: '🍊', x: 0.65, y: 0.55, inBasket: null },
];

export default function Stage1_Sorting({ onCompleteStage, isVoiceActive, onToggleVoice }) {
  const containerRef = useRef(null);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [stepState, setStepState] = useState('sorting'); // 'sorting' | 'question' | 'discovered'
  const [selectedOption, setSelectedOption] = useState(null);

  // Calculate sorted count
  const sortedCount = items.filter(i => i.inBasket !== null).length;
  const isAllSorted = sortedCount === items.length && items.every(i => (i.type === 'apple' && i.inBasket === 'left') || (i.type === 'orange' && i.inBasket === 'right'));

  useEffect(() => {
    if (isAllSorted && stepState === 'sorting') {
      soundFX.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setStepState('question');
    }
  }, [isAllSorted, stepState]);

  const handlePointerDown = (id, e) => {
    e.preventDefault();
    soundFX.playPop();
    setDraggedId(id);
    const rect = containerRef.current.getBoundingClientRect();
    const item = items.find(i => i.id === id);
    const itemX = item.x * rect.width;
    const itemY = item.y * rect.height;

    setDragOffset({
      x: e.clientX - rect.left - itemX,
      y: e.clientY - rect.top - itemY
    });
  };

  const handlePointerMove = (e) => {
    if (!draggedId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const mouseX = clientX - rect.left - dragOffset.x;
    const mouseY = clientY - rect.top - dragOffset.y;

    const normX = Math.max(0.05, Math.min(0.95, mouseX / rect.width));
    const normY = Math.max(0.1, Math.min(0.8, mouseY / rect.height));

    let inBasket = null;
    if (normX < 0.35 && normY > 0.5) inBasket = 'left';
    if (normX > 0.65 && normY > 0.5) inBasket = 'right';

    setItems(prev => prev.map(item => item.id === draggedId ? { ...item, x: normX, y: normY, inBasket } : item));
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

  return (
    <div
      ref={containerRef}
      className="interactive-canvas-wrapper"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Baskets Background */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: '8%',
        width: '28%',
        height: '24%',
        borderRadius: '24px',
        background: 'rgba(239, 68, 68, 0.12)',
        border: '3px dashed #ef4444',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
      }}>
        <span style={{ fontSize: '2rem' }}>🍎</span>
        Apples Basket
      </div>

      <div style={{
        position: 'absolute',
        bottom: '22%',
        right: '8%',
        width: '28%',
        height: '24%',
        borderRadius: '24px',
        background: 'rgba(249, 115, 22, 0.12)',
        border: '3px dashed #f97316',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
      }}>
        <span style={{ fontSize: '2rem' }}>🍊</span>
        Oranges Basket
      </div>

      {/* Draggable Fruits */}
      {items.map(item => (
        <div
          key={item.id}
          onPointerDown={(e) => handlePointerDown(item.id, e)}
          style={{
            position: 'absolute',
            left: `${item.x * 100}%`,
            top: `${item.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '3.2rem',
            cursor: 'grab',
            transition: draggedId === item.id ? 'none' : 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: draggedId === item.id ? 30 : 10,
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            scale: draggedId === item.id ? 1.25 : 1
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Dynamic Dialogue Box */}
      {stepState === 'sorting' && (
        <DialogueBox
          mascot="🍎"
          promptText="Drag all the apples and oranges into their matching baskets!"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}

      {stepState === 'question' && (
        <DialogueBox
          mascot="🎉"
          promptText="Great job! You sorted every fruit perfectly. What rule did you use?"
          options={[
            { text: 'I grouped them by how they look & color!' },
            { text: 'I placed them randomly.' }
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
          promptText="Exactly! Sorting items into separate groups based on how they look is called Classification."
          unlockedTerm="Classification"
          onNext={() => onCompleteStage(1)}
          nextBtnText="Unlock Stage 2"
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
        />
      )}
    </div>
  );
}
