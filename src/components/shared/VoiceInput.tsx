import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
}

export default function VoiceInput({ onTranscript, isListening = false, onListeningChange }: VoiceInputProps) {
  const [active, setActive] = useState(isListening);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setActive(false);
        if (onListeningChange) onListeningChange(false);
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setActive(false);
        if (onListeningChange) onListeningChange(false);
      };

      recog.onend = () => {
        setActive(false);
        if (onListeningChange) onListeningChange(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript, onListeningChange]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (active) {
      recognition.stop();
    } else {
      recognition.start();
      setActive(true);
      if (onListeningChange) onListeningChange(true);
    }
  };

  useEffect(() => {
    if (isListening !== active && recognition) {
      if (isListening) {
        recognition.start();
        setActive(true);
      } else {
        recognition.stop();
        setActive(false);
      }
    }
  }, [isListening, active, recognition]);

  if (!recognition) return null; // Or render a disabled mic icon

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-full transition-colors ${
        active ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      title={active ? "Listening..." : "Click to speak"}
    >
      {active ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
    </button>
  );
}
