import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/useSpeech";
import { useEffect } from "react";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export function VoiceInput({ onResult }: VoiceInputProps) {
  const { isListening, transcript, startListening, isSupported } = useSpeech();

  useEffect(() => {
    if (transcript) {
      onResult(transcript);
    }
  }, [transcript, onResult]);

  if (!isSupported) return null;

  return (
    <Button
      variant={isListening ? "destructive" : "secondary"}
      size="icon"
      onClick={startListening}
      className={`relative ${isListening ? "animate-pulse" : ""}`}
      title="Голосовой поиск"
    >
      {isListening ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
