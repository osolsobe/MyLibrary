import { Category } from '@/types/book';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
}

const categories: (Category | 'All')[] = [
  'All',
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

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
        className="w-full md:w-64 border p-2 rounded bg-white"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
} 