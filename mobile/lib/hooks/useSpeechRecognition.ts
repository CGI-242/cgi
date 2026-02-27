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
  const nativeSubscriptionsRef = useRef<Array<{ remove: () => void }>>([]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsAvailable(!!SpeechRecognition);
    } else {
      import("expo-speech-recognition")
        .then((mod) => {
          mod.ExpoSpeechRecognitionModule.getStateAsync().then(() => {
            setIsAvailable(true);
          }).catch(() => setIsAvailable(false));
        })
        .catch(() => setIsAvailable(false));
    }

    // Nettoyage au démontage
    return () => {
      nativeSubscriptionsRef.current.forEach((sub) => sub.remove());
      nativeSubscriptionsRef.current = [];
    };
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
        const { ExpoSpeechRecognitionModule } = await import(
          "expo-speech-recognition"
        );

        const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!granted) return;

        // Nettoyer les anciens listeners
        nativeSubscriptionsRef.current.forEach((sub) => sub.remove());
        nativeSubscriptionsRef.current = [];

        // Écouter les résultats de transcription (M7)
        const resultSub = ExpoSpeechRecognitionModule.addListener("result", (event: any) => {
          if (event.results && event.results.length > 0) {
            setTranscript(event.results[0]?.transcript || "");
          }
        });
        nativeSubscriptionsRef.current.push(resultSub);

        // Écouter la fin de la reconnaissance
        const endSub = ExpoSpeechRecognitionModule.addListener("end", () => {
          setIsListening(false);
        });
        nativeSubscriptionsRef.current.push(endSub);

        // Écouter les erreurs
        const errorSub = ExpoSpeechRecognitionModule.addListener("error", () => {
          setIsListening(false);
        });
        nativeSubscriptionsRef.current.push(errorSub);

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
