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
  // 1. Берем projectSlug вместо projectId из URL
  const { projectSlug } = useParams();

  const {
    currentProjectFaqs,
    activeProject,
    fetchProjectBySlug,
    fetchProjectFaqs,
    isLoading,
  } = useFaqStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // 2. Новая логика загрузки данных
  useEffect(() => {
    const loadData = async () => {
      if (projectSlug) {
        // Сначала получаем данные проекта по слагу
        const project = await fetchProjectBySlug(projectSlug);
        // Если проект найден, загружаем его вопросы по числовому ID
        if (project) {
          fetchProjectFaqs(project.id);
        }
      }
    };
    loadData();
  }, [projectSlug]);

  const categories = useMemo(() => {
    const names = currentProjectFaqs.map((f) => f.category).filter(Boolean);
    return Array.from(new Set(names));
  }, [currentProjectFaqs]);

  const filteredFaqs = currentProjectFaqs.filter((faq) => {
    const matchesCategory = activeCategory
      ? faq.category === activeCategory
      : true;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      setSearchQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // 3. Состояния загрузки и отсутствия проекта
  if (isLoading && !activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <Loader2 className="w-12 h-12 text-[#2051FF] animate-spin" />
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <h1 className="text-2xl font-bold text-slate-400">Проект не найден</h1>
      </div>
    );
  }

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
            SynFAQ {activeProject.title}
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

        <div className="relative w-[840px]">
          <Input
            className="w-full h-[84px] bg-white border-[#D8DCE8] border-[1px] rounded-[22px] pl-10 pr-24 !text-[24px] text-[#0D1B4C] placeholder:text-[22px] placeholder:text-[#B0BCCB] shadow-sm outline-none"
            placeholder="Задайте свой вопрос ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
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

        {categories.length > 0 && (
          <div className="w-[840px] mt-10">
            <p className="text-[18px] text-[#4A5568] mb-4 font-medium italic">
              Категории
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[16px] font-medium transition-all border shadow-sm",
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
                    "px-6 py-2.5 rounded-full text-[16px] font-medium transition-all border shadow-sm",
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

        <div className="mt-16 w-[840px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[28px] font-semibold text-[#0D1B4C]">FAQ</h3>
            <span className="text-[16px] text-slate-400 font-medium italic">
              Найдено результатов: {filteredFaqs.length}
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
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[24px] py-20 text-center text-slate-400 text-xl italic">
                По данному запросу вопросов не найдено
              </div>
            )}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
