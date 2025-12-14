import { Filter } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { NewsItem } from '../../model/types';
import { getCategoryDotColor } from '../../lib/utils';

interface StatsSectionProps {
  news: NewsItem[];
  filteredNews: NewsItem[];
}

export const StatsSection = ({ news, filteredNews }: StatsSectionProps) => {
  const categories = Array.from(new Set(news.map(item => item.category)));

  return (
    <div className="px-3 py-2 border-t border-gray text-xs">
      <div className="flex items-center justify-between text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            <span className="font-medium">{filteredNews.length}</span>/{news.length} news
          </span>
          <div className="flex items-center gap-2">
            {categories.slice(0, 2).map((category) => (
              <span key={category} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${getCategoryDotColor(category)}`}></div>
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </span>
            ))}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>By date</DropdownMenuItem>
            <DropdownMenuItem>By views</DropdownMenuItem>
            <DropdownMenuItem>By comments</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};