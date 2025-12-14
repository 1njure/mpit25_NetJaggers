export type SocialPlatform = 'telegram' | 'vk' | 'dzen' | 'ok';
export type PostStatus = 'draft' | 'scheduled' | 'published';
export type MediaType = 'text' | 'image' | 'video' | 'link';

export interface ScheduledPost {
  id: number;
  platform: SocialPlatform;
  content: string;
  scheduledDate: Date;
  status: PostStatus;
  mediaType: MediaType;
}

export interface NewPostData {
  platform: SocialPlatform;
  content: string;
  scheduledDate: Date;
  mediaType: MediaType;
}