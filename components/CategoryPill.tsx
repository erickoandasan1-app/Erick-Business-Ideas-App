
import React from 'react';

interface CategoryPillProps {
  category: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category }) => {
  if (!category) return null;

  return (
    <span className="inline-block bg-brand-primary/20 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full">
      {category}
    </span>
  );
};

export default CategoryPill;
