import { useState } from "react";
import { Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";

export default function HomePage() {
  const { faqs, popularQueries } = useFaqStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false); // Состояние прослушивания

  const queriesArray = popularQueries
    ? popularQueries.split(",").map((q) => q.trim())
    : [];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ФУНКЦИЯ ГОЛОСОВОГО ВВОДА
  const handleVoiceInput = () => {
    // Проверка поддержки браузером
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод. Попробуйте Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-40 relative overflow-x-hidden">
      {/* 1. ХЕДЕР */}
      <header className="pt-[49px] pl-[49px] flex items-center gap-[28px]">
        <div className="w-[103px] h-[103px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
            SynFAQ Moodboard
          </h1>
          <p className="text-[#2051FF] text-[20px] font-medium mt-0">
            Understanding meaning, not just words
          </p>
        </div>
      </header>

      {/* 2. ЦЕНТРАЛЬНЫЙ КОНТЕНТ */}
      <main className="flex flex-col items-center w-full pt-[80px]">
        <h2 className="text-[44px] font-medium text-[#0D1B4C] text-center mb-[40px]">
          Найдите ответ на свой вопрос
        </h2>

        {/* БЛОК ПОИСКА С МИКРОФОНОМ */}
        <div className="relative w-[840px]">
          <Input
            className="w-full h-[84px] bg-white border-[#D8DCE8] border-[1px] rounded-[22px] pl-10 pr-24 !text-[24px] text-[#0D1B4C] placeholder:text-[22px] placeholder:text-[#B0BCCB] shadow-sm outline-none focus-visible:ring-0 focus-visible:border-[#D8DCE8]"
            placeholder="Задайте свой вопрос ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            type="button"
            onClick={handleVoiceInput} // ПРИВЯЗАЛИ ФУНКЦИЮ
            className={`absolute right-[10px] top-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-full flex items-center justify-center p-0 shadow-md transition-all active:scale-95 border-none outline-none ${
              isListening
                ? "bg-red-500 animate-pulse"
                : "bg-[#2051FF] hover:bg-blue-700"
            }`}
          >
            <Mic className="!w-[27px] !h-[27px] text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
        <div className="w-[840px] mt-8 text-left">
          <p className="text-[18px] text-[#4A5568] mb-4 font-medium">
            Популярные запросы
          </p>
          <div className="flex gap-4">
            {queriesArray.map((query, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(query)}
                className="px-8 py-2 bg-white border border-[#D8DCE8] rounded-[12px] text-[#4A5568] hover:bg-blue-50 transition-colors text-[16px] shadow-sm"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* СПИСОК FAQ */}
        <div className="mt-16 w-[840px]">
          <h3 className="text-[28px] font-semibold text-[#0D1B4C] mb-8 text-left">
            FAQ
          </h3>
          <Accordion
            type="single"
            collapsible
            className="space-y-[20px] w-full"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border-none"
                >
                  <AccordionTrigger className="bg-white px-8 h-[84px] rounded-[24px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm transition-all flex justify-between items-center group">
                    <span className="text-[22px] text-[#0D1B4C] font-normal text-left">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white mt-2 px-8 py-6 rounded-[24px] border-[#D8DCE8] border-[1px] text-[20px] text-slate-500 shadow-md">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-slate-400 text-lg py-10">
                Ничего не найдено по вашему запросу
              </p>
            )}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
