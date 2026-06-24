import { useState } from "react";
import { Upload, Sparkles, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom"; // Добавили useNavigate
import { useFaqStore } from "@/store/useFaqStore"; // Добавили стор

export default function GeneratePage() {
  const navigate = useNavigate();
  const addProject = useFaqStore((state) => state.addProject);

  // Состояния для переключателя и общих полей
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [projectTitle, setProjectTitle] = useState("");
  const [urlSlug, setUrlSlug] = useState("");

  // Состояния для ИИ генерации
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("10");

  // Состояния для ручного ввода
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");

  // ГЛАВНАЯ ФУНКЦИЯ СОЗДАНИЯ ПРОЕКТА
  const handleCreateProject = () => {
    // 1. Базовая валидация
    if (!projectTitle || !urlSlug) {
      alert("Пожалуйста, заполните название и URL проекта");
      return;
    }

    if (mode === "manual" && (!manualQuestion || !manualAnswer)) {
      alert("Пожалуйста, введите хотя бы один вопрос и ответ");
      return;
    }

    // 2. Формируем список вопросов (в режиме AI пока делаем "заглушку")
    const initialFaqs =
      mode === "manual"
        ? [
            {
              id: Date.now().toString(),
              question: manualQuestion,
              answer: manualAnswer,
              categoryId: "general",
              synonyms: [],
              keywords: [],
            },
          ]
        : [
            // Имитация сгенерированных вопросов для демонстрации
            {
              id: "1",
              question: `Вопрос по теме ${projectTitle} #1`,
              answer: "Ответ будет сгенерирован ИИ на основе вашего описания.",
              categoryId: "ai",
              synonyms: [],
              keywords: [],
            },
            {
              id: "2",
              question: `Вопрос по теме ${projectTitle} #2`,
              answer:
                "ИИ проанализирует ваш файл или текст и создаст точный ответ.",
              categoryId: "ai",
              synonyms: [],
              keywords: [],
            },
          ];

    // 3. Создаем объект проекта
    const newProject = {
      id: urlSlug,
      title: projectTitle,
      faqs: initialFaqs,
      popularQueries: "cats, roblox, 67", // начальные теги
    };

    // 4. Сохраняем в стор
    addProject(newProject);

    // 5. Переходим в админку этого проекта
    navigate(`/admin/${urlSlug}`);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setCount("");
      return;
    }
    setCount(value);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col items-center justify-center p-6 pb-20 uppercase-none">
      {/* КНОПКА НАЗАД */}
      <div className="w-[840px] mb-4">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-[#2051FF] font-medium hover:opacity-70 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Вернуться к проектам</span>
        </Link>
      </div>

      {/* ГЛАВНАЯ КАРТОЧКА */}
      <div className="bg-white w-[840px] rounded-[40px] shadow-sm border border-[#EBF2FF] p-16 relative overflow-hidden">
        {/* ТАБЫ */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#F0F2F5] p-1.5 rounded-full flex w-[360px] shadow-inner">
            <button
              onClick={() => setMode("ai")}
              className={`flex-1 h-[44px] rounded-full text-[16px] font-semibold transition-all ${
                mode === "ai"
                  ? "bg-white text-[#2051FF] shadow-sm"
                  : "text-[#94A3B8]"
              }`}
            >
              Генерация
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 h-[44px] rounded-full text-[16px] font-semibold transition-all ${
                mode === "manual"
                  ? "bg-white text-[#2051FF] shadow-sm"
                  : "text-[#94A3B8]"
              }`}
            >
              Ручной
            </button>
          </div>
        </div>

        {/* ОБЩИЕ ПОЛЯ */}
        <div className="grid grid-cols-2 gap-6 mb-12 pb-10 border-b border-[#F1F3F5]">
          <div className="space-y-3">
            <label className="text-[16px] font-semibold text-[#1A2B4B] ml-2">
              Название FAQ
            </label>
            <Input
              placeholder="Например: Университет"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="h-[60px] bg-white border-[#D8DCE8] rounded-[18px] px-6 text-[18px] focus-visible:ring-0 focus-visible:border-[#2051FF]"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[16px] font-semibold text-[#1A2B4B] ml-2">
              Публичная ссылка
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B0BCCB] text-[18px]">
                faq/
              </span>
              <Input
                placeholder="введите url"
                value={urlSlug}
                onChange={(e) =>
                  setUrlSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                className="h-[60px] bg-white border-[#D8DCE8] rounded-[18px] pl-[74px] pr-6 text-[18px] focus-visible:ring-0 focus-visible:border-[#2051FF]"
              />
            </div>
          </div>
        </div>

        {/* КОНТЕНТ: ГЕНЕРАЦИЯ */}
        {mode === "ai" ? (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="space-y-4">
              <label className="text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
                Введите описание проекта
              </label>
              <Textarea
                placeholder="Опишите ваш проект..."
                className="min-h-[160px] bg-white border-[#D8DCE8] border-[1px] rounded-[24px] p-8 text-[18px] text-[#0D1B4C] placeholder:text-[#B0BCCB] focus-visible:ring-0 focus-visible:border-[#2051FF] transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative bg-white px-8 text-[18px] font-bold text-[#0D1B4C] tracking-[0.2em]">
                ИЛИ
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
                Загрузите файл с данными
              </label>
              <div className="border-2 border-dashed border-[#D8DCE8] rounded-[28px] bg-white p-10 flex flex-col items-center justify-center group hover:border-[#2051FF] hover:bg-blue-50/20 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-[#2051FF] mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[18px] text-[#1A2B4B] font-medium text-center">
                  Перетащите файл или{" "}
                  <span className="text-[#2051FF] underline underline-offset-4">
                    выберите его
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between pt-8 border-t border-[#F1F3F5]">
              <div className="space-y-3 w-[260px]">
                <label className="text-[16px] font-medium text-[#64748B] ml-2 flex justify-between">
                  Вопросов <span>(от 5 до 20)</span>
                </label>
                <Input
                  type="number"
                  min="5"
                  max="20"
                  value={count}
                  onChange={handleCountChange}
                  className="h-[64px] bg-white border-[#D8DCE8] rounded-[20px] px-8 text-[20px] font-medium text-[#1A2B4B] focus-visible:border-[#2051FF]"
                />
              </div>
              <Button
                onClick={handleCreateProject} // ПРИВЯЗАЛИ ФУНКЦИЮ
                disabled={parseInt(count) < 5 || parseInt(count) > 20}
                className="h-[72px] px-10 bg-[#2051FF] hover:bg-blue-700 disabled:bg-slate-300 rounded-[20px] text-[20px] font-semibold text-white shadow-lg flex items-center gap-3 transition-all active:scale-95"
              >
                <Sparkles className="w-6 h-6" /> Сгенерировать
              </Button>
            </div>
          </div>
        ) : (
          /* КОНТЕНТ: РУЧНОЙ ВВОД */
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-[24px] font-bold text-[#1A2B4B]">Вопрос 1</h3>
            <div className="space-y-6">
              <Input
                placeholder="Введите вопрос"
                value={manualQuestion}
                onChange={(e) => setManualQuestion(e.target.value)}
                className="h-[64px] bg-white border-[#D8DCE8] rounded-[20px] px-8 text-[18px] focus-visible:border-[#2051FF]"
              />
              <Textarea
                placeholder="Введите ответ"
                value={manualAnswer}
                onChange={(e) => setManualAnswer(e.target.value)}
                className="min-h-[140px] bg-white border-[#D8DCE8] rounded-[24px] p-8 text-[18px] focus-visible:border-[#2051FF] resize-none"
              />
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleCreateProject} // ПРИВЯЗАЛИ ФУНКЦИЮ
                className="h-[64px] px-10 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[18px] font-medium text-white shadow-lg flex items-center gap-3 transition-all active:scale-95"
              >
                <Plus className="w-6 h-6" /> Добавить в базу
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
