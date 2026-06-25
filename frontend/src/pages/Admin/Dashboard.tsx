import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Hash,
  Filter,
  FolderPlus,
  Loader2,
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
  // 1. Берем projectSlug вместо projectId из параметров URL
  const { projectSlug } = useParams();

  const {
    activeProject, // Текущий найденный проект
    fetchProjectBySlug, // Новая функция поиска по тексту
    currentProjectFaqs,
    fetchProjectFaqs,
    addFaq,
    deleteFaq,
    updateFaq,
    updateSettings,
    isLoading,
  } = useFaqStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilterCategory, setActiveFilterCategory] = useState<
    string | null
  >(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // 2. Логика загрузки: сначала ищем ID по слагу, потом грузим вопросы
  useEffect(() => {
    const loadData = async () => {
      if (projectSlug) {
        const foundProject = await fetchProjectBySlug(projectSlug);
        if (foundProject) {
          fetchProjectFaqs(foundProject.id);
        }
      }
    };
    loadData();
  }, [projectSlug]);

  const uniqueCategories = useMemo(() => {
    const names = currentProjectFaqs.map((f) => f.category).filter(Boolean);
    const unique = Array.from(new Set(names));
    if (selectedCategory && !unique.includes(selectedCategory)) {
      unique.push(selectedCategory);
    }
    return unique;
  }, [currentProjectFaqs, selectedCategory]);

  const filteredFaqs = currentProjectFaqs.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilterCategory
      ? faq.category === activeFilterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddFaq = async () => {
    if (!newQuestion || !newAnswer || !selectedCategory)
      return alert("Заполните все поля и выберите категорию");

    // Используем activeProject.id
    await addFaq(activeProject!.id, {
      question: newQuestion,
      answer: newAnswer,
      category: selectedCategory,
      synonyms: [],
    });

    setNewQuestion("");
    setNewAnswer("");
    setIsDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCatName) return;
    setSelectedCategory(newCatName);
    setActiveFilterCategory(newCatName);
    setIsCatDialogOpen(false);
    setNewCatName("");
  };

  const openEditModal = (faq: any) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditCategory(faq.category);
    setIsEditOpen(true);
  };

  const handleUpdateFaq = async () => {
    if (editId && activeProject) {
      await updateFaq(activeProject.id, editId, {
        question: editQuestion,
        answer: editAnswer,
        category: editCategory,
        synonyms: [],
      });
      setIsEditOpen(false);
    }
  };

  if (!activeProject && !isLoading) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20 relative overflow-x-hidden">
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
            SynFAQ {activeProject?.title || "Загрузка..."}
          </h1>
          <p className="text-[#2051FF] text-[20px] font-medium mt-0 italic">
            Управление базой знаний
          </p>
        </div>
      </header>

      <main className="flex flex-col items-center w-full pt-[160px]">
        <div className="w-[940px] flex flex-col relative">
          <h2 className="text-[40px] font-normal text-[#0D1B4C] text-center w-full mb-[60px]">
            Управление FAQ
          </h2>

          {/* ПОИСК */}
          <div className="mt-[20px] w-full">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[72px] bg-white border-[#D8DCE8] border-[1px] rounded-[20px] pl-8 text-[20px] text-[#0D1B4C] shadow-sm focus-visible:border-[#2051FF]"
              placeholder="Поиск вопроса по тексту..."
            />
          </div>

          {/* КАТЕГОРИИ */}
          <div className="mt-8 flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2 text-slate-400">
              <Filter size={18} />{" "}
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
                  : "bg-white text-[#4A5568] border-[#D8DCE8]",
              )}
            >
              Все ({currentProjectFaqs.length})
            </button>
            {uniqueCategories.map((catName) => (
              <button
                key={catName}
                onClick={() => setActiveFilterCategory(catName)}
                className={cn(
                  "px-5 py-2 rounded-full text-[14px] font-semibold transition-all border",
                  activeFilterCategory === catName
                    ? "bg-[#2051FF] text-white border-[#2051FF]"
                    : "bg-white text-[#4A5568] border-[#D8DCE8]",
                )}
              >
                {catName}
              </button>
            ))}

            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
              <DialogTrigger asChild>
                <button className="ml-2 flex items-center gap-1 px-4 py-2 rounded-full border border-dashed border-[#2051FF] text-[#2051FF] text-[14px] font-medium hover:bg-blue-50 transition-all">
                  <FolderPlus size={16} /> <span>+ Новая категория</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[24px] p-8 max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-[22px] font-semibold">
                    Название категории
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Например: Доставка"
                    className="h-[56px] rounded-[14px]"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="w-full h-[56px] bg-[#2051FF] text-white rounded-[14px]"
                  >
                    Готово
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
          <div className="mt-[32px] w-full bg-white p-6 rounded-[24px] border border-[#D8DCE8] shadow-sm">
            <label className="text-[18px] font-medium text-[#0D1B4C] mb-3 block italic">
              Теги для главной страницы (через запятую)
            </label>
            <Input
              value={activeProject?.popularQueries || ""}
              onChange={(e) =>
                updateSettings(activeProject!.id, e.target.value)
              }
              className="w-full h-[56px] bg-[#F9FBFF] border-[#D8DCE8] rounded-[14px] px-6 text-[18px]"
            />
          </div>

          {/* ТВОЯ ОРИГИНАЛЬНАЯ КНОПКА */}
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
                    <Label>Категория</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-[56px] rounded-[14px] border-[#D8DCE8]">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {uniqueCategories.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
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
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-500" size={40} />
              </div>
            ) : (
              filteredFaqs.map((faq) => (
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
                        <div className="flex flex-col items-start text-left">
                          <span className="text-[11px] text-[#2051FF] font-bold uppercase mb-1">
                            {faq.category}
                          </span>
                          <span className="text-[20px] text-[#4A5568] font-normal">
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
                      onClick={() => {
                        if (confirm("Удалить?"))
                          deleteFaq(activeProject!.id, faq.id);
                      }}
                    >
                      <Trash2 size={24} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-[24px] p-8 max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#1A2B4B]">
              Редактировать
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <Label>Категория</Label>
            <Input
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="h-[56px] rounded-[14px]"
            />
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
