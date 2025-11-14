
import React, { useState, useCallback } from 'react';
import { Idea, AIEnhancement } from '../types';
import { enhanceIdeaWithAI } from '../services/geminiService';
import { SparklesIcon, MagicWandIcon } from './Icons';

interface IdeaFormProps {
  ideaToEdit?: Idea;
  onSubmit: (idea: any) => void;
  onCancel: () => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ ideaToEdit, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(ideaToEdit?.title || '');
  const [description, setDescription] = useState(ideaToEdit?.description || '');
  const [category, setCategory] = useState(ideaToEdit?.category || '');
  const [potentialRevenue, setPotentialRevenue] = useState(ideaToEdit?.potentialRevenue || '');
  const [targetMarket, setTargetMarket] = useState(ideaToEdit?.targetMarket || '');
  const [isFavorite, setIsFavorite] = useState(ideaToEdit?.isFavorite || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ideaData = {
      ...ideaToEdit,
      title,
      description,
      category,
      potentialRevenue,
      targetMarket,
      isFavorite
    };
    onSubmit(ideaData);
  };
  
  const handleEnhance = useCallback(async () => {
    if (!title && !description) {
      setAiError("Please provide a title or description to enhance.");
      return;
    }
    setIsEnhancing(true);
    setAiError('');
    try {
      const result: AIEnhancement = await enhanceIdeaWithAI(title, description);
      if (result.description) setDescription(result.description);
      if (result.targetMarket) setTargetMarket(result.targetMarket);
      if (result.potentialRevenue) setPotentialRevenue(result.potentialRevenue);
    } catch (error) {
      console.error("AI enhancement failed:", error);
      setAiError("Failed to enhance idea. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  }, [title, description]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-base-200 p-8 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-6">{ideaToEdit ? 'Edit Idea' : 'Add New Idea'}</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full bg-base-300 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mt-1 block w-full bg-base-300 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
      </div>
      
      <div className="text-right">
        <button type="button" onClick={handleEnhance} disabled={isEnhancing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary focus:ring-offset-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {isEnhancing ? (
            <>
              <MagicWandIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Enhancing...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
              Enhance with AI
            </>
          )}
        </button>
        {aiError && <p className="text-red-500 text-sm mt-2 text-left">{aiError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full bg-base-300 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g., SaaS, E-commerce"/>
        </div>
        <div>
          <label htmlFor="potentialRevenue" className="block text-sm font-medium text-gray-300">Potential Revenue</label>
          <input type="text" id="potentialRevenue" value={potentialRevenue} onChange={(e) => setPotentialRevenue(e.target.value)} className="mt-1 block w-full bg-base-300 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g., $100k/year"/>
        </div>
      </div>
      
      <div>
        <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-300">Target Market</label>
        <input type="text" id="targetMarket" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} className="mt-1 block w-full bg-base-300 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g., Small Businesses, Students"/>
      </div>
      
      <div className="flex items-center">
        <input id="isFavorite" type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="h-4 w-4 text-brand-primary border-gray-600 rounded focus:ring-brand-primary" />
        <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-300">Mark as Favorite</label>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-base-300">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-base-content bg-base-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-base-200">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-base-200 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Idea'}
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;
