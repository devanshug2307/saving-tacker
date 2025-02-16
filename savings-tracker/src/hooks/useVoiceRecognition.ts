"use client";

import { useState, useEffect, useCallback } from "react";

export function useVoiceRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Create stable event handlers using useCallback
  const handleResult = useCallback(
    (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    },
    [onResult]
  );

  const handleEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const handleError = useCallback((event: any) => {
    console.error("Speech recognition error:", event.error);
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = handleResult;
      recognition.onend = handleEnd;
      recognition.onerror = handleError;

      setRecognition(recognition);
    }
    // Removed onResult from dependencies since we're using useCallback
  }, [handleResult, handleEnd, handleError]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    startListening,
    stopListening,
  };
}
