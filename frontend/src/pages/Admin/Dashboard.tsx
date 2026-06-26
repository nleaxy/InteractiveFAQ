import { useState, useEffect, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Filter,
  FolderPlus,
  Loader2,
  ExternalLink,
  X,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // 1. Импортируем toast
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
  const { projectSlug } = useParams();

  const {
    activeProject,
    fetchProjectBySlug,
    currentProjectFaqs,
    fetchProjectFaqs,
    addFaq,
    deleteFaq,
    updateFaq,
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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/faq/${activeProject?.slug}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Ссылка скопирована в буфер обмена!"); // Заменили alert
  };

  const handleAddFaq = async () => {
    if (!newQuestion || !newAnswer || !selectedCategory) {
      return toast.error("Пожалуйста, заполните все поля"); // Заменили alert
    }

    await addFaq(activeProject!.id, {
      question: newQuestion,
      answer: newAnswer,
      category: selectedCategory,
      synonyms: [],
    });

    toast.success("Вопрос успешно добавлен");
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
    toast.info(`Категория "${newCatName}" создана`);
  };

  const handleDeleteCategory = async (e: React.MouseEvent, catName: string) => {
    e.stopPropagation();
    if (confirm(`Удалить категорию "${catName}" и все её вопросы?`)) {
      const categoryFaqs = currentProjectFaqs.filter(
        (f) => f.category === catName,
      );
      for (const faq of categoryFaqs) {
        await deleteFaq(activeProject!.id, faq.id);
      }
      toast.success("Категория удалена");
      if (activeFilterCategory === catName) setActiveFilterCategory(null);
    }
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
      toast.success("Изменения сохранены");
      setIsEditOpen(false);
    }
  };

  if (!activeProject && !isLoading) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20 relative overflow-x-hidden">
      <header className="pt-6 md:pt-[49px] px-4 md:px-[49px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[28px] text-center md:text-left">
          <Link to="/" className="transition-transform active:scale-95">
            <div className="w-16 h-16 md:w-[103px] md:h-[103px] bg-white rounded-full shadow-md flex items-center justify-center border border-[#EBF2FF] overflow-hidden">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl md:text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
              SynFAQ {activeProject?.title}
            </h1>
            <p className="text-[#2051FF] text-sm md:text-[20px] font-medium mt-1">
              Управление базой знаний
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full md:w-auto">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 md:flex-none h-12 md:h-[56px] px-4 md:px-6 rounded-xl border-[#2051FF] text-[#2051FF] gap-2 hover:bg-blue-50"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Поделиться</span>
          </Button>
          <Link
            to={`/faq/${activeProject?.slug}`}
            target="_blank"
            className="flex-1 md:flex-none"
          >
            <Button
              variant="outline"
              className="w-full h-12 md:h-[56px] px-4 md:px-6 rounded-xl border-[#D8DCE8] text-[#1A2B4B] gap-2 hover:bg-white"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Открыть FAQ</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center w-full pt-8 md:pt-[100px]">
        <div className="w-full max-w-[940px] px-4 flex flex-col relative">
          <h2 className="text-3xl md:text-[40px] font-normal text-[#0D1B4C] text-center mb-8 md:mb-[60px]">
            Управление FAQ
          </h2>

          <div className="w-full">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 md:h-[72px] bg-white border-[#D8DCE8] rounded-xl md:rounded-[20px] pl-6 md:pl-8 text-lg md:text-[20px] shadow-sm"
              placeholder="Поиск вопроса..."
            />
          </div>

          <div className="mt-6 md:mt-8 flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2 text-slate-400">
              <Filter size={16} />{" "}
              <span className="text-xs font-bold uppercase">Фильтр:</span>
            </div>
            <button
              onClick={() => setActiveFilterCategory(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                !activeFilterCategory
                  ? "bg-[#2051FF] text-white border-[#2051FF]"
                  : "bg-white text-[#4A5568] border-[#D8DCE8]",
              )}
            >
              Все ({currentProjectFaqs.length})
            </button>
            {uniqueCategories.map((catName) => (
              <div key={catName} className="relative group">
                <button
                  onClick={() => setActiveFilterCategory(catName)}
                  className={cn(
                    "pl-4 pr-8 py-1.5 rounded-full text-sm font-semibold transition-all border flex items-center gap-2",
                    activeFilterCategory === catName
                      ? "bg-[#2051FF] text-white"
                      : "bg-white text-[#4A5568] border-[#D8DCE8]",
                  )}
                >
                  {catName}
                  <span
                    onClick={(e) => handleDeleteCategory(e, catName)}
                    className="absolute right-2 p-0.5 rounded-full hover:bg-black/10 text-slate-400"
                  >
                    <X size={12} />
                  </span>
                </button>
              </div>
            ))}
            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-dashed border-[#2051FF] text-[#2051FF] text-sm font-medium hover:bg-blue-50 transition-all">
                  <FolderPlus size={14} /> <span>+ Категория</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-2xl p-6 w-[90%] max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Новая категория</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Название..."
                    className="h-12 rounded-xl"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="w-full h-12 bg-[#2051FF] text-white rounded-xl"
                  >
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 md:mt-[40px] flex justify-center md:justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-[230px] h-14 md:h-[60px] bg-[#2051FF] hover:bg-[#0044FF] rounded-xl md:rounded-[15px] shadow-lg transition-all active:scale-95">
                  <span className="text-lg md:text-[20px] font-normal text-white">
                    + Добавить вопрос
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-2xl p-6 w-[90%] max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Новый вопрос
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Категория</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-[#D8DCE8]">
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
                    className="h-12 rounded-xl"
                  />
                  <Textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Ответ"
                    className="min-h-[100px] rounded-xl"
                  />
                  <Button
                    onClick={handleAddFaq}
                    className="w-full h-12 bg-[#2051FF] text-white rounded-xl"
                  >
                    Добавить в базу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 space-y-4 w-full pb-20">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-500" size={40} />
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="relative w-full flex flex-col md:flex-row items-center gap-3"
                >
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={`item-${faq.id}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="bg-white px-5 md:px-8 min-h-[64px] md:h-[72px] rounded-2xl md:rounded-[20px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm text-left">
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-[#2051FF] font-bold uppercase mb-1">
                            {faq.category}
                          </span>
                          <span className="text-base md:text-[20px] text-[#4A5568] font-normal leading-tight">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white mt-2 px-5 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[20px] border-[#D8DCE8] border-[1px] text-sm md:text-[18px] text-[#4A5568]/80 shadow-md">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex md:absolute md:left-[calc(100%+16px)] items-center gap-2 md:h-[72px] self-end md:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-[#2051FF] hover:bg-blue-50 rounded-full"
                      onClick={() => openEditModal(faq)}
                    >
                      <Pencil size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-[#FF2D6D] hover:bg-pink-50 rounded-full"
                      onClick={async () => {
                        if (confirm("Удалить?")) {
                          await deleteFaq(activeProject!.id, faq.id);
                          toast.success("Вопрос удален");
                        }
                      }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 italic bg-white/50 rounded-[24px] border-2 border-dashed">
                Вопросы не найдены
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-2xl p-6 w-[90%] max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Редактировать
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs">Категория</Label>
              <Input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <Input
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="min-h-[100px] rounded-xl"
            />
            <Button
              onClick={handleUpdateFaq}
              className="w-full h-12 bg-[#2051FF] text-white rounded-xl"
            >
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
