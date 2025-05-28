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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Book</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
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
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 