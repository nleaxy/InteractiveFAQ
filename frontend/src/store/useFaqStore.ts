import { create } from "zustand";
import api from "../api/axios";
import type { FAQ, FaqProject } from "../types/faq";

interface FaqState {
  projects: FaqProject[];
  publicCatalog: FaqProject[];
  currentProjectFaqs: FAQ[];
  activeProject: FaqProject | null;
  isLoading: boolean;

  fetchProjects: () => Promise<void>;
  fetchPublicCatalog: () => Promise<void>;
  fetchProjectBySlug: (slug: string) => Promise<FaqProject | null>;
  fetchProjectFaqs: (projectId: number | string) => Promise<void>;

  searchFaqs: (projectId: number | string, query: string) => Promise<void>;

  addProject: (title: string, slug: string) => Promise<void>;
  deleteProject: (projectId: number | string) => Promise<void>;

  addFaq: (
    projectId: number | string,
    faqData: {
      question: string;
      answer: string;
      category: string;
      synonyms: string[];
    },
  ) => Promise<void>;

  deleteFaq: (
    projectId: number | string,
    faqId: number | string,
  ) => Promise<void>;

  updateFaq: (
    projectId: number | string,
    faqId: number | string,
    updatedFaq: {
      question: string;
      answer: string;
      category: string;
      synonyms: string[];
    },
  ) => Promise<void>;

  updateSettings: (
    projectId: number | string,
    popularQueries: string,
  ) => Promise<void>;

  generateFaq: (
    projectId: number | string,
    description: string,
    count: number,
  ) => Promise<void>;

  generateFaqFromFile: (
    projectId: number | string,
    file: File,
    count: number,
  ) => Promise<void>;

  getProjectById: (id: number | string) => FaqProject | undefined;
  logout: () => void;
}

export const useFaqStore = create<FaqState>((set, get) => ({
  projects: [],
  publicCatalog: [],
  currentProjectFaqs: [],
  activeProject: null,
  isLoading: false,

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

  fetchPublicCatalog: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/projects/public");
      set({ publicCatalog: response.data, isLoading: false });
    } catch (error) {
      console.error("Ошибка загрузки публичного каталога:", error);
      set({ isLoading: false });
    }
  },

  fetchProjectBySlug: async (slug: string) => {
    try {
      const response = await api.get(`/api/projects/slug/${slug}`);
      set({ activeProject: response.data });
      return response.data;
    } catch (error) {
      console.error("Проект по слагу не найден:", error);
      set({ activeProject: null });
      return null;
    }
  },

  fetchProjectFaqs: async (projectId) => {
    try {
      const response = await api.get(`/api/projects/${projectId}/faqs`);
      set({ currentProjectFaqs: response.data });
    } catch (error) {
      console.error("Ошибка загрузки вопросов:", error);
    }
  },

  searchFaqs: async (projectId, query) => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/projects/search", {
        params: {
          project_id: projectId,
          query: query,
        },
      });

      if (response.data.matched && response.data.result) {
        set({
          currentProjectFaqs: [response.data.result],
          isLoading: false,
        });
      } else {
        set({ currentProjectFaqs: [], isLoading: false });
      }
    } catch (error) {
      console.error("Ошибка ML-поиска:", error);
      set({ isLoading: false });
    }
  },

  addProject: async (title, slug) => {
    try {
      const response = await api.post("/api/projects", { title, slug });
      set((state) => ({ projects: [...state.projects, response.data] }));
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
    }
  },

  deleteProject: async (projectId) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter(
          (p) => String(p.id) !== String(projectId),
        ),
      }));
    } catch (error) {
      console.error("Ошибка удаления проекта:", error);
    }
  },

  addFaq: async (projectId, faqData) => {
    try {
      await api.post(`/api/projects/${projectId}/faqs`, faqData);
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка добавления FAQ:", error);
    }
  },

  deleteFaq: async (projectId, faqId) => {
    try {
      await api.delete(`/api/projects/${projectId}/faqs/${faqId}`);
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка удаления FAQ:", error);
    }
  },

  updateFaq: async (projectId, faqId, updatedFaq) => {
    try {
      await api.put(`/api/projects/${projectId}/faqs/${faqId}`, updatedFaq);
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка обновления FAQ:", error);
    }
  },

  updateSettings: async (projectId, popularQueries) => {
    try {
      await api.patch(`/api/projects/${projectId}/settings`, {
        popularQueries,
      });
      if (get().activeProject) {
        set({ activeProject: { ...get().activeProject!, popularQueries } });
      }
    } catch (error) {
      console.error("Ошибка обновления настроек:", error);
    }
  },

  // ГЕНЕРАЦИЯ ИЗ ТЕКСТА
  generateFaq: async (projectId, description, count) => {
    try {
      await api.post(
        `/api/projects/v1/generate/`,
        { description, count },
        { params: { project_id: projectId } },
      );
      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      throw error;
    }
  },

  // НОВОЕ: ГЕНЕРАЦИЯ ИЗ ФАЙЛА
  generateFaqFromFile: async (projectId, file, count) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("count", String(count));

      await api.post(`/api/projects/v1/generate/file`, formData, {
        params: { project_id: projectId },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await get().fetchProjectFaqs(projectId);
    } catch (error) {
      console.error("Ошибка генерации из файла:", error);
      throw error;
    }
  },

  getProjectById: (id) =>
    get().projects.find((p) => String(p.id) === String(id)),

  logout: () => {
    set({
      projects: [],
      publicCatalog: [],
      currentProjectFaqs: [],
      activeProject: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
  },
}));
