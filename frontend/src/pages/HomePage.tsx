import { useState } from "react";
import { SearchBar } from "@/components/user/SearchBar";
import { FaqAccordion } from "@/components/user/FaqAccordion";
import { CategoryNav } from "@/components/user/CategoryNav";
import { useFaqStore } from "@/store/useFaqStore";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Получаем данные из стора
  const { faqs } = useFaqStore();

  // Логика фильтрации (простая версия, пока нет ML-поиска)
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.synonyms.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory = selectedCategoryId
      ? faq.categoryId === selectedCategoryId
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section - Заголовок и поиск */}
      <section className="bg-white border-b py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Чем мы можем вам помочь?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Найдите ответы на свои вопросы с помощью текста или просто скажите
            их голосом.
          </p>

          <div className="pt-4">
            {/* Передаем функцию изменения запроса в SearchBar */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* 2. Основной контент */}
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-10">
        {/* Навигация по категориям */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Поиск по категориям
          </h2>
          <CategoryNav
            activeId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>

        {/* Список FAQ */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-900">
              {searchQuery ? "Результаты поиска" : "Популярные вопросы"}
            </h2>
            <span className="text-sm text-slate-500">
              Найдено: {filteredFaqs.length}
            </span>
          </div>

          <FaqAccordion items={filteredFaqs} />
        </div>
      </main>
    </div>
  );
}
