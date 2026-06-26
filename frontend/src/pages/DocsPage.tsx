import {
  ChevronRight,
  Book,
  Settings,
  Globe,
  Zap,
  Code,
  Mic,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

export default function DocsPage() {
  const menuItems = [
    {
      title: "О ПЛАТФОРМЕ",
      links: ["Назначение", "Главная страница"],
    },
    {
      title: "РУКОВОДСТВО",
      links: ["Личный кабинет", "Создание проекта", "Управление базой"],
    },
    {
      title: "ДЛЯ ПОЛЬЗОВАТЕЛЕЙ",
      links: ["Публичная страница", "Поиск информации"],
    },
    {
      title: "API ИНТЕГРАЦИЯ",
      links: [
        "Генерация FAQ",
        "Эндпоинты управления",
        "Интеллектуальный поиск",
        "Формат данных",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans scroll-smooth">
      {/* 1. ЛЕВЫЙ САЙДБАР */}
      <aside className="w-[300px] bg-white border-r border-[#E2E8F0] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-[#EBF2FF] flex items-center justify-center overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-[22px] font-bold text-[#1A2B4B]">
              SynFAQ <span className="text-blue-600 text-xs">Docs</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-8 overflow-y-auto mt-4 pb-10">
          {menuItems.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-[11px] font-bold text-[#94A3B8] tracking-[0.15em] px-2 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link}>
                    {/* Исправленные ссылки-якоря */}
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block px-3 py-2 rounded-lg text-[15px] font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#2051FF] transition-colors"
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
        <header className="h-[80px] px-6 md:px-12 flex items-center justify-between border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 text-[14px] text-[#64748B] font-medium">
            <span>Документация</span>
            <ChevronRight size={16} />
            <span className="text-[#1A2B4B]">SynFAQ Guide</span>
          </div>
          <Link to="/catalog">
            <button className="text-sm font-semibold text-[#2051FF] flex items-center gap-2 hover:opacity-80">
              Перейти в каталог <ArrowRight size={14} />
            </button>
          </Link>
        </header>

        <main className="p-6 md:p-12 max-w-[1000px] mx-auto">
          {/* ГЛАВНЫЙ ЗАГОЛОВОК */}
          <div className="mb-20">
            <h1 className="text-[48px] md:text-[64px] font-bold text-[#1A2B4B] tracking-tight mb-6 leading-tight">
              Руководство пользователя
            </h1>
            <p className="text-[22px] text-[#64748B] leading-relaxed max-w-[800px]">
              SynFAQ — это инновационный конструктор интерактивных FAQ-систем,
              который понимает ваших клиентов с полуслова благодаря ML-поиску и
              голосовому вводу.
            </p>
          </div>

          {/* 1. НАЗНАЧЕНИЕ */}
          <section id="назначение" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#2051FF] rounded-lg">
                <Book size={24} />
              </div>
              1. Назначение системы
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-8 shadow-sm space-y-6">
              <p className="text-[#4A5568] text-lg">
                SynFAQ — это платформа для создания и управления базами знаний.
                Сервис позволяет:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Создавать собственные базы знаний",
                  "Публиковать FAQ для пользователей",
                  "Выполнять поиск по вопросам",
                  "Использовать интеллектуальный поиск",
                  "Генерировать FAQ на основе ИИ",
                  "Управлять категориями через кабинет",
                  "Просматривать публичный каталог",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-[#1A2B4B] font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. ГЛАВНАЯ СТРАНИЦА */}
          <section id="главная-страница" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Zap size={24} />
              </div>
              2. Главная страница
            </h2>
            <div className="prose prose-slate max-w-none text-[#4A5568] text-lg leading-relaxed border-l-4 border-indigo-100 pl-8">
              <p>
                На главной странице доступны информация о платформе, переход к
                каталогу и управление сессией пользователя.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-400 uppercase text-xs mb-4">
                    Для гостей
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"> Кнопка «Войти»</li>
                    <li className="flex items-center gap-2">
                      {" "}
                      Кнопка «Начать бесплатно»
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-400 uppercase text-xs mb-4">
                    Для авторизованных
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"> Личный кабинет</li>
                    <li className="flex items-center gap-2"> Кнопка «Выйти»</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ЛИЧНЫЙ КАБИНЕТ */}
          <section id="личный-кабинет" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Settings size={24} />
              </div>
              3. Личный кабинет
            </h2>
            <div className="prose prose-slate max-w-none text-[#4A5568] text-lg leading-relaxed">
              <p>
                Здесь отображаются все созданные проекты. Для каждого из них вы
                видите:
              </p>
              <div className="flex flex-wrap gap-3 my-6">
                {["Название", "Дата создания", "Кол-во вопросов", "Статус"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-white border rounded-full text-sm font-bold shadow-sm"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <p>
                Доступные действия: <strong>редактирование</strong>,{" "}
                <strong>удаление</strong> и <strong>создание</strong> новых
                FAQ-систем.
              </p>
            </div>
          </section>

          {/* 4. СОЗДАНИЕ ПРОЕКТА */}
          <section id="создание-проекта" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-8">
              4. Создание нового проекта
            </h2>

            <div className="space-y-12">
              <div className="relative pl-12 border-l-2 border-blue-100">
                <div className="absolute left-[-16px] top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4.1
                </div>
                <h3 className="text-[24px] font-bold text-[#1A2B4B] mb-4">
                  Генерация FAQ (AI)
                </h3>
                <p className="text-[#64748B] mb-6">
                  Режим для автоматического создания базы знаний с помощью
                  нейросетей.
                </p>
                <ol className="space-y-3 list-decimal list-inside text-[#1A2B4B] font-medium">
                  <li>Выберите вкладку «Генерация»</li>
                  <li>Укажите название и публичную ссылку (URL)</li>
                  <li>Введите текстовое описание вашего бизнеса/проекта</li>
                  <li>Загрузите файл (PDF/TXT) для анализа</li>
                  <li>
                    Выберите количество вопросов (5–20) и нажмите
                    «Сгенерировать»
                  </li>
                </ol>
              </div>

              <div className="relative pl-12 border-l-2 border-slate-100">
                <div className="absolute left-[-16px] top-0 w-8 h-8 bg-slate-600 text-white rounded-full flex items-center justify-center font-bold">
                  4.2
                </div>
                <h3 className="text-[24px] font-bold text-[#1A2B4B] mb-4">
                  Ручное создание
                </h3>
                <p className="text-[#64748B] mb-6">
                  Режим для самостоятельного и точного наполнения базы данных.
                </p>
                <ol className="space-y-3 list-decimal list-inside text-[#1A2B4B] font-medium">
                  <li>Выберите вкладку «Ручной»</li>
                  <li>Укажите название и публичную ссылку</li>
                  <li>Нажмите «Создать и перейти» для перехода в редактор</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 5. УПРАВЛЕНИЕ БАЗОЙ */}
          <section id="управление-базой" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-8 flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Code size={24} />
              </div>
              5. Управление базой знаний
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                <h4 className="font-bold text-[#1A2B4B] mb-2">Категории</h4>
                <p className="text-sm text-[#64748B]">
                  Нажмите «Новая категория», введите название и сохраните для
                  группировки вопросов.
                </p>
              </div>
              <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                <h4 className="font-bold text-[#1A2B4B] mb-2">Вопросы</h4>
                <p className="text-sm text-[#64748B]">
                  Кнопка «Добавить вопрос» позволяет наполнять базу контентом в
                  реальном времени.
                </p>
              </div>
              <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                <h4 className="font-bold text-[#1A2B4B] mb-2">Теги</h4>
                <p className="text-sm text-[#64748B]">
                  Настраивайте популярные поисковые запросы для главной страницы
                  вашего FAQ.
                </p>
              </div>
            </div>
          </section>

          {/* 6. ПУБЛИЧНАЯ СТРАНИЦА */}
          <section id="публичная-страница" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-8">
              6. Публичная страница FAQ
            </h2>
            <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm">
              <p className="text-[#4A5568] text-lg leading-relaxed">
                Каждый проект имеет собственную публичную страницу, где доступны
                строка поиска, список категорий и интерактивный список вопросов
                с ответами.
              </p>
            </div>
          </section>

          {/* 7. ПОИСК ИНФОРМАЦИИ */}
          <section id="поиск-информации" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Globe size={24} />
              </div>
              7. Поиск информации
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[20px] font-bold mb-4 flex items-center gap-2 text-[#1A2B4B]">
                  7.1 Текстовый поиск
                </h3>
                <p className="text-[#4A5568] leading-relaxed">
                  Введите запрос в строку поиска. Система использует
                  интеллектуальный подбор, находя релевантные вопросы даже при
                  использовании синонимов.
                </p>
              </div>
              <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[20px] font-bold mb-4 flex items-center gap-2 text-[#1A2B4B]">
                  <Mic size={20} className="text-blue-500" /> 7.2 Голосовой
                  поиск
                </h3>
                <p className="text-[#4A5568] leading-relaxed">
                  Нажмите кнопку микрофона, разрешите доступ к устройству и
                  произнесите вопрос. Система автоматически преобразует речь в
                  текст и выполнит поиск.
                </p>
              </div>
            </div>
          </section>

          {/* 8. API ИНТЕГРАЦИЯ */}
          <section id="генерация-faq" className="mb-20 scroll-mt-28">
            <h2 className="text-[32px] font-bold text-[#1A2B4B] mb-8 flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Code size={24} />
              </div>
              8. Работа с REST API
            </h2>

            <div className="space-y-12">
              <div>
                <h3
                  id="эндпоинты-управления"
                  className="text-[22px] font-bold text-[#1A2B4B] mb-4"
                >
                  Эндпоинты управления FAQ
                </h3>
                <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto">
                  <table className="w-full text-left font-mono text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="pb-4">МЕТОД</th>
                        <th className="pb-4">ЭНДПОИНТ</th>
                        <th className="pb-4">ОПИСАНИЕ</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr>
                        <td className="py-4 text-green-400">GET</td>
                        <td className="py-4">/api/v1/faqs</td>
                        <td className="py-4 text-slate-500">
                          Список всех сохранённых FAQ
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 text-blue-400">POST</td>
                        <td className="py-4">/api/v1/faqs</td>
                        <td className="py-4 text-slate-500">
                          Создание новой записи
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 text-orange-400">PUT</td>
                        <td className="py-4">/api/v1/faqs/{"{id}"}</td>
                        <td className="py-4 text-slate-500">
                          Редактирование записи
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 text-red-400">DELETE</td>
                        <td className="py-4">/api/v1/faqs/{"{id}"}</td>
                        <td className="py-4 text-slate-500">Удаление записи</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3
                  id="интеллектуальный-поиск"
                  className="text-[22px] font-bold text-[#1A2B4B] mb-4"
                >
                  Интеллектуальный поиск
                </h3>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-[#1A2B4B] mb-2 font-mono">
                    GET /api/v1/search?query=...
                  </p>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    Поиск выполняется по тексту вопроса, ответам, ключевым
                    словам и синонимам.
                  </p>
                </div>
              </div>

              <div
                id="формат-данных"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="p-8 bg-white border border-[#E2E8F0] rounded-[32px] shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-red-600">
                    <AlertTriangle size={18} /> Коды ошибок
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <strong className="text-[#1A2B4B]">422</strong> — Ошибка
                      валидации данных
                    </li>
                    <li>
                      <strong className="text-[#1A2B4B]">502</strong> — Ошибка
                      внешнего сервиса
                    </li>
                  </ul>
                </div>
                <div className="p-8 bg-white border border-[#E2E8F0] rounded-[32px] shadow-sm">
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-[#1A2B4B]">
                    <Info size={18} /> Важно
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    Время генерации больших данных может достигать{" "}
                    <strong>60 секунд</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. РЕКОМЕНДАЦИИ */}
          <section id="рекомендации" className="mb-20 scroll-mt-28">
            <div className="p-10 bg-[#1A2B4B] rounded-[40px] text-white">
              <h3 className="text-[24px] font-bold mb-6">
                9. Рекомендации по использованию
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">01.</span>
                  <span>
                    Используйте понятные и лаконичные формулировки вопросов.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">02.</span>
                  <span>
                    Создавайте тематические категории для удобной навигации.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">03.</span>
                  <span>
                    Регулярно обновляйте базу знаний при изменениях в бизнесе.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">04.</span>
                  <span>
                    Проверяйте результаты поиска после внесения изменений.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}
