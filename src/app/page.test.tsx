import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { Book } from '@/types/book';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the modals
jest.mock('@/components/AddBookModal', () => {
  return function MockAddBookModal({ isOpen, onClose, onAdd }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="add-book-modal">
        <button onClick={() => onAdd({ title: 'Test Book', author: 'Test Author', category: 'Novels and Fiction' })}>
          Add Test Book
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('@/components/EditBookModal', () => {
  return function MockEditBookModal({ isOpen, onClose, onEdit, book }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="edit-book-modal">
        <button onClick={() => onEdit({ ...book, title: 'Updated Title' })}>
          Update Book
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('@/components/CompleteBookModal', () => {
  return function MockCompleteBookModal({ isOpen, onClose, onComplete }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="complete-book-modal">
        <button onClick={() => onComplete('2024-03')}>
          Complete Book
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('Home Page', () => {
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Test Book 1',
      author: 'Author 1',
      category: 'Novels and Fiction',
      isRead: false,
      addedAt: '2024-03-20T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test Book 2',
      author: 'Author 2',
      category: 'Sci-fi, Fantasy and Horror',
      isRead: true,
      addedAt: '2024-03-19T00:00:00.000Z',
      completedAt: '2024-03-20T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBooks),
    });
  });

  it('renders the page with books', async () => {
    render(<Home />);
    
    // Check if the title is rendered
    expect(screen.getByText('My Library')).toBeInTheDocument();
    
    // Check if books are rendered
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  it('filters books by category', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    // Select a category
    const categorySelect = screen.getByLabelText('Filter by Category');
    fireEvent.change(categorySelect, { target: { value: 'Novels and Fiction' } });

    // Check if only books from selected category are shown
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument();
  });

  it('adds a new book', async () => {
    render(<Home />);
    
    // Open add book modal
    const addButton = screen.getByText('Add New Book');
    fireEvent.click(addButton);

    // Add a book
    const addTestBookButton = screen.getByText('Add Test Book');
    fireEvent.click(addTestBookButton);

    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Book',
          author: 'Test Author',
          category: 'Novels and Fiction',
        }),
      });
    });
  });

  it('edits a book', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Open edit modal
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Update the book
    const updateButton = screen.getByText('Update Book');
    fireEvent.click(updateButton);

    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/books', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          title: 'Updated Title',
          author: 'Author 1',
          category: 'Novels and Fiction',
        }),
      });
    });
  });

  it('marks a book as read', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click unread button
    const unreadButton = screen.getByText('Unread');
    fireEvent.click(unreadButton);

    // Complete the book
    const completeButton = screen.getByText('Complete Book');
    fireEvent.click(completeButton);

    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/books', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          isRead: true,
          completedAt: '2024-03',
        }),
      });
    });
  });

  it('deletes a book', async () => {
    // Mock confirm dialog
    global.confirm = jest.fn(() => true);

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/books', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
        }),
      });
    });
  });
}); 