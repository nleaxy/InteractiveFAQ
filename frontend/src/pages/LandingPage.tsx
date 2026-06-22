import { MessageSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans overflow-x-hidden">
      {/* 1. НАВИГАЦИЯ (Хедер) */}
      <header className="fixed top-0 w-full h-[100px] px-[49px] flex items-center justify-between z-50 bg-[#F0F2F5]/80 backdrop-blur-sm">
        <div className="flex items-center gap-[40px]">
          {/* ЛОГОТИП (как на других страницах) */}
          <div className="flex items-center gap-[20px]">
            <div className="w-[60px] h-[60px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <span className="text-[28px] font-bold text-[#1A2B4B]">SynFAQ</span>
          </div>

          {/* ССЫЛКИ */}
          <nav className="hidden md:flex gap-[32px] ml-10">
            <a
              href="#"
              className="text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors"
            >
              О платформе
            </a>
            <a
              href="#"
              className="text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors"
            >
              FAQ-каталог
            </a>
          </nav>
        </div>

        <Link to="/login">
          <Button className="w-[140px] h-[48px] bg-[#2051FF] hover:bg-blue-700 rounded-[12px] text-[16px] font-medium text-white shadow-md">
            Войти
          </Button>
        </Link>
      </header>

      {/* 2. ГЛАВНЫЙ БЛОК (Hero Section) */}
      <main className="container mx-auto px-[49px] pt-[220px] flex flex-col lg:flex-row items-center justify-between">
        {/* ЛЕВАЯ ЧАСТЬ (Текст) */}
        <div className="max-w-[700px] flex flex-col items-start">
          <h1 className="text-[72px] leading-[1.1] font-bold text-[#1A2B4B] mb-8">
            Конструктор умных FAQ с синонимическим поиском
          </h1>
          <p className="text-[22px] leading-relaxed text-[#4A5568] mb-12 max-w-[600px]">
            Создавайте базы знаний, которые понимают ваших клиентов с полуслова.
            Голосовой ввод, ИИ-аналитика и мгновенная публикация.
          </p>

          <Link to="/login">
            <Button className="h-[72px] px-12 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[20px] font-semibold text-white shadow-xl shadow-blue-200 transition-transform active:scale-95">
              Начать бесплатно
            </Button>
          </Link>
        </div>

        {/* ПРАВАЯ ЧАСТЬ (Декор из макета) */}
        <div className="relative mt-20 lg:mt-0 w-full lg:w-auto flex justify-center">
          {/* Синяя карточка с чатом */}
          <div className="relative z-20 w-[140px] h-[140px] bg-[#2051FF] rounded-[32px] shadow-2xl flex items-center justify-center transform -translate-y-12 translate-x-12 animate-bounce-slow">
            <MessageSquare className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>

          {/* Розовая карточка с книгой */}
          <div className="absolute z-10 w-[140px] h-[140px] bg-[#FF2D6D] rounded-[32px] shadow-2xl flex items-center justify-center transform translate-y-12 -translate-x-12">
            <BookOpen className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>

          {/* Декоративный круг на фоне */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
        </div>
      </main>

      {/* ФОНОВЫЕ ЭЛЕМЕНТЫ (для красоты) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}
