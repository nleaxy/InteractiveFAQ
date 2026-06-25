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
      {/* 1. НАВИГАЦИЯ */}
      <header className="fixed top-0 w-full h-[100px] px-[49px] flex items-center justify-between z-50 bg-[#F0F2F5]/80 backdrop-blur-sm">
        <div className="flex items-center gap-[40px]">
          <Link
            to="/"
            className="flex items-center gap-[20px] transition-opacity hover:opacity-80"
          >
            <div className="w-[60px] h-[60px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <span className="text-[28px] font-bold text-[#1A2B4B]">SynFAQ</span>
          </Link>

          <nav className="hidden md:flex gap-[32px] ml-10">
            {/* ИЗМЕНЕНО: Теперь ведет на страницу документации */}
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

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/projects">
                <Button className="h-[48px] px-6 bg-[#2051FF] hover:bg-blue-700 text-white rounded-[12px] text-[16px] font-medium shadow-md transition-all active:scale-95">
                  Личный кабинет
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-[48px] px-4 text-[#FF2D6D] hover:text-red-700 hover:bg-red-50 rounded-[12px] flex items-center gap-2"
              >
                <LogOut size={20} />
                <span>Выйти</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="w-[140px] h-[48px] bg-[#2051FF] hover:bg-blue-700 rounded-[12px] text-[16px] font-medium text-white shadow-md">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ БЛОК */}
      <main className="container mx-auto px-[49px] pt-[220px] flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-[700px] flex flex-col items-start">
          <h1 className="text-[72px] leading-[1.1] font-bold text-[#1A2B4B] mb-8">
            Конструктор умных FAQ с синонимическим поиском
          </h1>
          <p className="text-[22px] leading-relaxed text-[#4A5568] mb-12 max-w-[600px]">
            Создавайте базы знаний, которые понимают ваших клиентов с полуслова.
            Голосовой ввод, ИИ-аналитика и мгновенная публикация.
          </p>

          {!isLoggedIn && (
            <Link to="/login">
              <Button className="h-[72px] px-12 bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[20px] font-semibold text-white shadow-xl shadow-blue-200 transition-transform active:scale-95">
                Начать бесплатно
              </Button>
            </Link>
          )}

          {isLoggedIn && (
            <div className="p-6 bg-white border border-[#EBF2FF] rounded-[24px] shadow-sm">
              <p className="text-[#1A2B4B] font-medium text-[18px]">
                Вы авторизованы. Рады видеть вас снова!
              </p>
            </div>
          )}
        </div>

        <div className="relative mt-20 lg:mt-0 w-full lg:w-auto flex justify-center">
          <div className="relative z-20 w-[140px] h-[140px] bg-[#2051FF] rounded-[32px] shadow-2xl flex items-center justify-center transform -translate-y-12 translate-x-12 animate-bounce-slow">
            <MessageSquare className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute z-10 w-[140px] h-[140px] bg-[#FF2D6D] rounded-[32px] shadow-2xl flex items-center justify-center transform translate-y-12 -translate-x-12">
            <BookOpen className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
        </div>
      </main>

      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}
