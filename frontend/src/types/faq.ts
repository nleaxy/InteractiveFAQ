export interface FAQ {
  id: string;
  question: string;
  answer: string;
  synonyms?: string[]; // Синонимы для ML
}

export interface Category {
  id: string;
  name: string;
  faqs: FAQ[]; // Вопросы лежат внутри категории
}

export interface FaqProject {
  id: string;
  title: string;
  popularQueries: string;
  categories: Category[]; // Проект теперь состоит из категорий
}
