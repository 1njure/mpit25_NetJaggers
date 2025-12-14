import { User, Settings, Shield, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';
import { ProfileForm, ApiKeysSection, ThemeToggle } from './components';
import { useUserProfile } from '../model/hooks/useUserProfile';
import { Button } from '@/shared/ui/button';

export const UserProfilePage = () => {
  const {
    profile,
    apiKeys,
    isSaving,
    updateProfile,
    updateApiKeys,
    toggleTheme,
    resetApiKey,
  } = useUserProfile();

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray flex items-center justify-center border-2 border-gray-700">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className="border-gray-600 bg-gray-800 text-gray-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Пользователь
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>С {profile.createdAt.toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">ID: {profile.id}</p>
            <p className="text-sm text-gray-500">Личный кабинет</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3  bg-gray border border-gray">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800 text-white">
            <User className="h-4 w-4 mr-2" />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-gray-800 text-white">
            <Shield className="h-4 w-4 mr-2" />
            API Ключи
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileForm
            profile={profile}
            isSaving={isSaving}
            onUpdate={updateProfile}
          />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiKeysSection
            apiKeys={apiKeys}
            isSaving={isSaving}
            onUpdate={updateApiKeys}
            onReset={resetApiKey}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ThemeToggle
            currentTheme={profile.theme}
            onThemeChange={(theme) => updateProfile({ theme: theme as any })}
            disabled={isSaving}
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-800 rounded-xl bg-gray">
              <h3 className="text-lg font-semibold text-white mb-3">Уведомления</h3>
              <p className="text-sm text-gray-400">Настройте уведомления о новых публикациях и аналитике</p>
              <Button variant="outline" className="mt-4 w-full text-black border-gray-700">
                Настроить уведомления
              </Button>
            </div>
            
            <div className="p-6 border border-gray-800 rounded-xl bg-gray">
              <h3 className="text-lg font-semibold text-white mb-3">Экспорт данных</h3>
              <p className="text-sm text-gray-400">Скачайте историю публикаций и аналитику</p>
              <Button variant="outline" className="mt-4 w-full border-gray-700  text-black">
                Экспортировать данные
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Статистика */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-800 rounded-xl bg-gray">
          <p className="text-sm text-gray-400">Подключенные платформы</p>
          <p className="text-2xl font-bold text-white mt-1">3</p>
        </div>
        <div className="p-4 border border-gray-800 rounded-xl bg-gray">
          <p className="text-sm text-gray-400">Всего публикаций</p>
          <p className="text-2xl font-bold text-white mt-1">1,247</p>
        </div>
        <div className="p-4 border border-gray-800 rounded-xl bg-gray">
          <p className="text-sm text-gray-400">Активность</p>
          <p className="text-2xl font-bold text-white mt-1">Активен</p>
        </div>
      </div>
    </div>
  );
};