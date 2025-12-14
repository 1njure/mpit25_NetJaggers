import { User, Mail, Save } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { UserProfile } from '../../model/types';
import { useState } from 'react';

interface ProfileFormProps {
  profile: UserProfile;
  isSaving: boolean;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

export const ProfileForm = ({ profile, isSaving, onUpdate }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <Card className="border-gray-700 bg-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Личные данные
        </CardTitle>
        <CardDescription className="text-gray-400">
          Обновите информацию вашего профиля
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Имя пользователя
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10  border-gray-700 text-white"
                  placeholder="Введите ваше имя"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email адрес
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-white text-black hover:bg-gray-100"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};