export type SubItemType = {
  title: string,
  type: string
}

export type ItemType = {
  title: string;
  type?: string;
  sub?: SubItemType[]
}

export interface SidebarContentType {
  title: string;
  icon: any;
  items: ItemType[];
}
