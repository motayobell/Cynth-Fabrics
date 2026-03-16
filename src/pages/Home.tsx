import React from 'react';
import { Hero } from '../components/Hero';
import { TrustBar } from '../components/TrustBar';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { StorySection } from '../components/StorySection';
import { Newsletter } from '../components/Newsletter';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <TrustBar />
      <FeaturedCollection />
      <StorySection />
      <Newsletter />
    </div>
  );
}
