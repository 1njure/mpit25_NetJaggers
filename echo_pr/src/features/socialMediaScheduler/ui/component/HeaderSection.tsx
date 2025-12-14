import { Send } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface HeaderSectionProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export const HeaderSection = ({ 
  selectedPlatform, 
  onPlatformChange 
}: HeaderSectionProps) => {
  const platforms = ['telegram', 'vk', 'dzen', 'ok'];

  return (
    <div className="p-3 border-b border-gray">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-[140px]">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">Планирование рассылки</h2>
          <p className="text-xs text-gray-500">PR Manager Assistant</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Все платформы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все платформы</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="vk">VK</SelectItem>
              <SelectItem value="dzen">Дзен</SelectItem>
              <SelectItem value="ok">ОК</SelectItem>
            </SelectContent>
          </Select>

          <Button size="sm" className="h-8 px-3 text-xs">
            <Send className="h-3.5 w-3.5 mr-1" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <Button
          variant={selectedPlatform === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => onPlatformChange('all')}
          className="h-7 px-2 text-xs"
        >
          Все
        </Button>
        {platforms.map((platform) => (
          <Button
            key={platform}
            variant={selectedPlatform === platform ? "default" : "outline"}
            size="sm"
            onClick={() => onPlatformChange(platform)}
            className="h-7 px-2 text-xs capitalize"
          >
            {platform === 'vk' ? 'VK' : 
             platform === 'dzen' ? 'Дзен' : 
             platform === 'ok' ? 'ОК' : 
             'TG'}
          </Button>
        ))}
      </div>
    </div>
  );
};