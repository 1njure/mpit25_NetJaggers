import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { SocialPost } from '../../model/types';
import { getPlatformColor } from '../../lib/utils';

interface QuickPreviewSectionProps {
  editedPosts: SocialPost[];
  quickPreviewTexts: string[];
  onUpdateQuickPreview: (index: number, text: string) => void;
}

export const QuickPreviewSection = ({
  editedPosts,
  quickPreviewTexts,
  onUpdateQuickPreview
}: QuickPreviewSectionProps) => {
  return (
    <div className="p-3 border-b">
      <h3 className="text-sm font-medium text-gray-200 mb-2">Quick Preview</h3>
      <div className="grid grid-cols-3 gap-3">
        {editedPosts.map((post, index) => (
          <div key={post.platform} className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`${getPlatformColor(post.platform, true)} text-xs capitalize`}
              >
                {post.platform}
              </Badge>
              <span className="text-xs text-gray-500">
                {quickPreviewTexts[index].length} chars
              </span>
            </div>
            <Textarea
              value={quickPreviewTexts[index]}
              onChange={(e) => onUpdateQuickPreview(index, e.target.value)}
              className="min-h-[100px] text-xs resize-y bg-gray-900 border-gray-700 text-gray-200"
              placeholder="Быстрый просмотр и редактирование..."
            />
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs text-blue-400 px-1.5 py-0.5 bg-blue-900/30 rounded">
                  {tag}
                </span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-800 rounded">
                  +{post.hashtags.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};