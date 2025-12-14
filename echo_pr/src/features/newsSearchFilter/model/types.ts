export type NewsCategory = 'политика' | 'экономика' | 'технологии' | 'спорт' | 'культура' | 'наука';

export interface NewsItem {
  id: number;
  title: string;
  category: NewsCategory;
  source: string;
  timestamp: string;
  views: number;
  comments: number;
  isBookmarked: boolean;
}

export interface SearchState {
  query: string;
  selectedCategory: string;
  news: NewsItem[];
}