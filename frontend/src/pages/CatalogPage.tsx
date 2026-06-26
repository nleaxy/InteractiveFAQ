import { useEffect, useState } from "react";
import { Search, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";

export default function CatalogPage() {
  const { publicCatalog, fetchPublicCatalog, isLoading } = useFaqStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublicCatalog();
  }, []);

  const filteredCatalog = publicCatalog.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
      {/* ХЕДЕР */}
      <header className="h-auto py-4 md:h-[100px] bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#E9ECEF] px-4 md:px-[49px] flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 md:gap-4 transition-transform active:scale-95"
        >
          <div className="w-10 h-10 md:w-[50px] md:h-[50px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="text-xl md:text-[24px] font-bold text-[#1A2B4B]">
            SynFAQ{" "}
            <span className="text-[#2051FF] hidden sm:inline">Catalog</span>
          </span>
        </Link>

        <Link to="/login">
          <Button className="bg-[#2051FF] hover:bg-blue-700 text-white rounded-xl px-4 md:px-6 h-10 md:h-12 text-sm md:text-base transition-all active:scale-95">
            Создать проект
          </Button>
        </Link>
      </header>

      <main className="max-w-[1200px] mx-auto pt-8 md:pt-16 px-4 md:px-6">
        {/* ЗАГОЛОВОК И ПОИСК */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-[56px] font-bold text-[#1A2B4B] mb-4 tracking-tight leading-tight px-2">
            Публичные базы знаний
          </h1>
          <p className="text-base md:text-[20px] text-[#64748B] max-w-[700px] mx-auto px-4">
            Изучайте опыт других сообществ или найдите нужный ответ в открытых
            проектах наших пользователей.
          </p>

          <div className="max-w-[640px] mx-auto mt-8 md:mt-10 relative px-2">
            {/* Исправленная иконка поиска */}
            <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 md:w-6 md:h-6" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск проекта..."
              className="h-14 md:h-[72px] pl-12 md:pl-16 pr-6 rounded-2xl md:rounded-[24px] border-[#D8DCE8] text-lg md:text-[20px] shadow-sm focus-visible:border-[#2051FF] bg-white"
            />
          </div>
        </div>

        {/* СПИСОК КАРТОЧЕК */}
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            {/* Исправленная иконка загрузки */}
            <Loader2 className="animate-spin text-[#2051FF] w-10 h-10 md:w-12 md:h-12" />
            <p className="text-slate-500 font-medium">Подгружаем проекты...</p>
          </div>
        ) : filteredCatalog.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-white rounded-[32px] md:rounded-[40px] border-2 border-dashed border-slate-200 mx-2">
            <p className="text-slate-400 text-lg md:text-xl italic">
              Проекты не найдены
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCatalog.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-[#EBF2FF] hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col h-full"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#2051FF] mb-5 md:mb-6 group-hover:bg-[#2051FF] group-hover:text-white transition-colors">
                  {/* Исправленная иконка книги */}
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                </div>

                <h3 className="text-xl md:text-[26px] font-bold text-[#1A2B4B] mb-2 leading-tight">
                  {project.title}
                </h3>
                <div className="text-slate-500 mb-6 md:mb-8 flex-grow">
                  <p className="flex items-center gap-2 text-sm md:text-[16px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {project.questionsCount} вопросов в базе
                  </p>
                  <p className="text-xs md:text-[14px] mt-1 opacity-70">
                    Создан: {project.createdAt}
                  </p>
                </div>

                <Link to={`/faq/${project.slug}`} className="mt-auto">
                  <Button className="w-full h-12 md:h-[56px] bg-[#F8FAFC] hover:bg-[#2051FF] hover:text-white text-[#2051FF] font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 border border-[#EBF2FF] transition-all">
                    <span>Смотреть FAQ</span>
                    {/* Исправленная иконка стрелки */}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
