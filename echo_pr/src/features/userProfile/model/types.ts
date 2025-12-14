export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
}

export interface ApiKeys {
  telegram: string;
  vk: string;
  dzen: string;
  lastUpdated: Date;
}

export type PlatformKey = 'telegram' | 'vk' | 'dzen';

export interface ProfileFormData {
  username: string;
  email: string;
}

export interface ApiKeysFormData {
  telegram: string;
  vk: string;
  dzen: string;
}