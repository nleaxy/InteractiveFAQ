import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Переключатель Вход/Регистрация

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-sans">
      {/* КАРТОЧКА ЛОГИНА */}
      <div className="w-full max-w-[540px] bg-white rounded-[32px] shadow-sm p-12 flex flex-col items-center border border-[#EBF2FF]">
        {/* ЛОГОТИП */}
        <div className="w-[80px] h-[80px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* ЗАГОЛОВОК */}
        <h1 className="text-[32px] font-semibold text-[#1A2B4B] mb-2">
          SynFAQ
        </h1>
        <h2 className="text-[24px] font-medium text-[#0D1B4C] mb-2 text-center leading-tight">
          Добро пожаловать
        </h2>
        <p className="text-[#64748B] text-[16px] mb-8 text-center">
          Управляйте вашими FAQ проектами эффективно
        </p>

        {/* ПЕРЕКЛЮЧАТЕЛЬ (Вход / Регистрация) */}
        <div className="w-full max-w-[280px] h-[48px] bg-[#EBF0F7] rounded-full p-1 flex mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-full text-[16px] font-medium transition-all ${
              isLogin ? "bg-white text-[#1A2B4B] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-full text-[16px] font-medium transition-all ${
              !isLogin ? "bg-white text-[#1A2B4B] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* ФОРМА */}
        <form className="w-full space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[16px] font-medium text-[#1A2B4B] ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <Input
                type="email"
                placeholder="example@mail.com"
                className="w-full h-[56px] bg-[#F8FAFC] border-[#E2E8F0] rounded-[16px] pl-12 text-[16px] outline-none focus-visible:ring-0 focus-visible:border-[#2051FF] transition-all"
              />
            </div>
          </div>

          {/* Пароль */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[16px] font-medium text-[#1A2B4B]">
                Пароль
              </label>
              <button
                type="button"
                className="text-[14px] text-[#64748B] hover:text-[#2051FF]"
              >
                Забыли пароль?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <Input
                type="password"
                placeholder="••••••••"
                className="w-full h-[56px] bg-[#F8FAFC] border-[#E2E8F0] rounded-[16px] pl-12 text-[16px] outline-none focus-visible:ring-0 focus-visible:border-[#2051FF] transition-all"
              />
            </div>
          </div>

          {/* КНОПКА ВОЙТИ */}
          <Button
            type="submit"
            className="w-full h-[60px] bg-[#2051FF] hover:bg-blue-700 rounded-[16px] text-[18px] font-medium text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            Войти в систему
          </Button>
        </form>
      </div>
    </div>
  );
}
