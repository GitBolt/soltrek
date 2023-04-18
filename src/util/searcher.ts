import { ItemType } from '@/types/sidebar';
import { sidebarContent } from './sidebarContent';

export type SearchResult = {
  level: 'Item' | 'Sub Item';
  category: string;
  item: string;
  subItem?: string;
};

export const searchSidebarContent = (
  searchInput: string,
): SearchResult[] => {
  const results: SearchResult[] = [];

  const fuzzyMatch = (str: string, searchInput: string): boolean => {
    let searchIndex = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i].toLowerCase() === searchInput[searchIndex].toLowerCase()) {
        searchIndex++;
      }
      if (searchIndex === searchInput.length) {
        return true;
      }
    }
    return false;
  };

  const searchInItems = (
    items: ItemType[],
    searchInput: string,
    categoryTitle: string
  ): void => {
    for (const item of items) {
      if (fuzzyMatch(item.title, searchInput)) {
        results.push({
          level: 'Item',
          category: categoryTitle,
          item: item.title
        });
      }

      if (item.sub) {
        for (const subItem of item.sub) {
          if (fuzzyMatch(subItem.title, searchInput)) {
            results.push({
              level: 'Sub Item',
              category: categoryTitle,
              item: item.title,
              subItem: subItem.title
            });
          }
        }
      }
    }
  };

  for (const category of sidebarContent) {
    if (fuzzyMatch(category.title, searchInput)) {
      results.push({
        level: 'Item',
        category: category.title,
        item: ''
      });
    }

    searchInItems(category.items, searchInput, category.title);
  }

  return results;
};
