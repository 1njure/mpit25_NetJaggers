import { Key, Eye, EyeOff, Copy, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { PLATFORM_CONFIGS } from '../../lib/constants';
import { ApiKeys } from '../../model/types';
import { useState } from 'react';

type PlatformKeys = Omit<ApiKeys, 'lastUpdated'>;
type Platform = keyof PlatformKeys;

interface ApiKeysSectionProps {
  apiKeys: ApiKeys;
  isSaving: boolean;
  onUpdate: (keys: Partial<ApiKeys>) => Promise<void>;
  onReset: (platform: Platform) => void;
}

export const ApiKeysSection = ({ apiKeys, isSaving, onUpdate, onReset }: ApiKeysSectionProps) => {
  const [visibleKeys, setVisibleKeys] = useState<Record<Platform, boolean>>({
    telegram: false,
    vk: false,
    dzen: false,
  });

  const toggleVisibility = (platform: Platform) => {
    setVisibleKeys(prev => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatApiKey = (key: string, isVisible: boolean) => {
    if (!key) return '';
    if (isVisible) return key;
    return key.replace(/./g, '•');
  };

  const platforms: Platform[] = ['telegram', 'vk', 'dzen'];

  return (
    <Card className="border-gray-700 bg-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Ключи
        </CardTitle>
        <CardDescription className="text-gray-400">
          Настройте доступ к платформам для автоматической публикации
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {platforms.map((platform) => {
            const config = PLATFORM_CONFIGS[platform];
            const isVisible = visibleKeys[platform];
            
            return (
              <div key={platform} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <Label className={`font-medium ${config.color}`}>
                      {config.name}
                    </Label>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${config.bgColor} ${config.borderColor} ${config.color}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    API Key
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={apiKeys[platform]}
                      onChange={(e) => {
                        const updateData: Partial<ApiKeys> = { [platform]: e.target.value };
                        onUpdate(updateData);
                      }}
                      type={isVisible ? 'text' : 'password'}
                      className={`bg-gray-800 border-gray-700 text-white ${config.borderColor}`}
                      placeholder={config.placeholder}
                      disabled={isSaving}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(platform)}
                        className="h-8 w-8"
                      >
                        {isVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(apiKeys[platform])}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onReset(platform)}
                    disabled={isSaving}
                    className="border-gray-600 hover:border-gray-500"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Сбросить
                  </Button>
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  <span>Последнее обновление: {apiKeys.lastUpdated.toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 border border-gray-800 rounded-lg bg-gray-950">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>
              API ключи хранятся в зашифрованном виде и используются только для автоматической публикации контента.
              Никогда не передавайте свои ключи третьим лицам.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};