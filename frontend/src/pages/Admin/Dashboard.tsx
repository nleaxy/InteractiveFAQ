import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Hash,
  Filter,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";

export default function Dashboard() {
  const { projectId } = useParams();
  const project = useFaqStore((state) => state.getProjectById(projectId!));
  const deleteFaq = useFaqStore((state) => state.deleteFaq);
  const addFaq = useFaqStore((state) => state.addFaq);
  const updateFaq = useFaqStore((state) => state.updateFaq);
  const addCategory = useFaqStore((state) => state.addCategory); // Функция из стора
  const setPopularQueries = useFaqStore((state) => state.setPopularQueries);

  // Состояния
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilterCategory, setActiveFilterCategory] = useState<
    string | null
  >(null);

  // Состояния для нового вопроса
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Состояния для новой категории
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Состояния для редактирования
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Сбор всех вопросов для отображения
  const allFaqs = useMemo(() => {
    if (!project?.categories) return [];
    return project.categories.flatMap((cat) =>
      cat.faqs.map((faq) => ({
        ...faq,
        categoryId: cat.id,
        categoryName: cat.name,
      })),
    );
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <h1 className="text-2xl font-bold text-slate-400">Проект не найден</h1>
      </div>
    );
  }

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilterCategory
      ? faq.categoryId === activeFilterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddFaq = () => {
    if (!newQuestion || !newAnswer || !selectedCategory)
      return alert("Заполните все поля");
    addFaq(projectId!, selectedCategory, {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
    });
    setNewQuestion("");
    setNewAnswer("");
    setIsDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCatName) return;
    addCategory(projectId!, {
      id: "cat-" + Date.now(),
      name: newCatName,
      faqs: [],
    });
    setNewCatName("");
    setIsCatDialogOpen(false);
  };

  const openEditModal = (faq: any) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setIsEditOpen(true);
  };

  const handleUpdateFaq = () => {
    updateFaq(projectId!, editId, {
      question: editQuestion,
      answer: editAnswer,
    });
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20 relative overflow-x-hidden">
      {/* 1. ХЕДЕР */}
      <header className="absolute top-[49px] left-[49px] flex items-center gap-[28px]">
        <Link to="/" className="transition-transform active:scale-95">
          <div className="w-[103px] h-[103px] bg-white rounded-full shadow-md flex items-center justify-center border border-[#EBF2FF] overflow-hidden flex-shrink-0 cursor-pointer">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          <h1 className="text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
            SynFAQ {project.title}
          </h1>
          <p className="text-[#2051FF] text-[20px] font-medium mt-0">
            Understanding meaning, not just words
          </p>
        </div>
      </header>

      <main className="flex flex-col items-center w-full pt-[160px]">
        <div className="w-[940px] flex flex-col relative">
          {/* ВЕРНУЛИ ЗАГОЛОВОК */}
          <h2 className="text-[40px] font-normal text-[#0D1B4C] text-center w-full mb-[60px]">
            Управление FAQ
          </h2>

          {/* ПОИСК */}
          <div className="mt-[20px] w-full">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[72px] bg-white border-[#D8DCE8] border-[1px] rounded-[20px] pl-8 text-[20px] text-[#0D1B4C] shadow-sm focus-visible:border-[#2051FF]"
              placeholder="Поиск вопроса..."
            />
          </div>

          {/* УПРАВЛЕНИЕ КАТЕГОРИЯМИ */}
          <div className="mt-8 flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2 text-slate-400">
              <Filter size={18} />
              <span className="text-[14px] font-medium uppercase tracking-wider">
                Фильтр:
              </span>
            </div>
            <button
              onClick={() => setActiveFilterCategory(null)}
              className={cn(
                "px-5 py-2 rounded-full text-[14px] font-semibold transition-all border",
                !activeFilterCategory
                  ? "bg-[#2051FF] text-white border-[#2051FF]"
                  : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
              )}
            >
              Все
            </button>
            {project.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilterCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-[14px] font-semibold transition-all border",
                  activeFilterCategory === cat.id
                    ? "bg-[#2051FF] text-white border-[#2051FF]"
                    : "bg-white text-[#4A5568] border-[#D8DCE8] hover:bg-blue-50",
                )}
              >
                {cat.name}
              </button>
            ))}

            {/* КНОПКА ДОБАВЛЕНИЯ КАТЕГОРИИ */}
            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
              <DialogTrigger asChild>
                <button className="ml-2 flex items-center gap-1 px-4 py-2 rounded-full border border-dashed border-[#2051FF] text-[#2051FF] text-[14px] font-medium hover:bg-blue-50 transition-all">
                  <FolderPlus size={16} />
                  <span>+ Категория</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[24px] p-8 max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-[22px] font-semibold">
                    Новая категория
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Название (например: Оплата)"
                    className="h-[56px] rounded-[14px]"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="w-full h-[56px] bg-[#2051FF] text-white rounded-[14px]"
                  >
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
          <div className="mt-[32px] w-full bg-white p-6 rounded-[24px] border border-[#D8DCE8] shadow-sm">
            <label className="text-[18px] font-medium text-[#0D1B4C] mb-3 block italic">
              Популярные запросы (через запятую)
            </label>
            <Input
              value={project.popularQueries}
              onChange={(e) => setPopularQueries(projectId!, e.target.value)}
              className="w-full h-[56px] bg-[#F9FBFF] border-[#D8DCE8] rounded-[14px] px-6 text-[18px]"
            />
          </div>

          {/* КНОПКА ДОБАВИТЬ ВОПРОС */}
          <div className="mt-[32px] flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-[230px] h-[60px] bg-[#2051FF] hover:bg-[#0044FF] rounded-[15px] shadow-lg transition-transform active:scale-95">
                  <span className="text-[20px] font-normal text-white">
                    + Добавить вопрос
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[24px] p-8 max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-[24px] font-semibold text-[#1A2B4B]">
                    Новый вопрос
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <Label className="text-[#4A5568]">Выберите категорию</Label>
                    <Select onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-[56px] rounded-[14px] border-[#D8DCE8]">
                        <SelectValue placeholder="Категория" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {project.categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Вопрос"
                    className="h-[56px] rounded-[14px]"
                  />
                  <Textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Ответ"
                    className="min-h-[120px] rounded-[14px]"
                  />
                  <Button
                    onClick={handleAddFaq}
                    className="w-full h-[56px] bg-[#2051FF] text-white rounded-[14px]"
                  >
                    Добавить в базу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* СПИСОК FAQ */}
          <div className="mt-[30px] space-y-[16px] w-full pb-20">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="relative w-full flex items-center group"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={`item-${faq.id}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="bg-white px-8 h-[72px] rounded-[20px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm flex items-center py-0">
                      <div className="flex flex-col items-start">
                        <span className="text-[11px] text-[#2051FF] font-bold uppercase mb-1">
                          {faq.categoryName}
                        </span>
                        <span className="text-[20px] text-[#4A5568] font-normal text-left">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white mt-2 px-8 py-6 rounded-[20px] border-[#D8DCE8] border-[1px] text-[18px] text-[#4A5568]/80 shadow-md">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="absolute left-[calc(100%+24px)] flex items-center gap-[12px] h-[72px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-[44px] h-[44px] text-[#2051FF] hover:bg-blue-100/50 rounded-full"
                    onClick={() => openEditModal(faq)}
                  >
                    <Pencil size={24} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-[44px] h-[44px] text-[#FF2D6D] hover:bg-pink-100/50 rounded-full"
                    onClick={() => deleteFaq(projectId!, faq.id)}
                  >
                    <Trash2 size={24} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* МОДАЛКА РЕДАКТИРОВАНИЯ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-[24px] p-8 max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#1A2B4B]">
              Редактировать
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <Input
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              className="h-[56px] rounded-[14px]"
            />
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="min-h-[120px] rounded-[14px]"
            />
            <Button
              onClick={handleUpdateFaq}
              className="w-full h-[56px] bg-[#2051FF] text-white rounded-[14px]"
            >
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
