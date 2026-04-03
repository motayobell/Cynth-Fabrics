import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaCarousel } from './MediaCarousel';
import { MediaItem } from './HeroCarousel';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function StorySection() {
  const [content, setContent] = useState({
    smallHeading: 'Our Heritage',
    heading: 'Tradition Reimagined for the Modern World',
    text1: 'Founded in the heart of Lagos and refined for the global stage, Cynth Fabrics is more than a fashion label. We are a bridge between generations. Each piece we create is a love letter to Nigerian craftsmanship, utilizing techniques passed down through centuries to dress the visionaries of today.',
    text2: 'We source only the finest fabrics—from authentic Aso-Oke to premium Italian silks—ensuring that when you wear Cynth Fabrics, you carry the weight of tradition with the comfort of modern luxury.',
    linkText: 'Discover Our Process',
    linkUrl: '/about',
    mediaItems: [
      {
        id: 1,
        type: 'image' as const,
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeBhEn-EOzB9gmZQPNqkQVzZ-xNnW6TAb2s989SZBLmldrHJ2Al1OPQx7yVcUOyxWuimxTuX9zgTmQ25ZLSjZ_bYo29APMCNb84aAQ1jX_dFYTwZkWmZ9e42fFAfQgD_uftCqmQKpsLnacIpxyUUXikUv21Zu_1fl0J4hDsNRudMwZfbEX0SaervB1rT33TRCNbx-e_LMLIU_GyMcMr9ZH5dPT_lyXchylZneklp6Lt0ZyWoW2UkBSAYpRVKeRCg_RBE5quvdo6Ww',
        alt: 'Sustainable Materials'
      }
    ] as MediaItem[]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'content', 'siteContent');
        const docSnap = await getDoc(docRef);
        
        let parsed = null;
        if (docSnap.exists()) {
          parsed = docSnap.data().pages;
        } else {
          const savedContent = localStorage.getItem('siteContent');
          if (savedContent) parsed = JSON.parse(savedContent);
        }

        if (parsed) {
          const homePage = parsed.find((p: any) => p.id === 'home');
          const storySection = homePage?.sections.find((s: any) => s.id === 'home-story');
          if (storySection?.content) {
            setContent(prev => ({
              ...prev,
              ...storySection.content,
              mediaItems: storySection.content.mediaItems || (storySection.content.image ? [{ id: 1, type: 'image', src: storySection.content.image, alt: 'Image' }] : prev.mediaItems)
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
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-full h-full border-t-2 border-l-2 border-brand-pink z-0"></div>
            <div className="relative z-10 w-full h-[350px] md:h-[500px] rounded-sm shadow-xl bg-gray-200">
              <MediaCarousel 
                items={content.mediaItems} 
                className="w-full h-full rounded-sm"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-brand-pink z-20"></div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            <span className="text-brand-pink font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">{content.smallHeading}</span>
            <h2 className="font-serif text-3xl md:text-5xl text-deep-brown leading-tight">{content.heading}</h2>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed font-light">
              {content.text1}
            </p>
            {content.text2 && (
              <p className="text-stone-600 text-base md:text-lg leading-relaxed font-light">
                {content.text2}
              </p>
            )}
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link to={content.linkUrl} className="inline-flex items-center space-x-4 group">
                <span className="w-8 md:w-12 h-[1px] bg-brand-pink group-hover:w-16 md:group-hover:w-20 transition-all duration-300"></span>
                <span className="uppercase tracking-widest text-xs md:text-sm font-bold text-brand-pink">{content.linkText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
