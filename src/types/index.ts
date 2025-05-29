export type Category = 'fiction' | 'non-fiction' | 'science' | 'history' | 'biography' | 'other';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  isRead: boolean;
  addedAt: string;
  completedAt: string | null;
} 