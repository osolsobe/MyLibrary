import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';

const dataFilePath = path.join(process.cwd(), 'src/data/books.json');

async function readBooks(): Promise<{ books: Book[] }> {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeBooks(data: { books: Book[] }) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readBooks();
    return NextResponse.json(data.books);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const book: Omit<Book, 'id' | 'addedAt'> = await request.json();
    const data = await readBooks();
    
    const newBook: Book = {
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString(),
    };
    
    data.books.push(newBook);
    await writeBooks(data);
    
    return NextResponse.json(newBook);
  } catch {
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isRead, completedAt } = await request.json();
    const data = await readBooks();
    
    const bookIndex = data.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    data.books[bookIndex].isRead = isRead;
    if (isRead && completedAt) {
      data.books[bookIndex].completedAt = completedAt;
    } else if (!isRead) {
      delete data.books[bookIndex].completedAt;
    }
    
    await writeBooks(data);
    
    return NextResponse.json(data.books[bookIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, title, author, category } = await request.json();
    const data = await readBooks();
    
    const bookIndex = data.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    data.books[bookIndex] = {
      ...data.books[bookIndex],
      title,
      author,
      category,
    };
    
    await writeBooks(data);
    
    return NextResponse.json(data.books[bookIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = await readBooks();
    
    const bookIndex = data.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    data.books.splice(bookIndex, 1);
    await writeBooks(data);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
} 