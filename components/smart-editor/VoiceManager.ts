class VoiceManager {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;

  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : (null as any);
    if (this.synth) {
      this.loadVoices();
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    const voices = this.synth.getVoices();
    // Prefer a clear English voice
    const defaultVoice = voices.find((v) => v.lang.startsWith("en-") && v.name.includes("Google")) || voices.find((v) => v.lang.startsWith("en-")) || voices[0];
    if (defaultVoice) {
      this.voice = defaultVoice;
    }
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  setVoice(voiceURI: string) {
    const voices = this.synth.getVoices();
    const selected = voices.find(v => v.voiceURI === voiceURI);
    if (selected) {
      this.voice = selected;
    }
  }

  getVoices() {
    return this.synth ? this.synth.getVoices() : [];
  }

  speak(text: string) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop current speech

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceManager = new VoiceManager();
