
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  potentialRevenue: string;
  targetMarket: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
}

export type View = 'list' | 'add' | 'edit' | 'detail';

export interface AIEnhancement {
  targetMarket: string;
  potentialRevenue: string;
  description: string;
}
