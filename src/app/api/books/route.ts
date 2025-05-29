import { NextResponse } from 'next/server';
import { db, books, dbBookToAppBook, initDatabase } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { Book } from '@/types/book';

// Initialize database on first request
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    await initDatabase();
    isInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    const dbBooks = await db.select().from(books);
    return NextResponse.json(dbBooks.map(dbBookToAppBook));
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const book: Omit<Book, 'id' | 'addedAt'> = await request.json();
    
    const [newDbBook] = await db.insert(books).values({
      title: book.title,
      author: book.author,
      category: book.category,
      isRead: book.isRead,
    }).returning();
    
    const newBook = dbBookToAppBook(newDbBook);
    return NextResponse.json(newBook);
  } catch (error) {
    console.error('Failed to add book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isRead, completedAt } = await request.json();
    
    const [updatedDbBook] = await db.update(books)
      .set({
        isRead,
        completedAt: completedAt ? new Date(completedAt) : null,
      })
      .where(eq(books.id, parseInt(id)))
      .returning();
    
    if (!updatedDbBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    const updatedBook = dbBookToAppBook(updatedDbBook);
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, title, author, category } = await request.json();
    
    const [updatedDbBook] = await db.update(books)
      .set({
        title,
        author,
        category,
      })
      .where(eq(books.id, parseInt(id)))
      .returning();
    
    if (!updatedDbBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    const updatedBook = dbBookToAppBook(updatedDbBook);
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const [deletedDbBook] = await db.delete(books)
      .where(eq(books.id, parseInt(id)))
      .returning();
    
    if (!deletedDbBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
} 