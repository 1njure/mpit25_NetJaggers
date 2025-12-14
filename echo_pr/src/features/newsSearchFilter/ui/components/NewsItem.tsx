import { User, Calendar, Eye, MessageSquare, Bookmark } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { NewsItem as NewsItemType } from '../../model/types';
import { getCategoryColor, getCategoryShortName, formatNumber } from '../../lib/utils';

interface NewsItemProps {
  item: NewsItemType;
  onToggleBookmark: (id: number) => void;
}

export const NewsItem = ({ item, onToggleBookmark }: NewsItemProps) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border border-gray transition-colors">
      <Badge 
        variant="outline" 
        className={`${getCategoryColor(item.category)} text-xs px-2 py-0.5`}
      >
        {getCategoryShortName(item.category)}
      </Badge>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="font-medium text-sm truncate">
            {item.title}
          </h4>
          <button
            onClick={() => onToggleBookmark(item.id)}
            className="ml-1 p-0.5"
          >
            <Bookmark 
              className={`h-3.5 w-3.5 ${item.isBookmarked ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {item.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {item.timestamp}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(item.views)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {formatNumber(item.comments)}
          </span>
        </div>
      </div>
    </div>
  );
};