'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    
    // Dispatch event for layout direction change
    window.dispatchEvent(new Event('languageChange'));
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm rounded-md ${
          currentLanguage === 'en' 
            ? 'bg-teal-100 text-teal-800 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-sm rounded-md ${
          currentLanguage === 'ar' 
            ? 'bg-teal-100 text-teal-800 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to Arabic"
      >
        عربي
      </button>
    </div>
  );
};
