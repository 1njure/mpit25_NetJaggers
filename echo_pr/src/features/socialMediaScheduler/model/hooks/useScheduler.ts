import { useState, useMemo } from 'react';
import { ScheduledPost, NewPostData, SocialPlatform } from '../types';
import { INITIAL_POSTS } from '../../lib/constants';

export const useScheduler = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>(INITIAL_POSTS);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [newPost, setNewPost] = useState<NewPostData>({
    platform: 'telegram',
    content: '',
    scheduledDate: new Date(Date.now() + 3600000),
    mediaType: 'text'
  });

  const filteredPosts = useMemo(() => {
    return selectedPlatform === 'all' 
      ? posts 
      : posts.filter(post => post.platform === selectedPlatform);
  }, [posts, selectedPlatform]);

  const addNewPost = () => {
    if (newPost.content.trim()) {
      const post: ScheduledPost = {
        id: posts.length + 1,
        ...newPost,
        status: 'draft'
      };
      setPosts(prev => [...prev, post]);
      setNewPost({
        platform: 'telegram',
        content: '',
        scheduledDate: new Date(Date.now() + 3600000),
        mediaType: 'text'
      });
    }
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const updateNewPost = (updates: Partial<NewPostData>) => {
    setNewPost(prev => ({ ...prev, ...updates }));
  };

  const getPlatformStats = () => {
    return {
      telegram: posts.filter(p => p.platform === 'telegram').length,
      vk: posts.filter(p => p.platform === 'vk').length,
      dzen: posts.filter(p => p.platform === 'dzen').length,
      ok: posts.filter(p => p.platform === 'ok').length,
    };
  };

  return {
    posts,
    filteredPosts,
    selectedPlatform,
    setSelectedPlatform,
    newPost,
    setNewPost: updateNewPost,
    addNewPost,
    deletePost,
    getPlatformStats
  };
};