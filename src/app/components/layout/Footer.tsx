// src/app/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{t('app.title')}</h3>
            <p className="text-sm">{t('app.description')}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation.features')}
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-400 hover:text-white transition-colors">
                  {t('navigation.education')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Contact</h4>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.contact')}
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
