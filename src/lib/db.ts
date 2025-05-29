import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Define the books table schema
export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  addedAt: timestamp('added_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Helper function to convert database book to application book
export function dbBookToAppBook(dbBook: typeof books.$inferSelect) {
  return {
    id: dbBook.id.toString(),
    title: dbBook.title,
    author: dbBook.author,
    category: dbBook.category as any, // We know it's a valid category
    isRead: dbBook.isRead,
    addedAt: dbBook.addedAt.toISOString(),
    completedAt: dbBook.completedAt?.toISOString(),
  };
} 