import {
  MessageSquare,
  BookOpen,
  LogOut,
  Info,
  LayoutGrid,
} from "lucide-react"; // Добавили иконки для мобилок
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
      {/* 1. НАВИГАЦИЯ (Полностью адаптивная) */}
      <header className="fixed top-0 w-full h-auto py-3 md:h-[100px] px-4 md:px-[49px] flex items-center justify-between z-50 bg-[#F0F2F5]/90 backdrop-blur-md border-b border-slate-200/50 md:border-none">
        <div className="flex items-center gap-2 md:gap-[40px]">
          {/* ЛОГОТИП */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-[20px] transition-opacity hover:opacity-80"
          >
            <div className="w-9 h-9 md:w-[60px] md:h-[60px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-lg md:text-[28px] font-bold text-[#1A2B4B] hidden sm:block">
              SynFAQ
            </span>
          </Link>

          {/* ССЫЛКИ (Теперь не исчезают, а становятся компактнее) */}
          <nav className="flex gap-3 md:gap-[32px] ml-2 md:ml-10">
            <Link
              to="/docs"
              className="text-[13px] md:text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5 md:hidden" />
              <span>О платформе</span>
            </Link>
            <Link
              to="/catalog"
              className="text-[13px] md:text-[18px] font-medium text-[#1A2B4B] hover:text-[#2051FF] transition-colors flex items-center gap-1"
            >
              <LayoutGrid className="w-3.5 h-3.5 md:hidden" />
              <span>Каталог</span>
            </Link>
          </nav>
        </div>

        {/* КНОПКИ АВТОРИЗАЦИИ */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/projects">
                <Button className="h-9 md:h-[48px] px-3 md:px-6 bg-[#2051FF] hover:bg-blue-700 text-white rounded-xl text-[12px] md:text-[16px] font-medium shadow-md transition-all active:scale-95">
                  Кабинет
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-9 md:h-[48px] px-2 md:px-4 text-[#FF2D6D] hover:text-red-700 hover:bg-red-50 rounded-xl flex items-center gap-1"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Выйти</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="h-9 md:h-[48px] px-4 md:px-6 bg-[#2051FF] hover:bg-blue-700 rounded-xl text-[13px] md:text-[16px] font-medium text-white shadow-md">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ БЛОК */}
      <main className="container mx-auto px-6 md:px-[49px] pt-28 md:pt-[220px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
        <div className="w-full lg:max-w-[700px] flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold text-[#1A2B4B] mb-6 md:mb-8">
            Конструктор <span className="text-[#2051FF]">умных FAQ</span> с
            синонимами
          </h1>
          <p className="text-base md:text-[22px] leading-relaxed text-[#4A5568] mb-8 md:mb-12 max-w-[600px]">
            Создавайте базы знаний, которые понимают ваших клиентов с полуслова.
            Голосовой ввод, ИИ-аналитика и мгновенная публикация.
          </p>

          {!isLoggedIn ? (
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 md:h-[72px] px-10 md:px-12 bg-[#2051FF] hover:bg-blue-700 rounded-2xl text-lg md:text-[20px] font-semibold text-white shadow-xl shadow-blue-200 transition-transform active:scale-95">
                Начать бесплатно
              </Button>
            </Link>
          ) : (
            <div className="p-4 md:p-6 bg-white border border-[#EBF2FF] rounded-[24px] shadow-sm inline-block">
              <p className="text-[#1A2B4B] font-medium text-sm md:text-[18px]">
                Вы авторизованы. Рады видеть вас снова! 👋
              </p>
            </div>
          )}
        </div>

        {/* ДЕКОР */}
        <div className="relative w-full max-w-[280px] sm:max-w-[350px] lg:w-auto flex justify-center py-8">
          <div className="relative z-20 w-24 h-24 md:w-[140px] md:h-[140px] bg-[#2051FF] rounded-[24px] md:rounded-[32px] shadow-2xl flex items-center justify-center transform -translate-y-6 translate-x-6 md:-translate-y-12 md:translate-x-12 animate-bounce-slow">
            <MessageSquare
              className="w-10 h-10 md:w-16 md:h-16 text-white"
              strokeWidth={1.5}
            />
          </div>
          <div className="absolute z-10 w-24 h-24 md:w-[140px] md:h-[140px] bg-[#FF2D6D] rounded-[24px] md:rounded-[32px] shadow-2xl flex items-center justify-center transform translate-y-6 -translate-x-6 md:translate-y-12 md:-translate-x-12">
            <BookOpen
              className="w-10 h-10 md:w-16 md:h-16 text-white"
              strokeWidth={1.5}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
        </div>
      </main>

      <div className="fixed top-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}
