import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MessageSquareText, Plus, Loader2 } from "lucide-react";
import { useFaqStore } from "@/store/useFaqStore"; // Подключили стор
import Logo from "@/assets/logo.png";

export default function ProjectsPage() {
  // 1. Достаем данные и функции из стора
  const { projects, fetchProjects, deleteProject, isLoading } = useFaqStore();

  // 2. Загружаем проекты при входе на страницу
  useEffect(() => {
    fetchProjects();
  }, []);

  // 3. Считаем статистику на лету
  const totalProjects = projects.length;
  const totalQuestions = projects.reduce(
    (acc, p) => acc + (p.questionsCount || 0),
    0,
  );

  // 4. Получаем имя пользователя (которое сохранили при логине)
  const userName = localStorage.getItem("user_name") || "Александр";

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
      {/* 1. ХЕДЕР */}
      <header className="h-[80px] bg-white border-b border-[#E9ECEF] px-[60px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[44px] h-[44px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <span className="text-[24px] font-semibold text-[#1A2B4B]">
            SynFAQ
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[#4A5568] text-[16px]">
            Здравствуйте, {userName}
          </span>
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-[#64748B] hover:text-[#2051FF]"
            >
              Выйти
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. КОНТЕНТ */}
      <main className="max-w-[1200px] mx-auto pt-[60px] px-6">
        <div className="mb-12">
          <h1 className="text-[48px] font-semibold text-[#1A2B4B] mb-2">
            Личный кабинет
          </h1>
          <p className="text-[#64748B] text-[20px]">
            Управление вашими FAQ-системами
          </p>
        </div>

        {/* 3. КАРТОЧКИ СТАТИСТИКИ (Динамические) */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-[#EBF2FF] flex items-center gap-8 group hover:shadow-md transition-all">
            <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center text-[#2051FF] group-hover:scale-110 transition-transform">
              <LayoutGrid size={40} />
            </div>
            <div>
              <p className="text-[#64748B] text-[18px] font-medium mb-1">
                Всего проектов
              </p>
              <span className="text-[60px] font-bold text-[#1A2B4B] leading-none tracking-tight">
                {totalProjects}
              </span>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-[#EBF2FF] flex items-center gap-8 group hover:shadow-md transition-all">
            <div className="w-20 h-20 bg-indigo-50 rounded-[24px] flex items-center justify-center text-[#6366F1] group-hover:scale-110 transition-transform">
              <MessageSquareText size={40} />
            </div>
            <div>
              <p className="text-[#64748B] text-[18px] font-medium mb-1">
                Всего вопросов
              </p>
              <span className="text-[60px] font-bold text-[#1A2B4B] leading-none tracking-tight">
                {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* 4. СЕКЦИЯ ПРОЕКТОВ */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[32px] font-semibold text-[#1A2B4B]">
            Мои проекты
          </h2>
          <Link to="/generate">
            <Button className="h-[64px] px-10 bg-[#2051FF] hover:bg-blue-700 rounded-[18px] text-[18px] font-medium text-white shadow-lg flex items-center gap-3 transition-transform active:scale-95">
              <Plus size={24} />
              Создать новый проект
            </Button>
          </Link>
        </div>

        {/* 5. СПИСОК ПРОЕКТОВ */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#2051FF] animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-xl italic">
              У вас пока нет проектов. Создайте свой первый FAQ!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-8 rounded-[28px] shadow-sm border border-[#EBF2FF] hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[28px] font-semibold text-[#1A2B4B]">
                    {project.title}
                  </h3>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[14px] font-medium border border-green-100">
                    Активен
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#F8FAFC] p-4 rounded-xl">
                    <p className="text-[14px] text-[#64748B] mb-1">
                      Дата создания
                    </p>
                    <p className="text-[16px] font-medium text-[#1A2B4B]">
                      {project.createdAt}
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-xl">
                    <p className="text-[14px] text-[#64748B] mb-1">
                      Кол-во вопросов
                    </p>
                    <p className="text-[16px] font-medium text-[#1A2B4B]">
                      {project.questionsCount}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Переход в админку конкретного проекта по его ID */}
                  <Link to={`/admin/${project.id}`} className="flex-1">
                    <Button
                      variant="secondary"
                      className="w-full h-[52px] bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[#1A2B4B] rounded-[12px] text-[16px] font-medium"
                    >
                      Редактировать
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      if (confirm("Удалить этот проект?"))
                        deleteProject(project.id);
                    }}
                    className="flex-1 h-[52px] bg-[#FF2D6D] hover:bg-[#E0245E] text-white rounded-[12px] text-[16px] font-medium"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
