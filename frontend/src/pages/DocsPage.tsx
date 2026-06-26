import { Search, ChevronRight, ExternalLink, LifeBuoy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function DocsPage() {
  const menuItems = [
    {
      title: "НАЧАЛО РАБОТЫ",
      links: ["Обзор", "Аутентификация", "Быстрый старт"],
    },
    {
      title: "ЭНДПОИНТЫ",
      links: ["Пользователи", "Сообщения", "Аналитика", "Логи системы"],
    },
    {
      title: "ДОПОЛНИТЕЛЬНО",
      links: ["Лимиты", "Ошибки API"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* 1. ЛЕВЫЙ САЙДБАР */}
      <aside className="w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-[#EBF2FF] flex items-center justify-center overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-[22px] font-bold text-[#1A2B4B]">SynFAQ</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-8 overflow-y-auto mt-4">
          {menuItems.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-[12px] font-bold text-[#94A3B8] tracking-[0.1em] px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`block px-3 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                        link === "Обзор"
                          ? "bg-blue-50 text-[#2051FF]"
                          : "text-[#64748B] hover:bg-slate-50 hover:text-[#1A2B4B]"
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <div className="flex-1 flex flex-col">
        {/* ВЕРХНЯЯ ПАНЕЛЬ */}
        <header className="h-[80px] px-12 flex items-center justify-between border-b border-[#E2E8F0] bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-[14px] text-[#64748B] font-medium">
            <span>Документация</span>
            <ChevronRight size={16} />
            <span className="text-[#1A2B4B]">Обзор</span>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-[14px] font-semibold text-[#64748B] hover:text-[#2051FF] transition-colors"
          >
            <LifeBuoy size={18} />
            Поддержка
          </a>
        </header>

        <main className="p-12 max-w-[1000px]">
          {/* ЦЕНТРАЛЬНАЯ КАРТОЧКА */}
          <div className="bg-white rounded-[32px] shadow-sm border border-[#E2E8F0] p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2051FF] rounded-full text-[13px] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Version 2.4.0 — Latest
              </div>

              <h1 className="text-[48px] font-bold text-[#1A2B4B] tracking-tight">
                API Documentation
              </h1>

              <p className="text-[18px] text-[#64748B] leading-relaxed max-w-[600px]">
                Добро пожаловать в SynFAQ. REST API документация поможет вам
                интегрировать наши умные FAQ в любую вашу систему.
              </p>

              {/* ПОИСК ПО ДОКЕ */}
              <div className="relative max-w-[600px] mt-8">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <Input
                  placeholder="Поиск по документации..."
                  className="h-[60px] pl-14 rounded-2xl border-[#E2E8F0] bg-[#F8FAFC] text-[16px] focus-visible:ring-0 focus-visible:border-[#2051FF] shadow-none"
                />
              </div>

              {/* ТЕХНИЧЕСКИЕ КАРТОЧКИ */}
              <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-[#F1F5F9]">
                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-[13px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Base URL
                  </p>
                  <code className="text-[16px] text-[#2051FF] font-mono">
                    https://api.syn.com/v1
                  </code>
                </div>
                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-[13px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Content-Type
                  </p>
                  <code className="text-[16px] text-[#1A2B4B] font-mono">
                    application/json
                  </code>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-8 bg-blue-600 rounded-[28px] text-white flex items-center justify-between shadow-xl shadow-blue-100">
            <div>
              <h3 className="text-[20px] font-bold mb-1">
                Нужна помощь с интеграцией?
              </h3>
              <p className="text-blue-100">
                Свяжитесь с нашими инженерами для быстрого старта.
              </p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
              Написать в поддержку
              <ExternalLink size={18} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
