import { Link } from "react-router-dom";
import { Home, SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 hidden md:block">
        <Link
          to="/"
          className="flex items-center gap-4 transition-transform active:scale-95"
        >
          <div className="w-[50px] h-[50px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="text-[24px] font-bold text-[#1A2B4B]">SynFAQ</span>
        </Link>
      </div>

      <div className="bg-white w-full max-w-[640px] rounded-[48px] shadow-sm border border-[#EBF2FF] p-16 flex flex-col items-center text-center relative z-10">
        <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center text-[#2051FF] mb-10 animate-bounce-slow">
          <SearchX size={64} strokeWidth={1.5} />
        </div>

        <h1 className="text-[80px] font-black text-[#1A2B4B] leading-none mb-4">
          404
        </h1>
        <h2 className="text-[32px] font-bold text-[#0D1B4C] mb-6">
          Упс! Страница не найдена
        </h2>

        <p className="text-[18px] text-[#64748B] mb-12 max-w-[400px]">
          Похоже, этой страницы не существует или она была перенесена по новому
          адресу. Проверьте правильность ссылки.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/" className="flex-1">
            <Button className="w-full h-[64px] bg-[#2051FF] hover:bg-blue-700 rounded-[20px] text-[18px] font-semibold text-white shadow-lg transition-all active:scale-95 flex gap-2">
              <Home size={20} />
              На главную
            </Button>
          </Link>

          <Link to="/catalog" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-[64px] border-[#D8DCE8] text-[#1A2B4B] rounded-[20px] text-[18px] font-semibold hover:bg-slate-50 transition-all active:scale-95 flex gap-2"
            >
              Открыть каталог
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-100/40 rounded-full blur-3xl -z-0" />

      <button
        onClick={() => window.history.back()}
        className="mt-8 text-[#64748B] font-medium flex items-center gap-2 hover:text-[#2051FF] transition-colors"
      >
        <ArrowLeft size={18} />
        Вернуться назад
      </button>
    </div>
  );
}
