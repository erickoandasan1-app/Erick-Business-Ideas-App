
import React from 'react';
import { Idea } from '../types.ts';
import IdeaCard from './IdeaCard.tsx';
import { SearchIcon, StarIcon, ArchiveIcon, DocumentTextIcon } from './Icons.tsx';

interface IdeaListProps {
  ideas: Idea[];
  onIdeaClick: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: 'all' | 'favorites' | 'archived';
  setFilter: (filter: 'all' | 'favorites' | 'archived') => void;
}

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onIdeaClick, onToggleFavorite, searchTerm, setSearchTerm, filter, setFilter }) => {
  return (
    <div className="space-y-6">
      <div className="bg-base-200 p-4 rounded-lg shadow-lg">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-base-300 border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('all')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-brand-primary text-white' : 'bg-base-300 hover:bg-gray-600'}`}>
            <DocumentTextIcon className="h-5 w-5 mr-2"/> All Ideas
          </button>
          <button onClick={() => setFilter('favorites')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${filter === 'favorites' ? 'bg-brand-primary text-white' : 'bg-base-300 hover:bg-gray-600'}`}>
            <StarIcon className="h-5 w-5 mr-2"/> Favorites
          </button>
          <button onClick={() => setFilter('archived')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${filter === 'archived' ? 'bg-brand-primary text-white' : 'bg-base-300 hover:bg-gray-600'}`}>
            <ArchiveIcon className="h-5 w-5 mr-2"/> Archived
          </button>
        </div>
      </div>
      
      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onClick={() => onIdeaClick(idea.id)} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Your Vault is Empty</h2>
          <p className="text-gray-400">Click the '+' button to add your first brilliant idea!</p>
        </div>
      )}
    </div>
  );
};

export default IdeaList;