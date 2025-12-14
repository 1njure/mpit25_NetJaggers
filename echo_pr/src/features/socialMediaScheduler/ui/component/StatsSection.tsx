import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { Calendar as CalendarComponent } from '@/shared/ui/calendar';

interface StatsSectionProps {
  posts: any[];
  filteredPosts: any[];
  platformStats: {
    telegram: number;
    vk: number;
    dzen: number;
    ok: number;
  };
}

export const StatsSection = ({ 
  posts, 
  filteredPosts, 
  platformStats 
}: StatsSectionProps) => {
  return (
    <div className="px-3 py-2 border-t border-gray text-xs">
      <div className="flex items-center justify-between text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            <span className="font-medium">{filteredPosts.length}</span>/{posts.length} постов
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>TG: {platformStats.telegram}</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0077FF]"></div>
              <span>VK: {platformStats.vk}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" />
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Timer
          </Button>
        </div>
      </div>
    </div>
  );
};