interface SubItem {
  title: string;
  type: string;
}

export interface SidebarItemType {
  title: string;
  type: string;
  sub: SubItem[];
}
