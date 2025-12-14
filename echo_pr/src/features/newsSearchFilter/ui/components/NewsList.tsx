import { Search } from 'lucide-react';
import { NewsItem as NewsItemType } from '../../model/types';
import { NewsItem } from './NewsItem';

interface NewsListProps {
  news: NewsItemType[];
  filteredNews: NewsItemType[];
  onToggleBookmark: (id: number) => void;
}

export const NewsList = ({ news, filteredNews, onToggleBookmark }: NewsListProps) => {
  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Search className="h-8 w-8 mx-auto text-gray-300 mb-1" />
        <p className="text-sm">No news found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredNews.map((item) => (
        <NewsItem 
          key={item.id} 
          item={item} 
          onToggleBookmark={onToggleBookmark} 
        />
      ))}
    </div>
  );
};