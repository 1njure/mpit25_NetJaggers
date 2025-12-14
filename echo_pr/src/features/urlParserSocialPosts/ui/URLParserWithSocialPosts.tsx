import { useSocialPosts } from '../model/hooks/useSocialPosts';
import { URLInputSection } from './components/URLInputSection';
import { QuickPreviewSection } from './components/QuickPreviewSection';
import { StatsSection } from './components/StatsSection';
import { PostEditorSection } from './components/PostEditor';

export const URLParserWithSocialPosts = () => {
  const {
    url,
    setUrl,
    isLoading,
    editedPosts,
    quickPreviewTexts,
    copiedIndex,
    activeTab,
    setActiveTab,
    parseUrl,
    updatePostText,
    updateHashtags,
    updateQuickPreview,
    copyJson,
    resetToOriginal,
    publishPost
  } = useSocialPosts('https://example.com/news');

  const handleParseUrl = async () => {
    await parseUrl(url);
  };

  return (
    <div className="w-full bg-dark rounded-lg border border-gray shadow-sm">
      <URLInputSection
        url={url}
        isLoading={isLoading}
        onUrlChange={setUrl}
        onParse={handleParseUrl}
      />

      <PostEditorSection
        editedPosts={editedPosts}
        activeTab={activeTab}
        copiedIndex={copiedIndex}
        onTabChange={setActiveTab}
        onUpdateText={updatePostText}
        onUpdateHashtags={updateHashtags}
        onCopyJson={copyJson}
        onReset={resetToOriginal}
        onPublish={publishPost}
      />

      <QuickPreviewSection
        editedPosts={editedPosts}
        quickPreviewTexts={quickPreviewTexts}
        onUpdateQuickPreview={updateQuickPreview}
      />

      <StatsSection editedPosts={editedPosts} />
    </div>
  );
};