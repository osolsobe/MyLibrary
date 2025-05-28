'use client';

import { useState, useEffect } from 'react';
import { Book, Category } from '@/types/book';
import AddBookModal from '@/components/AddBookModal';
import Link from 'next/link';

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

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  const handleAddBook = async (book: { title: string; author: string; category: Category }) => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (response.ok) {
      setIsModalOpen(false);
      fetchBooks();
    }
  };

  const toggleRead = async (id: string, isRead: boolean) => {
    const response = await fetch('/api/books', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, isRead }),
    });
    if (response.ok) {
      fetchBooks();
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Library</h1>
        <div className="flex gap-4">
          <Link
            href="/statistics"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Statistics
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Book
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">{book.category}</p>
            </div>
            <button
              onClick={() => toggleRead(book.id, !book.isRead)}
              className={`px-4 py-2 rounded ${
                book.isRead ? 'bg-green-500' : 'bg-gray-300'
              } text-white hover:opacity-90`}
            >
              {book.isRead ? 'Read' : 'Unread'}
            </button>
          </div>
        ))}
      </div>

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBook}
      />
    </main>
  );
}
