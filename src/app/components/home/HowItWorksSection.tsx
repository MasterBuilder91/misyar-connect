// src/app/components/home/HowItWorksSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('landing.howItWorksTitle')}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Step 1 */}
            <div className="relative flex items-start mb-12">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold z-10">
                1
              </div>
              <div className="ml-8 pt-3">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t('landing.step1')}
                </h3>
                <p className="text-gray-600">
                  Our unique rights-based profile system allows you to clearly communicate which aspects of traditional marriage you're flexible on.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex items-start mb-12">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold z-10">
                2
              </div>
              <div className="ml-8 pt-3">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t('landing.step2')}
                </h3>
                <p className="text-gray-600">
                  Our sophisticated matching algorithm finds compatible partners based on aligned expectations and preferences.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex items-start">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold z-10">
                3
              </div>
              <div className="ml-8 pt-3">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t('landing.step3')}
                </h3>
                <p className="text-gray-600">
                  Connect with potential partners in a respectful environment designed to facilitate meaningful conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
