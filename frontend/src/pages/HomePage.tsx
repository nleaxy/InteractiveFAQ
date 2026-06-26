import { useState, useEffect, useMemo } from "react";
import { Mic, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { projectSlug } = useParams();

  const {
    currentProjectFaqs,
    activeProject,
    fetchProjectBySlug,
    fetchProjectFaqs,
    searchFaqs,
    isLoading,
  } = useFaqStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (projectSlug) {
        const project = await fetchProjectBySlug(projectSlug);
        if (project) {
          fetchProjectFaqs(project.id);
        }
      }
    };
    loadData();
  }, [projectSlug]);

  useEffect(() => {
    if (!activeProject) return;

    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        searchFaqs(activeProject.id, searchQuery);
      } else if (searchQuery.trim().length === 0) {
        fetchProjectFaqs(activeProject.id);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeProject]);

  const queriesArray = useMemo(() => {
    if (!activeProject?.popularQueries) return [];
    return activeProject.popularQueries
      .split(",")
      .map((q) => q.trim())
      .filter((q) => q !== "");
  }, [activeProject?.popularQueries]);

  const categories = useMemo(() => {
    const names = currentProjectFaqs.map((f) => f.category).filter(Boolean);
    return Array.from(new Set(names));
  }, [currentProjectFaqs]);

  const filteredFaqs = currentProjectFaqs.filter((faq) => {
    const matchesCategory = activeCategory
      ? faq.category === activeCategory
      : true;
    return matchesCategory;
  });

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  if (isLoading && !activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <Loader2 className="w-12 h-12 text-[#2051FF] animate-spin" />
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-400">Проект не найден</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20 relative overflow-x-hidden">
      {/* 1. ХЕДЕР (Адаптивный) */}
      <header className="pt-8 md:pt-[49px] px-6 md:pl-[49px] flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-[28px]">
        <Link to="/" className="transition-transform active:scale-95">
          <div className="w-16 h-16 md:w-[103px] md:h-[103px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden flex-shrink-0">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl md:text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
            SynFAQ {activeProject.title}
          </h1>
          <p className="text-[#2051FF] text-sm md:text-[20px] font-medium mt-1">
            Understanding meaning, not just words
          </p>
        </div>
      </header>

      {/* 2. ЦЕНТРАЛЬНЫЙ КОНТЕНТ */}
      <main className="flex flex-col items-center w-full pt-10 md:pt-[80px]">
        <h2 className="text-2xl md:text-[44px] font-medium text-[#0D1B4C] text-center mb-6 md:mb-[40px] px-6 leading-tight">
          Найдите ответ на свой вопрос
        </h2>

        {/* БЛОК ПОИСКА (Исправлено позиционирование кнопки) */}
        <div className="w-full max-w-[840px] px-4">
          <div className="relative w-full">
            <Input
              className="w-full h-16 md:h-[84px] bg-white border-[#D8DCE8] border-[1px] rounded-2xl md:rounded-[22px] pl-6 md:pl-10 pr-16 md:pr-24 text-lg md:!text-[24px] text-[#0D1B4C] placeholder:text-base md:placeholder:text-[22px] placeholder:text-[#B0BCCB] shadow-sm outline-none focus-visible:ring-0 focus-visible:border-[#D8DCE8]"
              placeholder="Задайте вопрос ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full shadow-md transition-all active:scale-95",
                "right-2 md:right-[10px] w-12 h-12 md:w-[64px] md:h-[64px]",
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-[#2051FF] hover:bg-blue-700",
              )}
            >
              <Mic
                className="w-5 h-5 md:w-[27px] md:h-[27px] text-white"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>

        {/* ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
        {queriesArray.length > 0 && (
          <div className="w-full max-w-[840px] mt-8 px-4 text-left">
            <p className="text-base md:text-[18px] text-[#4A5568] mb-4 font-medium italic">
              Популярные запросы
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {queriesArray.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(query)}
                  className="px-4 md:px-8 py-1.5 md:py-2 bg-white border border-[#D8DCE8] rounded-xl text-[#4A5568] hover:bg-blue-50 transition-colors text-sm md:text-[16px] shadow-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* КАТЕГОРИИ */}
        {categories.length > 0 && (
          <div className="w-full max-w-[840px] mt-8 md:mt-10 px-4 text-left">
            <p className="text-base md:text-[18px] text-[#4A5568] mb-4 font-medium italic">
              Категории
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-sm md:text-[16px] font-medium transition-all border shadow-sm",
                  !activeCategory
                    ? "bg-[#2051FF] text-white border-[#2051FF]"
                    : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
                )}
              >
                Все
              </button>
              {categories.map((catName) => (
                <button
                  key={catName}
                  onClick={() => setActiveCategory(catName)}
                  className={cn(
                    "px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-sm md:text-[16px] font-medium transition-all border shadow-sm",
                    activeCategory === catName
                      ? "bg-[#2051FF] text-white border-[#2051FF]"
                      : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
                  )}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* СПИСОК FAQ */}
        <div className="mt-10 md:mt-16 w-full max-w-[840px] px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-xl md:text-[28px] font-semibold text-[#0D1B4C]">
              FAQ
            </h3>
            <span className="text-sm md:text-[16px] text-slate-400 font-medium italic">
              Найдено: {filteredFaqs.length}
            </span>
          </div>

          <Accordion
            type="single"
            collapsible
            className="space-y-3 md:space-y-[20px] w-full"
          >
            {isLoading && searchQuery.length > 2 ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border-none"
                >
                  <AccordionTrigger className="bg-white px-5 md:px-8 min-h-[64px] md:h-[84px] rounded-2xl md:rounded-[24px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm transition-all text-left">
                    <span className="text-base md:text-[22px] text-[#0D1B4C] font-normal leading-tight">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white mt-2 px-5 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[24px] border-[#D8DCE8] border-[1px] text-sm md:text-[20px] text-slate-500 shadow-md leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[24px] py-16 md:py-20 text-center text-slate-400 text-base md:text-xl italic">
                Ничего не найдено
              </div>
            )}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
