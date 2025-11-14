
import React from 'react';
import { Idea } from '../types';
import { StarIcon, FilledStarIcon } from './Icons';
import CategoryPill from './CategoryPill';

interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
  onToggleFavorite: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick, onToggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(idea.id);
  };
  
  return (
    <div 
      className="bg-base-200 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <CategoryPill category={idea.category} />
          <button onClick={handleFavoriteClick} className="text-gray-400 hover:text-yellow-400 p-1 rounded-full transition-colors">
            {idea.isFavorite ? <FilledStarIcon className="h-6 w-6 text-yellow-400" /> : <StarIcon className="h-6 w-6" />}
          </button>
        </div>
        <h3 className="mt-4 text-xl font-bold text-base-content truncate">{idea.title}</h3>
        <p className="mt-2 text-gray-400 h-12 overflow-hidden text-ellipsis">
          {idea.description.substring(0, 100)}{idea.description.length > 100 ? '...' : ''}
        </p>
        <p className="mt-4 text-xs text-gray-500">
          Created: {new Date(idea.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default IdeaCard;
