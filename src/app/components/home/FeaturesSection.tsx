// src/app/components/home/FeaturesSection.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="bg-cream-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('landing.featuresTitle')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('landing.featuresSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title={t('landing.feature1Title')}
            description={t('landing.feature1Desc')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <FeatureCard
            title={t('landing.feature2Title')}
            description={t('landing.feature2Desc')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          
          <FeatureCard
            title={t('landing.feature3Title')}
            description={t('landing.feature3Desc')}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
