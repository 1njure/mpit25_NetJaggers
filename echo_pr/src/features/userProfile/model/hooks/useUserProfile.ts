import { useState } from 'react';
import { UserProfile, ApiKeys } from '../types';

const MOCK_USER: UserProfile = {
  id: '1',
  username: 'Александр Иванов',
  email: 'alex@example.com',
  theme: 'dark',
  createdAt: new Date('2024-01-15'),
};

const MOCK_API_KEYS: ApiKeys = {
  telegram: 'tg_sk_••••••••••••••••••••••',
  vk: 'vk_sk_••••••••••••••••••••••',
  dzen: 'dzen_sk_••••••••••••••••••••••',
  lastUpdated: new Date('2024-03-10'),
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(MOCK_API_KEYS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setProfile(prev => ({ ...prev, ...data }));
    setIsSaving(false);
  };

  const updateApiKeys = async (keys: Partial<ApiKeys>): Promise<void> => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setApiKeys(prev => ({
      ...prev,
      ...keys,
      lastUpdated: new Date(),
    }));
    setIsSaving(false);
  };

  const toggleTheme = () => {
    const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: newTheme });
  };

  const resetApiKey = (platform: 'telegram' | 'vk' | 'dzen') => {
    setApiKeys(prev => ({
      ...prev,
      [platform]: '',
    }));
  };

  return {
    profile,
    apiKeys,
    isLoading,
    isSaving,
    updateProfile,
    updateApiKeys,
    toggleTheme,
    resetApiKey,
  };
};