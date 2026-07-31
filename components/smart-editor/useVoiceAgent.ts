import { useEffect, useRef, useState } from "react";
import { voiceManager } from "./VoiceManager";

export function useVoiceAgent({
  code,
  language,
  algorithm,
  onQueryActive,
}: {
  code: string;
  language: string;
  algorithm: string;
  onQueryActive: (query: string) => Promise<void>;
}) {
  const [isMicActive, setIsMicActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  
  // Keep latest refs to avoid stale closures in recognition events
  const codeRef = useRef(code);
  const languageRef = useRef(language);
  const algorithmRef = useRef(algorithm);
  const onQueryActiveRef = useRef(onQueryActive);
  const isMicActiveRef = useRef(isMicActive);

  useEffect(() => {
    codeRef.current = code;
    languageRef.current = language;
    algorithmRef.current = algorithm;
    onQueryActiveRef.current = onQueryActive;
    isMicActiveRef.current = isMicActive;
  }, [code, language, algorithm, onQueryActive, isMicActive]);

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; // Use interim results so it doesn't get stuck waiting for silence
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      try {
        const current = event.resultIndex;
        if (!event.results || !event.results[current]) return;

        const result = event.results[current];
        const currentTranscript = result[0]?.transcript?.toLowerCase().trim() || "";
        const isFinal = result.isFinal === true;

        if (currentTranscript.length > 0) {
          setTranscript(currentTranscript);
        }
        
        if (currentTranscript.includes("mentora stop")) {
          setIsMicActive(false);
          setTranscript("");
          if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
          return;
        }

        const submitQuery = (query: string) => {
          onQueryActiveRef.current(query);
          setTimeout(() => setTranscript(""), 1000);
        };

        // Clear existing timeout on every new syllable
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }

        // If the browser says it's final, submit immediately
        if (isFinal && currentTranscript.length > 0) {
          submitQuery(currentTranscript);
        } else if (currentTranscript.length > 0) {
          // Otherwise, force a submission after 1.5 seconds of silence
          speechTimeoutRef.current = setTimeout(() => {
            submitQuery(currentTranscript);
          }, 1500);
        }
      } catch (err) {
        console.log("Error processing speech result:", err);
      }
    };

    recognition.onerror = (event: any) => {
      // Use console.log instead of console.error because Next.js dev server 
      // treats console.error as a fatal crash and throws a full-screen red overlay.
      // "aborted" and "no-speech" are normal lifecycle events for SpeechRecognition.
      console.log("Speech recognition event:", event.error);
      
      if (event.error === "not-allowed") {
        setIsMicActive(false);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Automatically restart if it's supposed to be active, without toggling isListening off
      if (isMicActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore
        }
      } else {
        setIsListening(false);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isMicActive && !isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // ignore
      }
    } else if (!isMicActive && isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isMicActive, isListening]);

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
  };

  return { isMicActive, toggleMic, isListening, transcript };
}
