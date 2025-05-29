import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { Book } from '@/types';

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

// Helper function to convert database book to app book
export const dbBookToAppBook = (dbBook: typeof books.$inferSelect): Book => ({
  id: dbBook.id.toString(),
  title: dbBook.title,
  author: dbBook.author,
  category: dbBook.category,
  isRead: dbBook.isRead,
  addedAt: dbBook.addedAt.toISOString(),
  completedAt: dbBook.completedAt?.toISOString() || null,
});

// Initialize database table
export async function initDatabase() {
  try {
    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'books'
      );
    `;

    if (!tableExists[0].exists) {
      // Create table if it doesn't exist
      await sql`
        CREATE TABLE books (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          category TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT false,
          added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP
        );
      `;
      console.log('Books table created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 