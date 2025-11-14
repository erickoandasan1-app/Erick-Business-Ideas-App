
import React from 'react';
import { Idea } from '../types';
import { ArrowLeftIcon, PencilIcon, ArchiveIcon, TrashIcon, CurrencyDollarIcon, UserGroupIcon, TagIcon } from './Icons';
import CategoryPill from './CategoryPill';

interface IdeaDetailViewProps {
  idea: Idea;
  onBack: () => void;
  onEdit: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-base-300 text-brand-primary">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400">{label}</p>
            <div className="text-lg text-base-content">{value}</div>
        </div>
    </div>
);

const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ idea, onBack, onEdit, onToggleArchive, onDelete }) => {
  return (
    <div className="bg-base-200 p-6 sm:p-8 rounded-lg shadow-2xl max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-base-300 pb-6">
        <button onClick={onBack} className="flex items-center text-sm text-gray-400 hover:text-brand-primary mb-4 sm:mb-0">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(idea.id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm">
            <PencilIcon className="h-4 w-4 mr-2" /> Edit
          </button>
          <button onClick={() => onToggleArchive(idea.id)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md flex items-center text-sm">
            <ArchiveIcon className="h-4 w-4 mr-2" /> {idea.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button onClick={() => onDelete(idea.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center text-sm">
            <TrashIcon className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{idea.title}</h1>
      <p className="text-gray-300 mb-8 whitespace-pre-wrap">{idea.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DetailItem icon={<TagIcon className="h-5 w-5"/>} label="Category" value={<CategoryPill category={idea.category} />} />
        <DetailItem icon={<UserGroupIcon className="h-5 w-5"/>} label="Target Market" value={idea.targetMarket} />
        <DetailItem icon={<CurrencyDollarIcon className="h-5 w-5"/>} label="Potential Revenue" value={idea.potentialRevenue} />
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-base-300 text-brand-primary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">Created At</p>
                <div className="text-lg text-base-content">{new Date(idea.createdAt).toLocaleString()}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailView;
