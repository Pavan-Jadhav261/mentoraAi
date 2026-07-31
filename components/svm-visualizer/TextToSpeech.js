"use client";
// Web Speech API Narrator Controller

class TextToSpeechController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;
    this.enabled = false;
    this.voice = null;
    this.rate = 0.95; // Slightly slower, friendly rate for children
    this.pitch = 1.05; // Slightly higher warm pitch

    if (this.synth) {
      this.initVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer friendly English voices
    this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))) 
                 || voices.find(v => v.lang.startsWith('en')) 
                 || voices[0];
  }

  toggleVoice(enable) {
    this.enabled = enable;
    if (!enable) {
      this.stop();
    }
  }

  speak(text) {
    if (!this.enabled || !this.synth) return;
    this.stop();

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''); // Strip emojis for natural voice
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (this.voice) utterance.voice = this.voice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}

export const ttsEngine = new TextToSpeechController();
