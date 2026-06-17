import { create } from "zustand";
import type { FAQ, Category } from '../types/faq'

interface FaqState {
  faqs: FAQ[];
  categories: Category[];
  addFaq: (faq: FAQ) => void;
  deleteFaq: (id: string) => void;
  // Позже добавим update и категории
}

export const useFaqStore = create<FaqState>((set) => ({
  faqs: [],
  categories: [
    { id: "1", name: "Оплата" },
    { id: "2", name: "Доставка" },
  ],
  addFaq: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
  deleteFaq: (id) =>
    set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),
}));
