import { useState, useCallback, useEffect } from 'react';
import { SocialPost, SocialPlatform } from '../types';
import { MOCK_JSON_RESPONSES } from '../../lib/constants';

export const useSocialPosts = (initialUrl?: string) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [originalPosts, setOriginalPosts] = useState<SocialPost[]>([]);
  const [editedPosts, setEditedPosts] = useState<SocialPost[]>([]);
  const [jsonTexts, setJsonTexts] = useState<string[]>([]);
  const [quickPreviewTexts, setQuickPreviewTexts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<SocialPlatform>('telegram');

  useEffect(() => {
    const initialPosts = MOCK_JSON_RESPONSES['https://example.com/news'].map(post => ({
      ...post,
      hashtags: [...post.hashtags]
    }));
    
    setOriginalPosts(initialPosts);
    setEditedPosts(initialPosts);
    setJsonTexts(initialPosts.map(post => JSON.stringify(post, null, 2)));
    setQuickPreviewTexts(initialPosts.map(post => post.text));
  }, []);

  const parseUrl = useCallback(async (urlToParse: string) => {
    if (!urlToParse.trim()) return;
    
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const response = MOCK_JSON_RESPONSES[urlToParse] || MOCK_JSON_RESPONSES['https://example.com/news'];
        
        const mutablePosts = response.map(post => ({
          ...post,
          hashtags: [...post.hashtags]
        }));
        
        setOriginalPosts(mutablePosts);
        setEditedPosts(mutablePosts);
        setJsonTexts(mutablePosts.map(post => JSON.stringify(post, null, 2)));
        setQuickPreviewTexts(mutablePosts.map(post => post.text));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  }, []);

  const updatePostText = useCallback((index: number, newText: string) => {
    setEditedPosts(prev => prev.map((post, i) => 
      i === index ? { ...post, text: newText } : post
    ));
    
    setJsonTexts(prev => prev.map((json, i) => 
      i === index ? JSON.stringify({ ...editedPosts[index], text: newText }, null, 2) : json
    ));
    
    setQuickPreviewTexts(prev => prev.map((text, i) => 
      i === index ? newText : text
    ));
  }, [editedPosts]);

  const updateHashtags = useCallback((index: number, newHashtags: string) => {
    const hashtags = newHashtags.split(' ').filter(tag => tag.startsWith('#'));
    
    setEditedPosts(prev => prev.map((post, i) => 
      i === index ? { ...post, hashtags } : post
    ));
    
    setJsonTexts(prev => prev.map((json, i) => 
      i === index ? JSON.stringify({ ...editedPosts[index], hashtags }, null, 2) : json
    ));
  }, [editedPosts]);

  const updateJsonText = useCallback((index: number, newJson: string) => {
    try {
      const parsed = JSON.parse(newJson);
      setEditedPosts(prev => prev.map((post, i) => 
        i === index ? parsed : post
      ));
      setQuickPreviewTexts(prev => prev.map((text, i) => 
        i === index ? parsed.text : text
      ));
      setJsonTexts(prev => prev.map((json, i) => 
        i === index ? newJson : json
      ));
    } catch (e) {
      // Оставляем JSON как есть
      setJsonTexts(prev => prev.map((json, i) => 
        i === index ? newJson : json
      ));
    }
  }, []);

  const updateQuickPreview = useCallback((index: number, newText: string) => {
    setQuickPreviewTexts(prev => prev.map((text, i) => 
      i === index ? newText : text
    ));
    
    setEditedPosts(prev => prev.map((post, i) => 
      i === index ? { ...post, text: newText } : post
    ));
    
    setJsonTexts(prev => prev.map((json, i) => 
      i === index ? JSON.stringify({ ...editedPosts[index], text: newText }, null, 2) : json
    ));
  }, [editedPosts]);

  const resetToOriginal = useCallback((index: number) => {
    setEditedPosts(prev => prev.map((post, i) => 
      i === index ? { ...originalPosts[index] } : post
    ));
    
    setJsonTexts(prev => prev.map((json, i) => 
      i === index ? JSON.stringify(originalPosts[index], null, 2) : json
    ));
    
    setQuickPreviewTexts(prev => prev.map((text, i) => 
      i === index ? originalPosts[index].text : text
    ));
  }, [originalPosts]);

  const copyJson = useCallback((index: number) => {
    navigator.clipboard.writeText(jsonTexts[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [jsonTexts]);

  const publishPost = useCallback((index: number) => {
    alert(`Пост для ${editedPosts[index].platform} отправлен на публикацию!`);
  }, [editedPosts]);

  return {
    url,
    setUrl,
    isLoading,
    originalPosts,
    editedPosts,
    jsonTexts,
    quickPreviewTexts,
    copiedIndex,
    activeTab,
    setActiveTab,
    parseUrl,
    updatePostText,
    updateHashtags,
    updateJsonText,
    updateQuickPreview,
    resetToOriginal,
    copyJson,
    publishPost
  };
};