export interface Page {
  id: string;
  title: string;
  icon: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Folder {
  id: string;
  title: string;
  pages: Page[];
  isOpen?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardState {
  currentPageId?: string;
  folders: Folder[];
  user?: User;
  isLoading?: boolean;
}
