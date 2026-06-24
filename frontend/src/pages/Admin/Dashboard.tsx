import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";
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
  const updateFaq = useFaqStore((state) => (state as any).updateFaq); // Берем функцию обновления
  const setPopularQueries = useFaqStore((state) => state.setPopularQueries);

  // Состояния для поиска
  const [searchTerm, setSearchTerm] = useState("");

  // Состояния для нового вопроса
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Состояния для РЕДАКТИРОВАНИЯ
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <h1 className="text-2xl font-bold text-slate-400">Проект не найден</h1>
      </div>
    );
  }

  // Логика фильтрации поиска
  const filteredFaqs = project.faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Функция сохранения нового вопроса
  const handleAddFaq = () => {
    if (!newQuestion || !newAnswer) return;
    addFaq(projectId!, {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      categoryId: "general",
      synonyms: [],
      keywords: [],
    });
    setNewQuestion("");
    setNewAnswer("");
    setIsDialogOpen(false);
  };

  // Открытие модалки редактирования
  const openEditModal = (faq: any) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setIsEditOpen(true);
  };

  // Сохранение отредактированного вопроса
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

      {/* 2. ГЛАВНЫЙ КОНТЕНТ */}
      <main className="flex flex-col items-center w-full pt-[160px]">
        <div className="w-[940px] flex flex-col relative">
          <h2 className="text-[40px] font-normal text-[#0D1B4C] text-center w-full mb-[60px]">
            Управление FAQ
          </h2>

          <div className="flex justify-start">
            <Select defaultValue={project.id}>
              <SelectTrigger className="w-auto min-w-[200px] h-[52px] bg-white border-[#D8DCE8] border-[1px] rounded-[14px] text-[18px] text-[#0D1B4C] px-6 shadow-sm [&>svg]:hidden flex items-center gap-3 justify-start focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={`FAQ: ${project.title}`} />
                <span className="text-[#FF2D6D] text-[16px] mb-0.5">▼</span>
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D8DCE8]">
                <SelectItem value={project.id}>FAQ: {project.title}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ПОИСК (Теперь работает) */}
          <div className="mt-[20px] w-full">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[72px] bg-white border-[#D8DCE8] border-[1px] rounded-[20px] pl-8 text-[20px] text-[#0D1B4C] placeholder:text-[#B0BCCB] shadow-sm outline-none focus-visible:ring-0 focus-visible:border-[#2051FF]"
              placeholder="Поиск вопроса..."
            />
          </div>

          {/* БЛОК: ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
          <div className="mt-[24px] w-full bg-white p-6 rounded-[24px] border border-[#D8DCE8] shadow-sm">
            <label className="text-[18px] font-medium text-[#0D1B4C] mb-3 block">
              Популярные запросы (через запятую)
            </label>
            <Input
              value={project.popularQueries}
              onChange={(e) => setPopularQueries(projectId!, e.target.value)}
              className="w-full h-[56px] bg-[#F9FBFF] border-[#D8DCE8] border-[1px] rounded-[14px] px-6 text-[18px] text-[#4A5568] outline-none focus-visible:ring-0 focus-visible:border-[#2051FF]"
              placeholder="cats, roblox, 67"
            />
          </div>

          {/* КНОПКА ДОБАВИТЬ */}
          <div className="mt-[32px] flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-[230px] h-[60px] bg-[#2051FF] hover:bg-[#0044FF] rounded-[15px] flex items-center justify-center border-none shadow-lg transition-transform active:scale-95">
                  <span className="text-[20px] font-normal text-white">
                    + Добавить вопрос
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[24px] p-8 max-w-[500px] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[24px] font-semibold text-[#1A2B4B] mb-4">
                    Новый вопрос
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[16px] text-[#4A5568]">Вопрос</Label>
                    <Input
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Введите текст вопроса"
                      className="h-[56px] rounded-[14px] border-[#D8DCE8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[16px] text-[#4A5568]">Ответ</Label>
                    <Textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Введите текст ответа"
                      className="min-h-[120px] rounded-[14px] border-[#D8DCE8] p-4"
                    />
                  </div>
                  <Button
                    onClick={handleAddFaq}
                    className="w-full h-[56px] bg-[#2051FF] hover:bg-blue-700 rounded-[14px] text-white text-[18px]"
                  >
                    Сохранить в базу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* СПИСОК FAQ (Фильтрованный) */}
          <div className="mt-[30px] space-y-[16px] w-full pb-20">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="relative w-full flex items-center">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={`item-${faq.id}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="bg-white px-8 h-[72px] rounded-[20px] border-[#D8DCE8] border-[1px] hover:no-underline shadow-sm flex items-center py-0 group">
                      <span className="text-[20px] text-[#4A5568] font-normal leading-none mb-0.5 text-left">
                        {faq.question}
                      </span>
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
                    className="w-[44px] h-[44px] text-[#2051FF] hover:bg-blue-100/50 rounded-full transition-colors"
                    onClick={() => openEditModal(faq)}
                  >
                    <Pencil className="w-[26px] h-[26px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-[44px] h-[44px] text-[#FF2D6D] hover:bg-pink-100/50 rounded-full transition-colors"
                    onClick={() => deleteFaq(projectId!, faq.id)}
                  >
                    <Trash2 className="w-[26px] h-[26px]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* МОДАЛКА ДЛЯ РЕДАКТИРОВАНИЯ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-[24px] p-8 max-w-[500px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#1A2B4B] mb-4">
              Редактировать вопрос
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[16px] text-[#4A5568]">Вопрос</Label>
              <Input
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="h-[56px] rounded-[14px] border-[#D8DCE8]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[16px] text-[#4A5568]">Ответ</Label>
              <Textarea
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="min-h-[120px] rounded-[14px] border-[#D8DCE8] p-4"
              />
            </div>
            <Button
              onClick={handleUpdateFaq}
              className="w-full h-[56px] bg-[#2051FF] hover:bg-blue-700 rounded-[14px] text-white text-[18px]"
            >
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
