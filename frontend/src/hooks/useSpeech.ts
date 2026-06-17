import { useState, useEffect, useCallback } from "react";

// Расширяем интерфейс window для поддержки SpeechRecognition в браузерах
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const { webkitSpeechRecognition, SpeechRecognition } =
  window as unknown as IWindow;

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Проверяем поддержку браузером
    const SpeechClass = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechClass) {
      const recognitionInstance = new SpeechClass();
      recognitionInstance.continuous = false; // Останавливаться после одной фразы
      recognitionInstance.interimResults = false; // Не показывать промежуточные результаты
      recognitionInstance.lang = "ru-RU"; // Устанавливаем русский язык

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onend = () => setIsListening(false);

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Браузер не поддерживает Web Speech API");
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript(""); // Очищаем старый текст
      recognition.start();
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!(SpeechRecognition || webkitSpeechRecognition),
  };
};
