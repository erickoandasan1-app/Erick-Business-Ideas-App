
import React from 'react';
import { LightbulbIcon } from './Icons.tsx';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-base-200 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={onLogoClick}
          >
            <LightbulbIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="ml-3 text-2xl font-bold text-base-content">Business Ideas</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;