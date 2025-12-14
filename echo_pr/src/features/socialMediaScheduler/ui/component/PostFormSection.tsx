import { Send } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { NewPostData } from '../../model/types';
import { getMediaIcon } from '../../lib/utils';

interface PostFormSectionProps {
  newPost: NewPostData;
  onNewPostChange: (updates: Partial<NewPostData>) => void;
  onAddPost: () => void;
}

export const PostFormSection = ({ 
  newPost, 
  onNewPostChange, 
  onAddPost 
}: PostFormSectionProps) => {
  return (
    <div className="p-3 border-b border-gray">
      <div className="flex items-start gap-2">
        <Select 
          value={newPost.platform} 
          onValueChange={(value: any) => onNewPostChange({ platform: value })}
        >
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="telegram">TG</SelectItem>
            <SelectItem value="vk">VK</SelectItem>
            <SelectItem value="dzen">Дзен</SelectItem>
            <SelectItem value="ok">ОК</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Текст поста..."
          value={newPost.content}
          onChange={(e) => onNewPostChange({ content: e.target.value })}
          className="h-8 text-sm flex-1"
          onKeyDown={(e) => e.key === 'Enter' && onAddPost()}
        />

        <Select 
          value={newPost.mediaType} 
          onValueChange={(value: any) => onNewPostChange({ mediaType: value })}
        >
          <SelectTrigger className="h-8 w-20 text-xs">
            <div className="flex items-center">
              {getMediaIcon(newPost.mediaType)}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Текст</SelectItem>
            <SelectItem value="image">Изображение</SelectItem>
            <SelectItem value="video">Видео</SelectItem>
            <SelectItem value="link">Ссылка</SelectItem>
          </SelectContent>
        </Select>

      
      </div>
    </div>
  );
};