import React, { useState } from 'react';
import type { Language, Profile } from '../types';
import type { strings } from '../localization/strings';
import { WelcomeIllustration } from './Icons';

interface WelcomeScreenProps {
  onUserAdd: (name: string, profileDetails: Partial<Profile>) => void;
  t: (key: keyof typeof strings.fa) => string;
  language: Language;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUserAdd, t, language }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUserAdd(name.trim(), { birthDate });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 pt-12 items-center text-center">
      <WelcomeIllustration className="w-48 h-48 text-primary-500" />
      
      <h1 className="text-3xl font-bold mt-6 text-primary-600 dark:text-primary-400">{t('appName')}</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 mb-8">به دستیار هوشمند مدیریت دیابت خود خوش آمدید.</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 text-right rtl:text-right">
        <div>
          <label htmlFor="welcome-name" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">{t('name')}</label>
          <input
            id="welcome-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="نام شما"
            required
          />
        </div>
        <div>
          <label htmlFor="welcome-birthDate" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">{t('birthDate')} ({t('optional')})</label>
          <input
            id="welcome-birthDate"
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder={language === 'fa' ? 'مثال: ۱۳۷۵/۰۱/۲۰' : 'e.g., 1996/04/09'}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <button
          type="submit"
          style={{ background: 'linear-gradient(to top right, var(--gradient-start), var(--gradient-end))' }}
          className="w-full text-white p-3 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200 font-semibold"
        >
          شروع کنیم
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
