import { Search, Plus, Pencil, Trash2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useFaqStore } from "@/store/useFaqStore";
import Logo from "@/assets/logo.png";

export default function Dashboard() {
  const { faqs, deleteFaq, popularQueries, setPopularQueries } = useFaqStore();

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20 relative overflow-x-hidden">
      {/* 1. ХЕДЕР */}
      <header className="absolute top-[49px] left-[49px] flex items-center gap-[28px]">
        <div className="w-[103px] h-[103px] bg-white rounded-full shadow-md flex items-center justify-center border border-[#EBF2FF] overflow-hidden flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[40px] leading-[1.1] font-semibold text-[#1A2B4B]">
            SynFAQ Moodboard
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
            <Select defaultValue="uni">
              <SelectTrigger className="w-auto min-w-[200px] h-[52px] bg-white border-[#D8DCE8] border-[1px] rounded-[14px] text-[18px] text-[#0D1B4C] px-6 shadow-sm [&>svg]:hidden flex items-center gap-3 justify-start focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="FAQ: Университет" />
                <span className="text-[#FF2D6D] text-[16px] mb-0.5">▼</span>
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D8DCE8]">
                <SelectItem value="uni">FAQ: Университет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ПОИСК */}
          <div className="mt-[20px] w-full">
            <Input
              className="w-full h-[72px] bg-white border-[#D8DCE8] border-[1px] rounded-[20px] pl-8 text-[20px] text-[#0D1B4C] placeholder:text-[#B0BCCB] shadow-sm outline-none focus-visible:ring-0 focus-visible:border-[#D8DCE8]"
              placeholder="Поиск вопроса..."
            />
          </div>

          {/* БЛОК: ПОПУЛЯРНЫЕ ЗАПРОСЫ */}
          <div className="mt-[24px] w-full bg-white p-6 rounded-[24px] border border-[#D8DCE8] shadow-sm">
            <label className="text-[18px] font-medium text-[#0D1B4C] mb-3 block">
              Популярные запросы (через запятую)
            </label>
            <Input
              // 1. Привязываем значение к стору
              value={popularQueries}
              // 2. При каждом изменении вызываем функцию из стора
              onChange={(e) => setPopularQueries(e.target.value)}
              className="w-full h-[56px] bg-[#F9FBFF] border-[#D8DCE8] border-[1px] rounded-[14px] px-6 text-[18px] text-[#4A5568]"
              placeholder="cats, roblox, 67"
            />
          </div>

          {/* КНОПКА ДОБАВИТЬ */}
          <div className="mt-[32px] flex justify-end">
            <Button className="w-[230px] h-[60px] bg-[#2051FF] hover:bg-[#0044FF] rounded-[15px] flex items-center justify-center border-none shadow-lg transition-transform active:scale-95">
              <span className="text-[20px] font-normal text-white">
                + Добавить вопрос
              </span>
            </Button>
          </div>

          {/* СПИСОК FAQ */}
          <div className="mt-[30px] space-y-[16px] w-full pb-20">
            {faqs.map((faq) => (
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
                  >
                    <Pencil className="w-[26px] h-[26px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-[44px] h-[44px] text-[#FF2D6D] hover:bg-pink-100/50 rounded-full transition-colors"
                    onClick={() => deleteFaq(faq.id)}
                  >
                    <Trash2 className="w-[26px] h-[26px]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
