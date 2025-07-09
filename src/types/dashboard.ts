export interface Page {
  id: string;
  title: string;
  slug: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  title: string;
  path: string; 
  parentPath: string;
  pages: Page[];
  isOpen?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DashboardState {
  currentPageId?: string;
  folders: Folder[];
  user?: User;
  isLoading?: boolean;
}
