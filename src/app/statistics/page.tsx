'use client';

import { useState, useEffect } from 'react';
import { Book, Category } from '@/types/book';
import Link from 'next/link';

export default function Statistics() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    readBooks: 0,
    unreadBooks: 0,
    categoryDistribution: {} as Record<Category, number>,
    topAuthors: [] as { author: string; count: number }[],
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
    calculateStats(data);
  };

  const calculateStats = (books: Book[]) => {
    // Basic counts
    const totalBooks = books.length;
    const readBooks = books.filter(book => book.isRead).length;
    const unreadBooks = totalBooks - readBooks;

    // Category distribution
    const categoryDistribution = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);

    // Top authors
    const authorCounts = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topAuthors = Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalBooks,
      readBooks,
      unreadBooks,
      categoryDistribution,
      topAuthors,
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Library Statistics</h1>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Library
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Read Books</h3>
          <p className="text-3xl font-bold text-green-500">{stats.readBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Unread Books</h3>
          <p className="text-3xl font-bold text-gray-500">{stats.unreadBooks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Books by Category</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Authors</h3>
          <div className="space-y-4">
            {stats.topAuthors.map(({ author, count }) => (
              <div key={author} className="flex justify-between items-center">
                <span className="text-gray-600">{author}</span>
                <span className="font-semibold">{count} books</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 