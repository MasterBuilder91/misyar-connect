// src/app/components/education/MisyarEducationSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export const MisyarEducationSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {t('education.title')}
          </h2>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('education.whatIsMisyar')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('education.misyarDefinition')}
            </p>
            <p className="text-gray-700 mb-4">
              {t('education.misyarExplanation')}
            </p>
            
            <div className="border-l-4 border-teal-700 pl-4 py-2 bg-teal-50 my-6">
              <p className="text-gray-700 italic">
                {t('education.scholarQuote')}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {t('education.scholarName')}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('education.keyDifferences')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('education.traditionalMarriage')}
                </h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>{t('education.traditional1')}</li>
                  <li>{t('education.traditional2')}</li>
                  <li>{t('education.traditional3')}</li>
                  <li>{t('education.traditional4')}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('education.misyarMarriage')}
                </h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>{t('education.misyar1')}</li>
                  <li>{t('education.misyar2')}</li>
                  <li>{t('education.misyar3')}</li>
                  <li>{t('education.misyar4')}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('education.commonScenarios')}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('education.scenario1Title')}
                </h4>
                <p className="text-gray-700">
                  {t('education.scenario1Description')}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('education.scenario2Title')}
                </h4>
                <p className="text-gray-700">
                  {t('education.scenario2Description')}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('education.scenario3Title')}
                </h4>
                <p className="text-gray-700">
                  {t('education.scenario3Description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisyarEducationSection;
