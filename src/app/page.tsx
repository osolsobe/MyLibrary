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
    <main className="min-h-screen">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Library</h1>
          <div className="flex gap-4 w-full sm:w-auto">
            <Link
              href="/statistics"
              className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              View Statistics
            </Link>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              Add New Book
            </button>
          </div>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">Title & Author</th>
                <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200 hidden md:table-cell">Category</th>
                <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200 hidden md:table-cell">Status</th>
                <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
                    <p className="text-gray-600 mt-1">{book.author}</p>
                    <div className="mt-2 md:hidden">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {book.category}
                      </span>
                      <div className="mt-2">
                        {book.completedAt ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Completed: {new Date(book.completedAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' })}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            Not completed
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-100 hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-100 hidden md:table-cell">
                    {book.completedAt ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Completed: {new Date(book.completedAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Not completed
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(book)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => toggleRead(book)}
                        className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
                          book.isRead 
                            ? 'bg-green-500 hover:bg-green-600 border-green-600' 
                            : 'bg-gray-500 hover:bg-gray-600 border-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">{book.isRead ? 'Read' : 'Unread'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                      >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
