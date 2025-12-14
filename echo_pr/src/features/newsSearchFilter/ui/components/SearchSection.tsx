import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

interface SearchSectionProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export const SearchSection = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}: SearchSectionProps) => {
  const categories = ['Все', 'Политика', 'Экономика', 'Технологии', 'Спорт', 'Культура', 'Наука'];

  return (
    <div className="p-3 border-b border-gray">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-[140px]">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">История запросов</h2>
          <p className="text-xs text-gray-500">Latest updates</p>
        </div>
        
        <div className="relative flex-1 max-w-xs ml-2">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
          <Input
            placeholder="Search news..."
            className="pl-8 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="h-7 px-2 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};