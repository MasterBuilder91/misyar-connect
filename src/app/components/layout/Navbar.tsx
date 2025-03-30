'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Button } from '../ui/Button';
import { FirebaseError } from '../../types';

interface NavbarProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false,
  onSignOut
}) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error('Error signing out:', firebaseError.message);
    }
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-teal-700">MisyarConnect</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.home')}
            </a>
            <a href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.about')}
            </a>
            <a href="/education" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.education')}
            </a>
            
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.dashboard')}
                </a>
                <a href="/messages" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.messages')}
                </a>
                <a href="/settings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.settings')}
                </a>
                <Button onClick={handleSignOut} variant="outline">
                  {t('navbar.signOut')}
                </Button>
              </>
            ) : (
              <>
                <a href="/auth">
                  <Button variant="outline">
                    {t('navbar.signIn')}
                  </Button>
                </a>
                <a href="/auth?mode=signup">
                  <Button>
                    {t('navbar.signUp')}
                  </Button>
                </a>
              </>
            )}
            
            <LanguageSwitcher />
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-700 hover:bg-teal-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.home')}
            </a>
            <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.about')}
            </a>
            <a href="/education" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
              {t('navbar.education')}
            </a>
            
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.dashboard')}
                </a>
                <a href="/messages" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.messages')}
                </a>
                <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.settings')}
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700"
                >
                  {t('navbar.signOut')}
                </button>
              </>
            ) : (
              <>
                <a href="/auth" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.signIn')}
                </a>
                <a href="/auth?mode=signup" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 hover:text-teal-700">
                  {t('navbar.signUp')}
                </a>
              </>
            )}
            
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
