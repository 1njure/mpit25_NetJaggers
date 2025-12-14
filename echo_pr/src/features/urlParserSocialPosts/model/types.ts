export type SocialPlatform = 'telegram' | 'vk' | 'dzen';

export interface SocialPost {
  platform: SocialPlatform;
  title: string;
  text: string;
  hashtags: string[];
  link: string;
  emoji?: string;
}

export interface URLParserState {
  url: string;
  isLoading: boolean;
  originalPosts: SocialPost[];
  editedPosts: SocialPost[];
  jsonTexts: string[];
  quickPreviewTexts: string[];
  copiedIndex: number | null;
  activeTab: SocialPlatform;
}