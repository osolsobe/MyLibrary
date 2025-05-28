'use client';

import { useState, useEffect } from 'react';
import { Book, Category } from '@/types/book';
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal';
import CompleteBookModal from '@/components/CompleteBookModal';
import CategoryFilter from '@/components/CategoryFilter';
import Link from 'next/link';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

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
      setIsAddModalOpen(false);
      fetchBooks();
    }
  };

  const handleEditBook = async (book: { id: string; title: string; author: string; category: Category }) => {
    const response = await fetch('/api/books', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (response.ok) {
      setIsEditModalOpen(false);
      setSelectedBook(null);
      fetchBooks();
    }
  };

  const handleCompleteBook = async (completedAt: string) => {
    if (!selectedBook) return;
    
    const response = await fetch('/api/books', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: selectedBook.id, 
        isRead: true,
        completedAt 
      }),
    });
    if (response.ok) {
      setIsCompleteModalOpen(false);
      setSelectedBook(null);
      fetchBooks();
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    const response = await fetch('/api/books', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      fetchBooks();
    }
  };

  const toggleRead = async (book: Book) => {
    if (book.isRead) {
      const response = await fetch('/api/books', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: book.id, 
          isRead: false 
        }),
      });
      if (response.ok) {
        fetchBooks();
      }
    } else {
      setSelectedBook(book);
      setIsCompleteModalOpen(true);
    }
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const filteredBooks = books.filter(book => 
    selectedCategory === 'All' || book.category === selectedCategory
  );

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
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Book
          </button>
        </div>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="space-y-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">{book.category}</p>
              {book.completedAt && (
                <p className="text-sm text-gray-500">
                  Completed: {new Date(book.completedAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(book)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Edit
              </button>
              <button
                onClick={() => toggleRead(book)}
                className={`px-4 py-2 rounded ${
                  book.isRead ? 'bg-green-500' : 'bg-gray-300'
                } text-white hover:opacity-90`}
              >
                {book.isRead ? 'Read' : 'Unread'}
              </button>
              <button
                onClick={() => handleDeleteBook(book.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditBook}
        book={selectedBook}
      />

      <CompleteBookModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedBook(null);
        }}
        onComplete={handleCompleteBook}
      />
    </main>
  );
}
