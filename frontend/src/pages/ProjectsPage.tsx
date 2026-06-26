import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  MessageSquareText,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProjectsPage() {
  const { projects, fetchProjects, deleteProject, isLoading } = useFaqStore();

  const [isDelModalOpen, setIsDelOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: number | string;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const totalQuestions = projects.reduce(
    (acc, p) => acc + (p.questionsCount || 0),
    0,
  );
  const userName = localStorage.getItem("user_name") || "Александр";

  const askDelete = (id: number | string, title: string) => {
    setProjectToDelete({ id, title });
    setIsDelOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        toast.success(`Проект "${projectToDelete.title}" удален`);
      } catch (error) {
        toast.error("Не удалось удалить проект");
      } finally {
        setIsDelOpen(false);
        setProjectToDelete(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
      <header className="h-auto min-h-[70px] md:h-[80px] bg-white border-b border-[#E9ECEF] px-4 md:px-[60px] flex items-center justify-between py-3 md:py-0 sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/" className="transition-transform active:scale-95">
            <div className="w-10 h-10 md:w-[44px] md:h-[44px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
          </Link>
          <span className="text-xl md:text-[24px] font-semibold text-[#1A2B4B]">
            SynFAQ
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-[#4A5568] text-sm md:text-[16px] hidden sm:block">
            Здравствуйте, {userName}
          </span>
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-[#64748B] hover:text-[#2051FF] h-9 md:h-10 text-sm md:text-base"
            >
              Выйти
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto pt-8 md:pt-[60px] px-4 md:px-6">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-[48px] font-semibold text-[#1A2B4B] mb-2 leading-tight">
            Личный кабинет
          </h1>
          <p className="text-[#64748B] text-lg md:text-[20px]">
            Управление вашими FAQ-системами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
          <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] shadow-sm border border-[#EBF2FF] flex items-center gap-5 md:gap-8 group hover:shadow-md transition-all">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-50 rounded-2xl md:rounded-[24px] flex items-center justify-center text-[#2051FF] group-hover:scale-110 transition-transform flex-shrink-0">
              <LayoutGrid className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <p className="text-[#64748B] text-sm md:text-[18px] font-medium mb-1">
                Всего проектов
              </p>
              <span className="text-4xl md:text-[60px] font-bold text-[#1A2B4B] leading-none tracking-tight">
                {totalProjects}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] shadow-sm border border-[#EBF2FF] flex items-center gap-5 md:gap-8 group hover:shadow-md transition-all">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-indigo-50 rounded-2xl md:rounded-[24px] flex items-center justify-center text-[#6366F1] group-hover:scale-110 transition-transform flex-shrink-0">
              <MessageSquareText className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <p className="text-[#64748B] text-sm md:text-[18px] font-medium mb-1">
                Всего вопросов
              </p>
              <span className="text-4xl md:text-[60px] font-bold text-[#1A2B4B] leading-none tracking-tight">
                {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-[32px] font-semibold text-[#1A2B4B]">
            Мои проекты
          </h2>
          <Link to="/generate" className="w-full md:w-auto">
            <Button className="w-full md:h-[64px] md:px-10 bg-[#2051FF] hover:bg-blue-700 rounded-xl md:rounded-[18px] text-base md:text-[18px] font-medium text-white shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 py-6 md:py-0">
              <Plus className="w-5 h-5 md:w-6 md:h-6" />
              Создать новый проект
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#2051FF] animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 md:p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg italic">
              У вас пока нет проектов. Создайте свой первый FAQ!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[28px] shadow-sm border border-[#EBF2FF] hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-6 gap-2">
                  <h3 className="text-xl md:text-[28px] font-semibold text-[#1A2B4B] leading-tight truncate">
                    {project.title}
                  </h3>
                  <span className="flex-shrink-0 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-100">
                    Активен
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                  <div className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl">
                    <p className="text-[12px] text-[#64748B] mb-1">Создан</p>
                    <p className="text-sm md:text-[16px] font-medium text-[#1A2B4B]">
                      {project.createdAt}
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl">
                    <p className="text-[12px] text-[#64748B] mb-1">Вопросы</p>
                    <p className="text-sm md:text-[16px] font-medium text-[#1A2B4B]">
                      {project.questionsCount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <Link to={`/admin/${project.slug}`} className="flex-1">
                    <Button
                      variant="secondary"
                      className="w-full h-11 md:h-[52px] bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[#1A2B4B] rounded-xl text-sm font-medium"
                    >
                      Правка
                    </Button>
                  </Link>
                  <Button
                    onClick={() => askDelete(project.id, project.title)}
                    className="flex-1 h-11 md:h-[52px] bg-[#FF2D6D] hover:bg-[#E0245E] text-white rounded-xl text-sm font-medium"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isDelModalOpen} onOpenChange={setIsDelOpen}>
        <DialogContent className="bg-white rounded-[32px] p-8 max-w-[440px] border-none shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle size={40} />
            </div>
            <DialogTitle className="text-[24px] font-bold text-[#1A2B4B]">
              Удалить проект?
            </DialogTitle>
            <DialogDescription className="text-[16px] text-[#64748B] mt-2">
              Вы собираетесь удалить проект{" "}
              <span className="font-bold text-[#1A2B4B]">
                "{projectToDelete?.title}"
              </span>
              . Это действие нельзя будет отменить, все вопросы будут стерты.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setIsDelOpen(false)}
              className="h-[56px] rounded-xl border-[#D8DCE8] text-[#1A2B4B] font-semibold"
            >
              Отмена
            </Button>
            <Button
              onClick={confirmDelete}
              className="h-[56px] rounded-xl bg-[#FF2D6D] hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-100"
            >
              Да, удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
