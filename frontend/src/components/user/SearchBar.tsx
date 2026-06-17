import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { VoiceInput } from "./VoiceInput";

interface SearchBarProps {
  value: string; // Текущий текст поиска
  onChange: (val: string) => void; // Функция для изменения текста
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const handleVoiceResult = (text: string) => {
    onChange(text);
    console.log("Ищем по голосу:", text);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-10 h-12 text-lg shadow-sm rounded-xl"
          placeholder="Задайте свой вопрос..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <VoiceInput onResult={handleVoiceResult} />
    </div>
  );
}
