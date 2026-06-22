import { useState } from "react";
import { Upload, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

export default function GeneratePage() {
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("20");

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col items-center justify-center p-6">
      {/* КНОПКА НАЗАД (Слева над карточкой) */}
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
        {/* ЗАГОЛОВОК */}
        <h1 className="text-[36px] font-semibold text-[#1A2B4B] text-center mb-12">
          Создать вопросы по описанию проекта
        </h1>

        <div className="space-y-10">
          {/* 1. ТЕКСТОВОЕ ПОЛЕ */}
          <div className="space-y-4">
            <label className="text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
              Введите описание проекта
            </label>
            <Textarea
              placeholder="Расскажите о вашем проекте как можно подробнее..."
              className="min-h-[180px] bg-white border-[#D8DCE8] border-[1px] rounded-[24px] p-8 text-[18px] text-[#0D1B4C] placeholder:text-[#B0BCCB] shadow-none outline-none focus-visible:ring-0 focus-visible:border-[#2051FF] transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* РАЗДЕЛИТЕЛЬ "ИЛИ" */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative bg-white px-8 text-[20px] font-bold text-[#0D1B4C] tracking-[0.2em]">
              ИЛИ
            </div>
          </div>

          {/* 2. ЗАГРУЗКА ФАЙЛА */}
          <div className="space-y-4">
            <label className="text-[18px] font-medium text-[#1A2B4B] ml-2 block italic">
              Загрузите ТЗ / описание
            </label>
            <div className="border-2 border-dashed border-[#D8DCE8] rounded-[28px] bg-white p-12 flex flex-col items-center justify-center group hover:border-[#2051FF] hover:bg-blue-50/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-[#F0F2F5] rounded-[18px] flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Upload className="w-8 h-8 text-[#2051FF]" />
              </div>
              <p className="text-[18px] text-[#1A2B4B] font-medium text-center">
                Перетащите файл или{" "}
                <span className="text-[#2051FF] underline underline-offset-4">
                  выберите его
                </span>
              </p>
              <p className="text-[14px] text-[#94A3B8] mt-2">
                Поддерживаются форматы PDF, DOCX, TXT
              </p>
            </div>
          </div>

          {/* 3. НИЖНЯЯ ПАНЕЛЬ (Инпут + Кнопка) */}
          <div className="flex items-end justify-between pt-8 border-t border-[#F1F3F5] mt-4">
            <div className="space-y-3 w-[260px]">
              <label className="text-[16px] font-medium text-[#64748B] ml-2">
                Количество вопросов
              </label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="h-[64px] bg-white border-[#D8DCE8] rounded-[20px] px-8 text-[20px] font-medium text-[#1A2B4B] focus-visible:ring-0 focus-visible:border-[#2051FF] shadow-sm"
              />
            </div>

            <button
              type="button"
              className="h-[72px] px-10 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[20px] font-semibold text-white shadow-lg shadow-blue-200 flex items-center gap-3 transition-all active:scale-95 outline-none border-none"
            >
              <Sparkles className="w-6 h-6" />
              Сгенерировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
