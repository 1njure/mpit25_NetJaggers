import { useState, useMemo } from 'react';
import { NewsItem } from '../types';
import { INITIAL_NEWS, NEWS_CATEGORIES } from '../../lib/constants';

export const useNewsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Все' || 
        item.category === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [news, searchQuery, selectedCategory]);

  const toggleBookmark = (id: number) => {
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    news,
    filteredNews,
    toggleBookmark
  };
};