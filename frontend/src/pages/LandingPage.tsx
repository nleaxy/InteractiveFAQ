import { MessageSquare, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { useFaqStore } from "@/store/useFaqStore";

export default function LandingPage() {
  const navigate = useNavigate();
  const logout = useFaqStore((state) => state.logout);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans overflow-x-hidden">
      {/* 1. НАВИГАЦИЯ (Адаптивная) */}
      <header className="fixed top-0 w-full h-auto py-4 md:h-[100px] px-6 md:px-[49px] flex items-center justify-between z-50 bg-[#F0F2F5]/80 backdrop-blur-md border-b border-slate-200/50 md:border-none">
        <div className="flex items-center gap-4 md:gap-[40px]">
          <Link
            to="/"
            className="flex items-center gap-3 md:gap-[20px] transition-opacity hover:opacity-80"
          >
            <div className="w-10 h-10 md:w-[60px] md:h-[60px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <span className="text-xl md:text-[28px] font-bold text-[#1A2B4B] hidden xs:block">
              SynFAQ
            </span>
          </Link>

          <nav className="hidden lg:flex gap-[32px] ml-10">
            <Link
              to="/docs"
              className="text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors"
            >
              О платформе
            </Link>
            <Link
              to="/catalog"
              className="text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors"
            >
              FAQ-каталог
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/projects">
                <Button className="h-10 md:h-[48px] px-4 md:px-6 bg-[#2051FF] hover:bg-blue-700 text-white rounded-xl text-sm md:text-[16px] font-medium shadow-md transition-all active:scale-95">
                  Кабинет
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-10 md:h-[48px] px-3 md:px-4 text-[#FF2D6D] hover:text-red-700 hover:bg-red-50 rounded-xl flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="h-10 md:h-[48px] px-6 bg-[#2051FF] hover:bg-blue-700 rounded-xl text-sm md:text-[16px] font-medium text-white shadow-md">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ БЛОК */}
      <main className="container mx-auto px-6 md:px-[49px] pt-32 md:pt-[220px] flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-0">
        {/* ЛЕВАЯ ЧАСТЬ (Текст) */}
        <div className="w-full lg:max-w-[700px] flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold text-[#1A2B4B] mb-6 md:mb-8">
            Конструктор <span className="text-[#2051FF]">умных FAQ</span> с
            синонимами
          </h1>
          <p className="text-lg md:text-[22px] leading-relaxed text-[#4A5568] mb-10 md:mb-12 max-w-[600px]">
            Создавайте базы знаний, которые понимают ваших клиентов с полуслова.
            Голосовой ввод, ИИ-аналитика и мгновенная публикация.
          </p>

          {!isLoggedIn ? (
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 md:h-[72px] px-12 bg-[#2051FF] hover:bg-blue-700 rounded-2xl text-xl md:text-[20px] font-semibold text-white shadow-xl shadow-blue-200 transition-transform active:scale-95">
                Начать бесплатно
              </Button>
            </Link>
          ) : (
            <div className="p-5 md:p-6 bg-white border border-[#EBF2FF] rounded-[24px] shadow-sm inline-block">
              <p className="text-[#1A2B4B] font-medium text-base md:text-[18px]">
                Вы авторизованы. Рады видеть вас снова! 👋
              </p>
            </div>
          )}
        </div>

        {/* ПРАВАЯ ЧАСТЬ (Декор) */}
        <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:w-auto flex justify-center py-10">
          {/* Синяя карточка */}
          <div className="relative z-20 w-28 h-28 sm:w-32 sm:h-32 md:w-[140px] md:h-[140px] bg-[#2051FF] rounded-[28px] md:rounded-[32px] shadow-2xl flex items-center justify-center transform -translate-y-8 translate-x-8 md:-translate-y-12 md:translate-x-12 animate-bounce-slow">
            <MessageSquare
              className="w-12 h-12 md:w-16 md:h-16 text-white"
              strokeWidth={1.5}
            />
          </div>

          {/* Розовая карточка */}
          <div className="absolute z-10 w-28 h-28 sm:w-32 sm:h-32 md:w-[140px] md:h-[140px] bg-[#FF2D6D] rounded-[28px] md:rounded-[32px] shadow-2xl flex items-center justify-center transform translate-y-8 -translate-x-8 md:translate-y-12 md:-translate-x-12">
            <BookOpen
              className="w-12 h-12 md:w-16 md:h-16 text-white"
              strokeWidth={1.5}
            />
          </div>

          {/* Фоновый круг */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
        </div>
      </main>

      {/* ФОНОВЫЙ ДЕКОР */}
      <div className="fixed top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}
