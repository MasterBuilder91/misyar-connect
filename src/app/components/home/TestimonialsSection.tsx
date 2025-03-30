// src/app/components/home/TestimonialsSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('landing.successStoriesTitle')}
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                {/* Placeholder for blurred profile image */}
                <div className="w-full h-full rounded-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <blockquote className="text-xl text-gray-700 italic mb-4">
                  {t('landing.testimonial1')}
                </blockquote>
                <p className="text-gray-500">
                  {t('landing.testimonial1Author')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation dots for multiple testimonials */}
          <div className="flex justify-center mt-8">
            <button className="w-3 h-3 rounded-full bg-teal-700 mx-1"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300 mx-1"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300 mx-1"></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
