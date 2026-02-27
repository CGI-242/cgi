import { useState, useCallback, useRef, useEffect } from "react";
import { Platform } from "react-native";

type UseSpeechRecognitionReturn = {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isAvailable: boolean;
};

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsAvailable(!!SpeechRecognition);
    } else {
      // Check native availability
      import("expo-speech-recognition")
        .then((mod) => {
          mod.ExpoSpeechRecognitionModule.getStateAsync().then(() => {
            setIsAvailable(true);
          }).catch(() => setIsAvailable(false));
        })
        .catch(() => setIsAvailable(false));
    }
  }, []);

  const startListening = useCallback(async () => {
    setTranscript("");

    if (Platform.OS === "web") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } else {
      try {
        const { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } = await import(
          "expo-speech-recognition"
        );

        const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!granted) return;

        ExpoSpeechRecognitionModule.start({
          lang: "fr-FR",
          interimResults: true,
        });

        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (Platform.OS === "web") {
      recognitionRef.current?.stop();
    } else {
      import("expo-speech-recognition").then((mod) => {
        mod.ExpoSpeechRecognitionModule.stop();
      });
    }
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, isAvailable };
}
