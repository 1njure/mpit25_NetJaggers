import { Copy, Check, RefreshCw, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SocialPost, SocialPlatform } from '../../model/types';
import { PLATFORM_CONFIGS } from '../../lib/constants';
import { getPlatformColor,getPlatformShortName } from '../../lib/utils';

interface PostEditorSectionProps {
  editedPosts: SocialPost[];
  activeTab: SocialPlatform;
  copiedIndex: number | null;
  onTabChange: (tab: SocialPlatform) => void;
  onUpdateText: (index: number, text: string) => void;
  onUpdateHashtags: (index: number, hashtags: string) => void;
  onCopyJson: (index: number) => void;
  onReset: (index: number) => void;
  onPublish: (index: number) => void;
}

export const PostEditorSection = ({
  editedPosts,
  activeTab,
  copiedIndex,
  onTabChange,
  onUpdateText,
  onUpdateHashtags,
  onCopyJson,
  onReset,
  onPublish
}: PostEditorSectionProps) => {
  return (
    <div className="p-3 border-b border-gray-800">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as SocialPlatform)}>
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-900 border border-gray-800">
          {Object.entries(PLATFORM_CONFIGS).map(([platform, config]) => (
            <TabsTrigger 
              key={platform}
              value={platform}
              className={`text-xs text-gray-400 ${config.tabActiveClass}`}
            >
              {config.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {editedPosts.map((post, index) => (
          <TabsContent key={post.platform} value={post.platform} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getPlatformColor(post.platform)} capitalize text-xs`}
                >
                  {getPlatformShortName(post.platform)}
                </Badge>
                <h3 className="font-medium text-sm text-gray-200">{post.title}</h3>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCopyJson(index)}
                  className="h-7 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  {copiedIndex === index ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  JSON
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onReset(index)}
                  className="h-7 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => onPublish(index)}
                  className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Publish
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Текст поста
              </label>
              <Textarea
                value={post.text}
                onChange={(e) => onUpdateText(index, e.target.value)}
                className="min-h-[80px] text-sm resize-y bg-gray-900 border-gray-700 text-gray-200"
                placeholder="Введите текст поста..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Хэштеги (через пробел)
              </label>
              <Input
                value={post.hashtags.join(' ')}
                onChange={(e) => onUpdateHashtags(index, e.target.value)}
                className="text-sm bg-gray-900 border-gray-700 text-gray-200"
                placeholder="#пример #тег #новость"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Ссылка
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={post.link}
                  readOnly
                  className="text-sm bg-gray-900 border-gray-700 text-gray-200"
                />
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-700 rounded hover:bg-gray-800"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                </a>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};