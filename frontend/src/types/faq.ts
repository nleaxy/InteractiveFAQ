export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  synonyms: string[];
}

export interface CategoryUI {
  id: string;
  name: string;
  faqs: FAQ[];
}

export interface FaqProject {
  id: number;
  title: string;
  slug: string;
  popularQueries?: string;
  questionsCount: number;
  createdAt: string;
}
