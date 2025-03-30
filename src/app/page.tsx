// src/app/page.tsx
import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturesSection } from './components/home/FeaturesSection';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';

export default function Home() {
  return (
    <main>
      <Navbar transparent={true} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
