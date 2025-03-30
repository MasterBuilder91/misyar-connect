// src/app/components/home/HeroSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative bg-teal-700 text-white">
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-xl mb-8 text-cream-100">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="lg">
              {t('landing.joinNow')}
            </Button>
            <Button variant="secondary" size="lg">
              {t('landing.learnMore')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
