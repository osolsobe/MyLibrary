import { Category } from '@/types/book';

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

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="relative">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white shadow-sm hover:border-gray-400 transition-colors duration-150 appearance-none"
      >
        <option value="All">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
} 