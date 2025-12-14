import { Send } from 'lucide-react';
import { ScheduledPost } from '../../model/types';
import { PostItem } from './PostItem';

interface PostListProps {
  posts: ScheduledPost[];
  filteredPosts: ScheduledPost[];
  onDeletePost: (id: number) => void;
}

export const PostList = ({ 
  filteredPosts, 
  onDeletePost 
}: PostListProps) => {
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Send className="h-8 w-8 mx-auto text-gray-300 mb-1" />
        <p className="text-sm">Нет запланированных постов</p>
        <p className="text-xs text-gray-400 mt-1">Создайте первый пост выше</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredPosts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onDelete={onDeletePost} 
        />
      ))}
    </div>
  );
};