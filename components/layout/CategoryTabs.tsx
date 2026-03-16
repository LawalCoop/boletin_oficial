'use client';

import { Categoria } from '@/lib/types';

interface CategoryTabsProps {
  activeCategory: Categoria | 'todos';
  onCategoryChange: (category: Categoria | 'todos') => void;
}

const categories: { key: Categoria | 'todos'; label: string }[] = [
  { key: 'todos', label: 'TODOS' },
  { key: 'nacional', label: 'NACIONAL' },
  { key: 'provincial', label: 'PROVINCIAL' },
  { key: 'municipal', label: 'MUNICIPAL' },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="border-b border-border overflow-x-auto no-scrollbar">
      <div className="flex px-4 lg:px-0 lg:justify-center lg:gap-2 max-w-7xl mx-auto">
        {categories.map(({ key, label }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`flex items-center justify-center px-3 lg:px-5 py-[14px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-b-2 border-accent'
                  : 'hover:bg-bg-surface'
              }`}
            >
              <span
                className={`text-[11px] lg:text-xs font-semibold tracking-[1.5px] ${
                  isActive ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
