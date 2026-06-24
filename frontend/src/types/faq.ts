export interface FAQ {
  id: number; // Бэкенд использует int
  question: string;
  answer: string;
  category: string; // В FastAPI это просто строка (payload.category)
  synonyms: string[]; // Массив синонимов для ML
}

// Интерфейс категории теперь нужен только для удобства отображения в UI
export interface CategoryUI {
  id: string;
  name: string;
  faqs: FAQ[];
}

export interface FaqProject {
  id: number; // Бэкенд использует int
  title: string; // Соответствует p.name на бэкенде
  slug: string; // URL-адрес проекта
  popularQueries?: string; // Поле из настроек
  questionsCount: number; // Считается бэкендом (q_count)
  createdAt: string; // Дата в формате "12.10.2025"
}
