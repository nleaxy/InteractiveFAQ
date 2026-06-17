export interface Category {
  id: string;
  name: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  synonyms: string[]; // Для ML поиска
  keywords: string[]; // Ключевые слова
}

export interface SearchResult {
  faq: FAQ;
  score: number; // Насколько совпал поиск (от ML или бэка)
}
