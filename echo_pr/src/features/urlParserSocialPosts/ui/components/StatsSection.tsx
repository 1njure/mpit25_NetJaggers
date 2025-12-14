import { FileText, Copy } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { SocialPost } from '../../model/types';
import { getPlatformDotColor } from '../../lib/utils';

interface StatsSectionProps {
  editedPosts: SocialPost[];
}

export const StatsSection = ({ editedPosts }: StatsSectionProps) => {
  return (
    <div className="px-3 py-2 border-t border-gray-800 bg-gray-900/50 text-xs">
      <div className="flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Платформы: <span className="font-medium text-gray-300">{editedPosts.length}</span>
          </span>
          <div className="flex items-center gap-2">
            {editedPosts.map((post) => (
              <div key={post.platform} className="flex items-center gap-1">
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${getPlatformDotColor(post.platform)}`}
                ></div>
                <span className="capitalize text-gray-300">{post.platform}:</span>
                <span className="font-medium text-gray-300">{post.text.length}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <FileText className="h-3 w-3 mr-1" />
            Export All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy All JSON
          </Button>
        </div>
      </div>
    </div>
  );
};