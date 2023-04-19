export type SubItemType = {
  title: string,
  type: string
}

export type ItemType = {
  title: string;
  type: string;
  icon?: string;
  sub?: SubItemType[]
}

export interface SidebarContentType {
  title: string;
  icon: string;
  items: ItemType[];
}
