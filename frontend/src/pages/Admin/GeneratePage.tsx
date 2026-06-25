import { useState } from "react";
import { Upload, Sparkles, ChevronLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useFaqStore } from "@/store/useFaqStore";
import api from "@/api/axios";

export default function GeneratePage() {
  const navigate = useNavigate();
  const { generateFaq } = useFaqStore();

  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [projectTitle, setProjectTitle] = useState("");
  const [urlSlug, setUrlSlug] = useState("");

  // Состояния для ИИ
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("10");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ГЛАВНАЯ ФУНКЦИЯ
  const handleCreateProject = async () => {
    if (!projectTitle || !urlSlug) return alert("Заполните название и URL");

    setIsSubmitting(true);
    try {
      // 1. ВСЕГДА СОЗДАЕМ ПРОЕКТ ПЕРВЫМ ДЕЛОМ
      const projectRes = await api.post("/api/projects", {
        title: projectTitle,
        slug: urlSlug,
      });
      const newProjectId = projectRes.data.id;

      // 2. ЕСЛИ ЭТО ИИ - ЗАПУСКАЕМ ГЕНЕРАЦИЮ (И ждем её)
      if (mode === "ai") {
        if (!description) {
          alert("Введите описание для ИИ");
          setIsSubmitting(false);
          return;
        }
        await generateFaq(newProjectId, description, parseInt(count));
      }

      // 3. ЕСЛИ РУЧНОЙ - МГНОВЕННО ПЕРЕХОДИМ (Никаких лишних ожиданий)
      // Если ИИ - тоже переходим после завершения генерации
      navigate(`/admin/${newProjectId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Ошибка при создании проекта");
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="w-[840px] mb-4">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-[#2051FF] font-medium hover:opacity-70 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Вернуться к проектам</span>
        </Link>
      </div>

      <div className="bg-white w-[840px] rounded-[40px] shadow-sm border border-[#EBF2FF] p-16 relative overflow-hidden">
        {/* ТАБЫ */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#F0F2F5] p-1.5 rounded-full flex w-[360px] shadow-inner">
            <button
              onClick={() => setMode("ai")}
              className={`flex-1 h-[44px] rounded-full text-[16px] font-semibold transition-all ${mode === "ai" ? "bg-white text-[#2051FF] shadow-sm" : "text-[#94A3B8]"}`}
            >
              Генерация
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 h-[44px] rounded-full text-[16px] font-semibold transition-all ${mode === "manual" ? "bg-white text-[#2051FF] shadow-sm" : "text-[#94A3B8]"}`}
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
                placeholder="vvedite-url"
                value={urlSlug}
                onChange={(e) =>
                  setUrlSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                className="h-[60px] bg-white border-[#D8DCE8] rounded-[18px] pl-[74px] pr-6 text-[18px] focus-visible:ring-0 focus-visible:border-[#2051FF]"
              />
            </div>
          </div>
        </div>

        {mode === "ai" ? (
          /* РЕЖИМ ГЕНЕРАЦИИ */
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
                  Вопросов <span>(5-20)</span>
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
                onClick={handleCreateProject}
                disabled={
                  isSubmitting || parseInt(count) < 5 || parseInt(count) > 20
                }
                className="h-[72px] px-10 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[20px] font-semibold text-white shadow-lg flex items-center gap-3 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                <span>Сгенерировать</span>
              </Button>
            </div>
          </div>
        ) : (
          /* РУЧНОЙ РЕЖИМ (Теперь максимально простой) */
          <div className="space-y-12 animate-in fade-in duration-300 py-10">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 text-[#2051FF] rounded-full flex items-center justify-center mx-auto">
                <Plus size={40} />
              </div>
              <h3 className="text-[28px] font-bold text-[#1A2B4B]">
                Создать пустой проект
              </h3>
              <p className="text-[#64748B] text-[18px] max-w-[400px] mx-auto">
                Вы сможете добавить категории и вопросы вручную в панели
                управления проектом.
              </p>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleCreateProject}
                disabled={isSubmitting}
                className="h-[72px] px-12 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[20px] font-semibold text-white shadow-lg flex items-center gap-3 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
                <span>Создать и перейти</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
