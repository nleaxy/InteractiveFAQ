import { useState } from "react";
import { Upload, Sparkles, ChevronLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useFaqStore } from "@/store/useFaqStore";
import api from "@/api/axios";
import { toast } from "sonner"; // Импортируем toast

export default function GeneratePage() {
  const navigate = useNavigate();
  const { generateFaq } = useFaqStore();

  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [projectTitle, setProjectTitle] = useState("");
  const [urlSlug, setUrlSlug] = useState("");

  const [description, setDescription] = useState("");
  const [count, setCount] = useState("10");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async () => {
    // Валидация полей через toast
    if (!projectTitle || !urlSlug) {
      return toast.error("Заполните название и URL проекта");
    }

    setIsSubmitting(true);
    try {
      // 1. Создание проекта
      const projectRes = await api.post("/api/projects", {
        title: projectTitle,
        slug: urlSlug,
      });

      const newProjectId = projectRes.data.id;

      // 2. Логика в зависимости от режима
      if (mode === "ai") {
        if (!description) {
          toast.error("Введите описание для ИИ");
          setIsSubmitting(false);
          return;
        }

        // Уведомление о начале долгого процесса
        toast.info("ИИ начал генерацию вопросов. Пожалуйста, подождите...");

        await generateFaq(newProjectId, description, parseInt(count));
      }

      // 3. Успешное завершение
      toast.success("Проект успешно создан!");
      navigate(`/admin/${urlSlug}`);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.detail || "Ошибка при создании проекта";
      toast.error(errorMessage);
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
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col items-center justify-center p-4 md:p-6 pb-20 uppercase-none">
      <div className="w-full max-w-[840px] mb-4">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-[#2051FF] font-medium hover:opacity-70 transition-all text-sm md:text-base"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span>Вернуться к проектам</span>
        </Link>
      </div>

      <div className="bg-white w-full max-w-[840px] rounded-[32px] md:rounded-[40px] shadow-sm border border-[#EBF2FF] p-6 md:p-16 relative overflow-hidden">
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="bg-[#F0F2F5] p-1.5 rounded-full flex w-full max-w-[360px] shadow-inner">
            <button
              onClick={() => setMode("ai")}
              disabled={isSubmitting}
              className={`flex-1 h-[40px] md:h-[44px] rounded-full text-sm md:text-[16px] font-semibold transition-all ${mode === "ai" ? "bg-white text-[#2051FF] shadow-sm" : "text-[#94A3B8]"}`}
            >
              Генерация
            </button>
            <button
              onClick={() => setMode("manual")}
              disabled={isSubmitting}
              className={`flex-1 h-[40px] md:h-[44px] rounded-full text-sm md:text-[16px] font-semibold transition-all ${mode === "manual" ? "bg-white text-[#2051FF] shadow-sm" : "text-[#94A3B8]"}`}
            >
              Ручной
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12 pb-8 md:pb-10 border-b border-[#F1F3F5]">
          <div className="space-y-2 md:space-y-3">
            <label className="text-sm md:text-[16px] font-semibold text-[#1A2B4B] ml-2">
              Название FAQ
            </label>
            <Input
              disabled={isSubmitting}
              placeholder="Например: Университет"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="h-14 md:h-[60px] bg-white border-[#D8DCE8] rounded-xl md:rounded-[18px] px-6 text-base md:text-[18px] focus-visible:ring-0 focus-visible:border-[#2051FF]"
            />
          </div>
          <div className="space-y-2 md:space-y-3">
            <label className="text-sm md:text-[16px] font-semibold text-[#1A2B4B] ml-2">
              Публичная ссылка
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B0BCCB] text-base md:text-[18px]">
                faq/
              </span>
              <Input
                disabled={isSubmitting}
                placeholder="vvedite-url"
                value={urlSlug}
                onChange={(e) =>
                  setUrlSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                className="h-14 md:h-[60px] bg-white border-[#D8DCE8] rounded-xl md:rounded-[18px] pl-14 md:pl-[74px] pr-6 text-base md:text-[18px] focus-visible:ring-0 focus-visible:border-[#2051FF]"
              />
            </div>
          </div>
        </div>

        {mode === "ai" ? (
          <div className="space-y-8 md:space-y-10 animate-in fade-in duration-300">
            <div className="space-y-3 md:space-y-4">
              <label className="text-base md:text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
                Введите описание проекта
              </label>
              <Textarea
                disabled={isSubmitting}
                placeholder="Опишите ваш проект..."
                className="min-h-[140px] md:min-h-[160px] bg-white border-[#D8DCE8] border-[1px] rounded-[24px] p-6 md:p-8 text-base md:text-[18px] text-[#0D1B4C] placeholder:text-[#B0BCCB] focus-visible:ring-0 focus-visible:border-[#2051FF] transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative bg-white px-4 md:px-8 text-sm md:text-[18px] font-bold text-[#0D1B4C] tracking-[0.2em]">
                ИЛИ
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <label className="text-base md:text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
                Загрузите файл с данными
              </label>
              <div className="border-2 border-dashed border-[#D8DCE8] rounded-[24px] md:rounded-[28px] bg-white p-6 md:p-10 flex flex-col items-center justify-center group hover:border-[#2051FF] hover:bg-blue-50/20 transition-all cursor-pointer">
                <Upload className="w-6 h-6 md:w-8 md:h-8 text-[#2051FF] mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm md:text-[18px] text-[#1A2B4B] font-medium text-center px-2">
                  Перетащите файл или{" "}
                  <span className="text-[#2051FF] underline underline-offset-4">
                    выберите его
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between pt-6 md:pt-8 border-t border-[#F1F3F5] gap-6">
              <div className="space-y-2 md:space-y-3 w-full md:w-[260px]">
                <label className="text-sm md:text-[16px] font-medium text-[#64748B] ml-2 flex justify-between">
                  Вопросов <span>(5-20)</span>
                </label>
                <Input
                  type="number"
                  min="5"
                  max="20"
                  value={count}
                  onChange={handleCountChange}
                  className="h-14 md:h-[64px] bg-white border-[#D8DCE8] rounded-xl md:rounded-[20px] px-6 md:px-8 text-lg md:text-[20px] font-medium text-[#1A2B4B] focus-visible:border-[#2051FF]"
                />
              </div>
              <Button
                onClick={handleCreateProject}
                disabled={
                  isSubmitting || parseInt(count) < 5 || parseInt(count) > 20
                }
                className="h-16 md:h-[72px] px-8 md:px-10 bg-[#2051FF] hover:bg-blue-700 disabled:bg-slate-300 rounded-xl md:rounded-[20px] text-lg md:text-[20px] font-semibold text-white shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                )}
                <span>Сгенерировать</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300 py-6 md:py-10 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-[#2051FF] rounded-full flex items-center justify-center mx-auto">
                <Plus size={32} className="md:size-[40px]" />
              </div>
              <h3 className="text-2xl md:text-[28px] font-bold text-[#1A2B4B]">
                Создать пустой проект
              </h3>
              <p className="text-sm md:text-[18px] text-[#64748B] max-w-[400px] mx-auto px-4">
                Вы сможете добавить категории и вопросы вручную в панели
                управления проектом.
              </p>
            </div>

            <div className="flex justify-center pt-4 md:pt-6">
              <Button
                onClick={handleCreateProject}
                disabled={isSubmitting}
                className="w-full md:w-auto h-14 md:h-[72px] px-10 md:px-12 bg-[#2051FF] hover:bg-blue-700 rounded-xl md:rounded-[20px] text-lg md:text-[20px] font-semibold text-white shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
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
