import { useScheduler } from '../model/hooks/useScheduler';

import { StatsSection,PostList,PostFormSection,HeaderSection } from './component/index';

export const SocialMediaScheduler = () => {
  const {
    posts,
    filteredPosts,
    selectedPlatform,
    setSelectedPlatform,
    newPost,
    setNewPost,
    addNewPost,
    deletePost,
    getPlatformStats
  } = useScheduler();

  return (
    <div className="w-full dark rounded-lg border border-gray shadow-sm">
      <HeaderSection
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
      />

      <PostFormSection
        newPost={newPost}
        onNewPostChange={setNewPost}
        onAddPost={addNewPost}
      />

      <div className="p-3">
        <PostList
          posts={posts}
          filteredPosts={filteredPosts}
          onDeletePost={deletePost}
        />
      </div>

      <StatsSection
        posts={posts}
        filteredPosts={filteredPosts}
        platformStats={getPlatformStats()}
      />
    </div>
  );
};