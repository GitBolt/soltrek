import { ItemType } from '@/types/sidebar';
import { sidebarContent } from './sidebarContent';

export type SearchResult = {
  level: 'Item' | 'Sub Item';
  icon: string;
  title: string;
  parentTitle?: string;
  type?: string;
};

export const searcher = (
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
    icon: string
  ): void => {
    for (const item of items) {
      if (fuzzyMatch(item.title, searchInput)) {
        results.push({
          title: item.title,
          level: 'Item',
          icon: icon,
          type: item.type,

        });
      }

      if (item.sub) {
        for (const subItem of item.sub) {
          if (fuzzyMatch(subItem.title, searchInput)) {
            results.push({
              title: subItem.title,
              level: 'Sub Item',
              icon: icon,
              parentTitle: item.title,
              type: item.type
            });
          }
        }
      }
    }
  };

  for (const category of sidebarContent) {
    searchInItems(category.items, searchInput, category.icon);
  }

  return results;
};