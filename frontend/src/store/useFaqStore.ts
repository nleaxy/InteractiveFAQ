import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FAQ } from "../types/faq";

// 1. Описываем структуру одного проекта
export interface FaqProject {
  id: string; // Это будет slug для URL (например, "uni" или "hr-portal")
  title: string; // Название проекта
  faqs: FAQ[]; // Вопросы именно этого проекта
  popularQueries: string; // Популярные запросы именно этого проекта
}

interface FaqState {
  projects: FaqProject[];

  // Функции для управления проектами
  addProject: (project: FaqProject) => void;
  deleteProject: (projectId: string) => void;

  // Функции для управления контентом внутри проекта
  addFaq: (projectId: string, faq: FAQ) => void;
  deleteFaq: (projectId: string, faqId: string) => void;
  // НОВАЯ ФУНКЦИЯ: Редактирование вопроса
  updateFaq: (
    projectId: string,
    faqId: string,
    updatedFaq: Partial<FAQ>,
  ) => void;
  setPopularQueries: (projectId: string, queries: string) => void;

  // Селектор для получения данных одного проекта
  getProjectById: (id: string) => FaqProject | undefined;
}

export const useFaqStore = create<FaqState>()(
  persist(
    (set, get) => ({
      // НАЧАЛЬНЫЕ ДАННЫЕ
      projects: [
        {
          id: "uni",
          title: "Университет",
          popularQueries: "cats, roblox, 67",
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
          ],
        },
      ],

      // Добавить новый проект
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      // Удалить весь проект
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),

      // Добавить вопрос
      addFaq: (projectId, faq) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, faqs: [...p.faqs, faq] } : p,
          ),
        })),

      // Удалить вопрос
      deleteFaq: (projectId, faqId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, faqs: p.faqs.filter((f) => f.id !== faqId) }
              : p,
          ),
        })),

      // РЕАЛИЗАЦИЯ: Редактирование вопроса
      updateFaq: (projectId, faqId, updatedFaq) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  faqs: p.faqs.map((f) =>
                    f.id === faqId ? { ...f, ...updatedFaq } : f,
                  ),
                }
              : p,
          ),
        })),

      // Установить теги
      setPopularQueries: (projectId, queries) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, popularQueries: queries } : p,
          ),
        })),

      // Поиск проекта
      getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
      },
    }),
    {
      name: "faq-storage",
    },
  ),
);
