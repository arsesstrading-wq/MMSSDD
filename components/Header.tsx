import React from 'react';
import { BackIcon, SettingsIcon } from './Icons';

interface HeaderProps {
  title: string;
  onBack: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onSettingsClick }) => (
  <div style={{ background: 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))', paddingTop: 'var(--safe-area-inset-top)' }} className="p-4 sm:px-5 lg:px-6 text-white sticky top-0 z-10 shadow-md">
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 flex justify-start">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {onSettingsClick ? (
              <button
                onClick={onSettingsClick}
                className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                title="Settings"
                aria-label="Settings"
              >
                <SettingsIcon />
              </button>
            ) : (
              <div className="w-10 h-10" /> // Placeholder for balance
            )}
        </div>
      </div>
      <h2 className="text-xl font-bold flex-shrink-0 text-center px-2">{title}</h2>
      <div className="flex-1 flex justify-end">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 flex items-center justify-center" aria-label="Back">
            <BackIcon className="h-6 w-6 rtl:rotate-180" />
        </button>
      </div>
    </div>
  </div>
);

export default Header;