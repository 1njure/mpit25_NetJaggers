import { Globe, Link, RefreshCw } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { EXAMPLE_URLS } from '../../lib/constants';

interface URLInputSectionProps {
  url: string;
  isLoading: boolean;
  onUrlChange: (url: string) => void;
  onParse: () => void;
}

export const URLInputSection = ({
  url,
  isLoading,
  onUrlChange,
  onParse
}: URLInputSectionProps) => {
  return (
    <div className="p-3 border-b border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-[140px]">
          <h2 className="text-base font-semibold text-gray-200 leading-tight">Content Parser</h2>
          <p className="text-xs text-gray-400">URL → Social Posts</p>
        </div>
        
        <div className="relative flex-1 ml-2">
          <Globe className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-3.5 w-3.5" />
          <Input
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="pl-8 h-8 text-sm bg-gray-900 border-gray-700 text-gray-200"
            onKeyDown={(e) => e.key === 'Enter' && onParse()}
          />
        </div>
        
        <Button 
          onClick={onParse} 
          disabled={isLoading || !url.trim()}
          size="sm" 
          className="h-8 ml-2 px-3 text-xs bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Link className="h-3.5 w-3.5 mr-1" />
              Parse
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs">
        <span className="text-gray-400">Примеры:</span>
        {EXAMPLE_URLS.map((exampleUrl) => (
          <Button
            key={exampleUrl}
            variant="outline"
            size="sm"
            onClick={() => {
              onUrlChange(exampleUrl);
              onParse();
            }}
            className="h-7 px-2 border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {exampleUrl.split('/').pop()}
          </Button>
        ))}
      </div>
    </div>
  );
};