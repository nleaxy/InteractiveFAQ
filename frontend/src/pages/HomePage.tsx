import { useState } from "react";
import { Mic } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";
import { cn } from "@/lib/utils"; // Утилита для объединения классов

export default function HomePage() {
  const { projectId } = useParams();

  const project = useFaqStore((state) =>
    state.projects.find((p) => p.id === projectId),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null); // Состояние активной категории
  const [isListening, setIsListening] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <h1 className="text-2xl font-bold text-slate-400">Проект не найден</h1>
      </div>
    );
  }

  // 1. Получаем список категорий (если их нет, создаем пустой массив)
  const categories = project.categories || [];

  // 2. Логика фильтрации вопросов
  // Если выбрана категория — берем вопросы из неё, если нет — «разворачиваем» все вопросы из всех категорий
  const allFaqs = categories.flatMap((cat) => cat.faqs || []);

  const faqsToDisplay = activeCategoryId
    ? categories.find((c) => c.id === activeCategoryId)?.faqs || []
    : allFaqs;

  // 3. Дополнительная фильтрация через поисковую строку
  const filteredFaqs = faqsToDisplay.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const queriesArray = project.popularQueries
    ? project.popularQueries.split(",").map((q) => q.trim())
    : [];

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setSearchQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-40 relative overflow-x-hidden">
      <header className="pt-[49px] pl-[49px] flex items-center gap-[28px]">
        <Link to="/" className="transition-transform active:scale-95">
          <div className="w-[103px] h-[103px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden flex-shrink-0 cursor-pointer">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          <h1 className="text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
            SynFAQ {project.title}
          </h1>
          <p className="text-[#2051FF] text-[20px] font-medium mt-0">
            Understanding meaning, not just words
          </p>
        </div>
      </header>

      <main className="flex flex-col items-center w-full pt-[80px]">
        <h2 className="text-[44px] font-medium text-[#0D1B4C] text-center mb-[40px]">
          Найдите ответ на свой вопрос
        </h2>

        {/* ПОИСК */}
        <div className="relative w-[840px]">
          <Input
            className="w-full h-[84px] bg-white border-[#D8DCE8] border-[1px] rounded-[22px] pl-10 pr-24 !text-[24px] text-[#0D1B4C] placeholder:text-[22px] placeholder:text-[#B0BCCB] shadow-sm outline-none"
            placeholder="Задайте свой вопрос ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleVoiceInput}
            className={`absolute right-[10px] top-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-md transition-all ${
              isListening
                ? "bg-red-500 animate-pulse"
                : "bg-[#2051FF] hover:bg-blue-700"
            }`}
          >
            <Mic className="!w-[27px] !h-[27px] text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* КАТЕГОРИИ (Новый блок) */}
        <div className="w-[840px] mt-10">
          <p className="text-[18px] text-[#4A5568] mb-4 font-medium italic">
            Категории
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[16px] font-medium transition-all border shadow-sm",
                !activeCategoryId
                  ? "bg-[#2051FF] text-white border-[#2051FF]"
                  : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
              )}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[16px] font-medium transition-all border shadow-sm",
                  activeCategoryId === cat.id
                    ? "bg-[#2051FF] text-white border-[#2051FF]"
                    : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* СПИСОК FAQ */}
        <div className="mt-16 w-[840px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[28px] font-semibold text-[#0D1B4C]">FAQ</h3>
            <span className="text-[16px] text-slate-400 font-medium">
              Найдено: {filteredFaqs.length}
            </span>
          </div>

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
                  <AccordionTrigger className="bg-white px-8 h-[84px] rounded-[24px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm flex justify-between items-center group">
                    <span className="text-[22px] text-[#0D1B4C] font-normal text-left">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white mt-2 px-8 py-6 rounded-[24px] border-[#D8DCE8] border-[1px] text-[20px] text-slate-500 shadow-md leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[24px] py-16 text-center">
                <p className="text-slate-400 text-xl italic">
                  Ничего не найдено
                </p>
              </div>
            )}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
