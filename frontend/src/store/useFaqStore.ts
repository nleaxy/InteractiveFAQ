import { create } from "zustand";
import { persist } from "zustand/middleware"; // Это у тебя уже импортировано
import type { FAQ, Category } from "../types/faq";

interface FaqState {
  faqs: FAQ[];
  categories: Category[];
  popularQueries: string;
  addFaq: (faq: FAQ) => void;
  deleteFaq: (id: string) => void;
  setPopularQueries: (queries: string) => void;
}

// Добавляем обертку persist
export const useFaqStore = create<FaqState>()(
  persist(
    (set) => ({
      faqs: [
        {
          id: "1",
          question: "Как восстановить пароль?",
          answer:
            'Для восстановления пароля нажмите на кнопку "Забыли пароль" на странице входа и следуйте инструкциям.',
          categoryId: "uni",
          synonyms: [],
          keywords: [],
        },
        {
          id: "2",
          question: "Как изменить почту?",
          answer:
            'Почту можно изменить в настройках профиля в разделе "Безопасность".',
          categoryId: "uni",
          synonyms: [],
          keywords: [],
        },
        {
          id: "3",
          question: "Как войти в систему?",
          answer: "Используйте свой логин и пароль, выданные при регистрации.",
          categoryId: "uni",
          synonyms: [],
          keywords: [],
        },
      ],
      categories: [
        { id: "1", name: "Оплата" },
        { id: "2", name: "Доставка" },
      ],

      // Начальное значение
      popularQueries: "cats, roblox, 67",

      addFaq: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),

      deleteFaq: (id) =>
        set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),

      setPopularQueries: (queries) => set({ popularQueries: queries }),
    }),
    {
      name: "faq-storage",
    },
  ),
);
