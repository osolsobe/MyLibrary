import { useState, useEffect } from 'react';
import { Book, Category } from '@/types/book';

const categories: Category[] = [
  'Novels and Fiction',
  'Sci-fi, Fantasy and Horror',
  'Crime and Thrillers',
  'Romance and Relationships',
  'Non-Fiction / Educational',
  'Personal Development and Motivation',
  'Biographies and Travel',
  'Children\'s and Young Adult Books',
  'Art, Culture and Hobbies'
];

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (book: { id: string; title: string; author: string; category: Category }) => Promise<void>;
  book: Book | null;
}

export default function EditBookModal({ isOpen, onClose, onEdit, book }: EditBookModalProps) {
  const [editedBook, setEditedBook] = useState<{ title: string; author: string; category: Category }>({
    title: '',
    author: '',
    category: categories[0]
  });

  useEffect(() => {
    if (book) {
      setEditedBook({
        title: book.title,
        author: book.author,
        category: book.category
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      await onEdit({
        id: book.id,
        ...editedBook
      });
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Book</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title
            </label>
            <input
              type="text"
              value={editedBook.title}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={editedBook.author}
              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={editedBook.category}
              onChange={(e) => setEditedBook({ ...editedBook, category: e.target.value as Category })}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 