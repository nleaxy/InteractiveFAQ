import { create } from "zustand";
import api from "../api/axios";
import type { FAQ, FaqProject } from "../types/faq";

interface FaqState {
  projects: FaqProject[];
  currentProjectFaqs: FAQ[]; // Добавили отдельный массив для вопросов текущего проекта
  isLoading: boolean;
  logout: () => void;

  fetchProjects: () => Promise<void>;
  fetchProjectFaqs: (projectId: string | number) => Promise<void>; // Загрузка вопросов конкретного проекта

  addProject: (title: string, slug: string) => Promise<void>;
  deleteProject: (projectId: string | number) => Promise<void>;

  // FAQ CRUD (В соответствии с FastAPI: вопрос содержит поле category: string)
  addFaq: (
    projectId: string | number,
    faqData: {
      question: string;
      answer: string;
      category: string;
      synonyms: string[];
    },
  ) => Promise<void>;

  deleteFaq: (
    projectId: string | number,
    faqId: string | number,
  ) => Promise<void>;

  updateFaq: (
    projectId: string | number,
    faqId: string | number,
    updatedFaq: {
      question: string;
      answer: string;
      category: string;
      synonyms: string[];
    },
  ) => Promise<void>;

  // PATCH /api/projects/{projectId}/settings
  updateSettings: (
    projectId: string | number,
    popularQueries: string,
  ) => Promise<void>;

  // POST /api/projects/v1/generate/
  generateFaq: (
    projectId: string | number,
    description: string,
    count: number,
  ) => Promise<void>;

  getProjectById: (id: string | number) => FaqProject | undefined;
}

export const useFaqStore = create<FaqState>((set, get) => ({
  projects: [],
  currentProjectFaqs: [],
  isLoading: false,

  // GET /api/projects
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/projects");
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      set({ isLoading: false });
    }
  },

  // GET /api/projects/{projectId}/faqs
  fetchProjectFaqs: async (projectId) => {
    try {
      const response = await api.get(`/api/projects/${projectId}/faqs`);
      set({ currentProjectFaqs: response.data });
    } catch (error) {
      console.error("Ошибка загрузки вопросов проекта:", error);
    }
  },

  // POST /api/projects
  addProject: async (title, slug) => {
    try {
      const response = await api.post("/api/projects", { title, slug });
      set((state) => ({ projects: [...state.projects, response.data] }));
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
    }
  },

  // DELETE /api/projects/{projectId}
  deleteProject: async (projectId) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }));
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
    }
  },

  // POST /api/projects/{projectId}/faqs
  addFaq: async (projectId, faqData) => {
    try {
      // В FastAPI payload: FAQCreate (question, answer, category, synonyms)
      await api.post(`/api/projects/${projectId}/faqs`, faqData);
      // После добавления обновляем список вопросов именно этого проекта
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка добавления FAQ:", error);
    }
  },

  // DELETE /api/projects/{projectId}/faqs/{faqId}
  deleteFaq: async (projectId, faqId) => {
    try {
      await api.delete(`/api/projects/${projectId}/faqs/${faqId}`);
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка удаления FAQ:", error);
    }
  },

  // PUT /api/projects/{projectId}/faqs/{faqId}
  updateFaq: async (projectId, faqId, updatedFaq) => {
    try {
      await api.put(`/api/projects/${projectId}/faqs/${faqId}`, updatedFaq);
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка обновления FAQ:", error);
    }
  },

  // PATCH /api/projects/{projectId}/settings
  updateSettings: async (projectId, popularQueries) => {
    try {
      // payload: SettingsUpdate { popularQueries: string }
      await api.patch(`/api/projects/${projectId}/settings`, {
        popularQueries,
      });
      // Обновляем локально в списке проектов
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, popularQueries } : p,
        ),
      }));
    } catch (error) {
      console.error("Ошибка обновления настроек:", error);
    }
  },

  // POST /api/projects/v1/generate/?project_id=...
  generateFaq: async (projectId, description, count) => {
    try {
      await api.post(
        `/api/projects/v1/generate/`,
        // 1. Тело запроса (JSON)
        {
          description: description,
          count: count,
        },
        // 2. Query-параметры (пойдут в URL)
        {
          params: { project_id: projectId },
        },
      );
      // После генерации обновляем список вопросов
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      throw error; // Прокидываем ошибку дальше, чтобы GeneratePage её поймал
    }
  },

  getProjectById: (id) =>
    get().projects.find((p) => String(p.id) === String(id)),
  logout: () => {
    set({ projects: [], currentProjectFaqs: [] }); // Очищаем списки
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
  },
}));
