import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FAQ, Category, FaqProject } from "../types/faq";

interface FaqState {
  projects: FaqProject[];

  // Управление проектами
  addProject: (project: FaqProject) => void;
  deleteProject: (projectId: string) => void;

  // Управление категориями
  addCategory: (projectId: string, category: Category) => void;
  deleteCategory: (projectId: string, categoryId: string) => void;

  // Управление вопросами (теперь требуют categoryId)
  addFaq: (projectId: string, categoryId: string, faq: FAQ) => void;
  deleteFaq: (projectId: string, faqId: string) => void;
  updateFaq: (
    projectId: string,
    faqId: string,
    updatedFaq: Partial<FAQ>,
  ) => void;

  setPopularQueries: (projectId: string, queries: string) => void;
  getProjectById: (id: string) => FaqProject | undefined;
}

export const useFaqStore = create<FaqState>()(
  persist(
    (set, get) => ({
      // НАЧАЛЬНЫЕ ДАННЫЕ (Обновленная структура)
      projects: [
        {
          id: "uni",
          title: "Университет",
          popularQueries: "cats, roblox, 67",
          categories: [
            {
              id: "cat-default",
              name: "Общие вопросы",
              faqs: [
                {
                  id: "1",
                  question: "Как восстановить пароль?",
                  answer:
                    'Для восстановления пароля нажмите на кнопку "Забыли пароль" на странице входа и следуйте инструкциям.',
                },
                {
                  id: "2",
                  question: "Как изменить почту?",
                  answer:
                    'Почту можно изменить в настройках профиля в разделе "Безопасность".',
                },
              ],
            },
          ],
        },
      ],

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),

      // Добавить категорию в проект
      addCategory: (projectId, category) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, categories: [...(p.categories || []), category] }
              : p,
          ),
        })),

      // Удалить категорию
      deleteCategory: (projectId, categoryId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  categories: p.categories.filter((c) => c.id !== categoryId),
                }
              : p,
          ),
        })),

      // Добавить вопрос в конкретную категорию проекта
      addFaq: (projectId, categoryId, faq) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId ? { ...c, faqs: [...c.faqs, faq] } : c,
                  ),
                }
              : p,
          ),
        })),

      // Удалить вопрос (ищет во всех категориях проекта)
      deleteFaq: (projectId, faqId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  categories: p.categories.map((c) => ({
                    ...c,
                    faqs: c.faqs.filter((f) => f.id !== faqId),
                  })),
                }
              : p,
          ),
        })),

      // Редактировать вопрос (ищет во всех категориях проекта)
      updateFaq: (projectId, faqId, updatedFaq) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  categories: p.categories.map((c) => ({
                    ...c,
                    faqs: c.faqs.map((f) =>
                      f.id === faqId ? { ...f, ...updatedFaq } : f,
                    ),
                  })),
                }
              : p,
          ),
        })),

      setPopularQueries: (projectId, queries) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, popularQueries: queries } : p,
          ),
        })),

      getProjectById: (id) => get().projects.find((p) => p.id === id),
    }),
    { name: "faq-storage" },
  ),
);
