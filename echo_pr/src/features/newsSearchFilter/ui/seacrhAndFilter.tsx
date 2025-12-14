import { useNewsSearch } from '../model/hooks/useNewsSearch';
import { SearchSection } from './components/SearchSection';
import { NewsList } from './components/NewsList';
import { StatsSection } from './components/StatsSection';

export const SearchAndFilter = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    news,
    filteredNews,
    toggleBookmark
  } = useNewsSearch();

  return (
    <div className="w-full dark rounded-lg border border-gray shadow-sm">
      <SearchSection
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />

      <div className="p-3">
        <NewsList
          news={news}
          filteredNews={filteredNews}
          onToggleBookmark={toggleBookmark}
        />
      </div>

      <StatsSection
        news={news}
        filteredNews={filteredNews}
      />
    </div>
  );
};