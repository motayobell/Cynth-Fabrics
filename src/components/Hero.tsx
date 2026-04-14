import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroCarousel, MediaItem } from './HeroCarousel';
import { api } from '../services/api';

const HERO_ITEMS: MediaItem[] = [
  {
    id: 1,
    type: 'image',
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9LPwI45V1RmCpNujv214sIY6WDaoHq1Iw_0Py7gADdZysl8Bl4rzpvD9oFPZgx1zTtpQWX0dOrlbFXzQPA85YfxTC28tMP9IMo-RWhHtJ5hW1DbTnZE2A7dADDA2YjwG19H_7-Ct-dXgzV85grAtCtdcf5VkUR6gOFUARIVfK14lds_R0OarmOeehINhOcYabfhb-SZW-gzYd1ervcwKuXik2q6lVEeh3ZI5u01BT_V_6v5UF7UlAfNUXctHLdJDe_XEh_QbFaPY",
    alt: "Woman in nature"
  },
  {
    id: 2,
    type: 'video',
    src: "https://cdn.coverr.co/videos/coverr-walking-in-a-field-of-flowers-5334/1080p.mp4",
    poster: "https://cdn.coverr.co/videos/coverr-walking-in-a-field-of-flowers-5334/poster.jpg"
  },
  {
    id: 3,
    type: 'image',
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    alt: "Fashion model walking"
  }
];

export function Hero() {
  const [items, setItems] = useState<MediaItem[]>(HERO_ITEMS);
  const [content, setContent] = useState({
    smallHeading: 'New Season 2024',
    heading: 'Wear Your Roots With Pride',
    subheading: 'High-fashion Nigerian native wear designed for the global citizen.\nAuthenticity woven into every fiber, delivered worldwide.',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    button2Text: 'View Lookbook',
    button2Link: '/lookbook'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getContent('siteContent');
        
        let parsed = null;
        if (data && data.pages) {
          parsed = data.pages;
        } else {
          const savedContent = localStorage.getItem('siteContent');
          if (savedContent) parsed = JSON.parse(savedContent);
        }

        if (parsed) {
          const homePage = parsed.find((p: any) => p.id === 'home');
          const heroSection = homePage?.sections.find((s: any) => s.id === 'home-hero');
          if (heroSection?.content) {
            if (heroSection.content.items) {
              setItems(heroSection.content.items);
            }
            setContent(prev => ({
              ...prev,
              ...heroSection.content
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load content', e);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <HeroCarousel items={items} interval={6000} />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mt-16">
        <span className="text-brand-pink tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold mb-4 block">
          {content.smallHeading}
        </span>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1] md:leading-none whitespace-pre-line">
          {content.heading}
        </h2>
        <p className="text-stone-200 text-base md:text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed whitespace-pre-line">
          {content.subheading}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
          <Link to={content.buttonLink} className="bg-brand-pink text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white hover:text-brand-pink transition-all text-xs w-full sm:w-auto">
            {content.buttonText}
          </Link>
          <Link to={content.button2Link} className="border border-white/40 text-white backdrop-blur-sm px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-xs w-full sm:w-auto">
            {content.button2Text}
          </Link>
        </div>
      </div>
    </section>
  );
}
