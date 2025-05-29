import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';

const dataFilePath = path.join(process.cwd(), 'src/data/books.json');

async function readBooks(): Promise<Book[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    console.error('Error reading books:', error);
    return [];
  }
}

async function writeBooks(books: Book[]) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error writing books:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const books = await readBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const book: Omit<Book, 'id' | 'addedAt'> = await request.json();
    const books = await readBooks();
    
    const newBook: Book = {
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString(),
    };
    
    books.push(newBook);
    await writeBooks(books);
    
    return NextResponse.json(newBook);
  } catch (error) {
    console.error('Failed to add book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isRead, completedAt } = await request.json();
    const books = await readBooks();
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    books[bookIndex].isRead = isRead;
    if (isRead && completedAt) {
      books[bookIndex].completedAt = completedAt;
    } else if (!isRead) {
      delete books[bookIndex].completedAt;
    }
    
    await writeBooks(books);
    
    return NextResponse.json(books[bookIndex]);
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, title, author, category } = await request.json();
    const books = await readBooks();
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    books[bookIndex] = {
      ...books[bookIndex],
      title,
      author,
      category,
    };
    
    await writeBooks(books);
    
    return NextResponse.json(books[bookIndex]);
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const books = await readBooks();
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    books.splice(bookIndex, 1);
    await writeBooks(books);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
} 