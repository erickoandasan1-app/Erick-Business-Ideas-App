
import React, { useState, useMemo, useCallback } from 'react';
import { Idea, View } from './types.ts';
import Header from './components/Header.tsx';
import IdeaList from './components/IdeaList.tsx';
import IdeaForm from './components/IdeaForm.tsx';
import IdeaDetailView from './components/IdeaDetailView.tsx';
import { PlusIcon } from './components/Icons.tsx';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const savedIdeas = localStorage.getItem('ideas');
      return savedIdeas ? JSON.parse(savedIdeas) : [];
    } catch (error) {
      console.error("Failed to parse ideas from localStorage", error);
      return [];
    }
  });
  
  const [view, setView] = useState<View>('list');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'archived'>('all');

  const saveIdeasToLocalStorage = (updatedIdeas: Idea[]) => {
    try {
      localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
    } catch (error) {
      console.error("Failed to save ideas to localStorage", error);
    }
  };

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'isArchived'>) => {
    const newIdea: Idea = {
      ...idea,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isArchived: false,
    };
    const updatedIdeas = [...ideas, newIdea];
    setIdeas(updatedIdeas);
    saveIdeasToLocalStorage(updatedIdeas);
    setView('list');
  };

  const updateIdea = (updatedIdea: Idea) => {
    const updatedIdeas = ideas.map((idea) =>
      idea.id === updatedIdea.id ? updatedIdea : idea
    );
    setIdeas(updatedIdeas);
    saveIdeasToLocalStorage(updatedIdeas);
    setView('list');
  };
  
  const toggleFavorite = useCallback((id: string) => {
    const updatedIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
    );
    setIdeas(updatedIdeas);
    saveIdeasToLocalStorage(updatedIdeas);
  }, [ideas]);

  const toggleArchive = useCallback((id: string) => {
    const updatedIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, isArchived: !idea.isArchived } : idea
    );
    setIdeas(updatedIdeas);
    saveIdeasToLocalStorage(updatedIdeas);
    setView('list');
  }, [ideas]);

  const deleteIdea = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this idea permanently?')) {
        const updatedIdeas = ideas.filter((idea) => idea.id !== id);
        setIdeas(updatedIdeas);
        saveIdeasToLocalStorage(updatedIdeas);
        setView('list');
    }
  }, [ideas]);

  const viewIdea = (id: string) => {
    setSelectedIdeaId(id);
    setView('detail');
  };
  
  const editIdea = (id: string) => {
    setSelectedIdeaId(id);
    setView('edit');
  };

  const selectedIdea = useMemo(() => ideas.find(idea => idea.id === selectedIdeaId), [ideas, selectedIdeaId]);

  const filteredIdeas = useMemo(() => {
    const activeIdeas = ideas.filter(idea => !idea.isArchived);
    const archivedIdeas = ideas.filter(idea => idea.isArchived);

    let displayIdeas;
    switch (filter) {
      case 'favorites':
        displayIdeas = activeIdeas.filter(idea => idea.isFavorite);
        break;
      case 'archived':
        displayIdeas = archivedIdeas;
        break;
      case 'all':
      default:
        displayIdeas = activeIdeas;
        break;
    }
    
    if (!searchTerm) {
      return displayIdeas;
    }

    return displayIdeas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ideas, searchTerm, filter]);
  
  const renderContent = () => {
    switch (view) {
      case 'add':
        return <IdeaForm onSubmit={addIdea} onCancel={() => setView('list')} />;
      case 'edit':
        return selectedIdea ? <IdeaForm ideaToEdit={selectedIdea} onSubmit={updateIdea} onCancel={() => setView('detail')} /> : <p>Idea not found</p>;
      case 'detail':
        return selectedIdea ? <IdeaDetailView idea={selectedIdea} onBack={() => setView('list')} onEdit={editIdea} onToggleArchive={toggleArchive} onDelete={deleteIdea} /> : <p>Idea not found</p>;
      case 'list':
      default:
        return <IdeaList ideas={filteredIdeas} onIdeaClick={viewIdea} onToggleFavorite={toggleFavorite} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filter={filter} setFilter={setFilter} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <Header onLogoClick={() => setView('list')} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {renderContent()}
      </main>
      {view === 'list' && (
        <button
          onClick={() => setView('add')}
          className="fixed bottom-6 right-6 bg-brand-primary hover:bg-indigo-500 text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary"
          aria-label="Add new idea"
        >
          <PlusIcon className="h-8 w-8" />
        </button>
      )}
    </div>
  );
};

export default App;