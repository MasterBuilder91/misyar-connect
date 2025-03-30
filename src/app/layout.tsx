// src/app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { initializeI18n } from './i18n/config';
import { AnalyticsProvider } from './components/analytics/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'] });

// Initialize i18n
initializeI18n();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Add RTL support for Arabic
    const handleLanguageChange = () => {
      const language = localStorage.getItem('language') || 'en';
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    };

    // Set initial direction
    handleLanguageChange();

    // Listen for language changes
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  return (
    <html>
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
