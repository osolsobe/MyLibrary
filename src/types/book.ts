export type Category =
  | 'Novels and Fiction'
  | 'Sci-fi, Fantasy and Horror'
  | 'Crime and Thrillers'
  | 'Romance and Relationships'
  | 'Non-Fiction / Educational'
  | 'Personal Development and Motivation'
  | 'Biographies and Travel'
  | 'Children\'s and Young Adult Books'
  | 'Art, Culture and Hobbies';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  isRead: boolean;
  addedAt: string;
  completedAt?: string;
} 