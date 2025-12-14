import { Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { ScheduledPost } from '../../model/types';
import { 
  getPlatformColor, 
  getStatusColor, 
  getStatusLabel, 
  getMediaTypeLabel,
  getPlatformLabel,
  getMediaIcon,
  formatDate 
} from '../../lib/utils';

interface PostItemProps {
  post: ScheduledPost;
  onDelete: (id: number) => void;
}

export const PostItem = ({ post, onDelete }: PostItemProps) => {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg border dark border-gray transition-colors group">
      <Badge 
        variant="outline" 
        className={`${getPlatformColor(post.platform)} text-xs px-2 py-0.5 capitalize`}
      >
        {getPlatformLabel(post.platform)}
      </Badge>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-0.5">
          <p className="text-sm truncate">
            {post.content}
          </p>
          <button
            onClick={() => onDelete(post.id)}
            className="ml-1 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {getMediaIcon(post.mediaType)}
            <span className="capitalize">
              {getMediaTypeLabel(post.mediaType)}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.scheduledDate)}
          </span>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(post.status)} text-xs px-2 py-0`}
          >
            {getStatusLabel(post.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
};