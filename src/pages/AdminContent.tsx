import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  Layout,
  ChevronRight,
  Eye,
  Quote,
  SplitSquareHorizontal,
  BarChart3
} from 'lucide-react';

type SectionType = 'hero' | 'features' | 'text' | 'gallery' | 'cta' | 'split' | 'quote' | 'stats';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error(`File ${file.name} is too large. Please select a file under 5MB.`));
      return;
    }
    if (file.type.startsWith('image/')) {
      compressImage(file)
        .then(resolve)
        .catch(reject);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  });
};

interface ContentSection {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  isVisible: boolean;
}

interface PageContent {
  id: string;
  name: string;
  slug: string;
  sections: ContentSection[];
}

const initialPages: PageContent[] = [
  {
    id: 'home',
    name: 'Home Page',
    slug: '/',
    sections: [
      {
        id: 'home-hero',
        type: 'hero',
        title: 'Hero Carousel',
        isVisible: true,
        content: {
          smallHeading: 'New Season 2024',
          heading: 'Wear Your Roots With Pride',
          subheading: 'High-fashion Nigerian native wear designed for the global citizen.\nAuthenticity woven into every fiber, delivered worldwide.',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          button2Text: 'View Lookbook',
          button2Link: '/lookbook',
          items: [
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
          ]
        }
      },
      {
        id: 'home-trust',
        type: 'features',
        title: 'Trust Bar',
        isVisible: true,
        content: {
          items: [
            { title: 'Worldwide Shipping', link: 'Direct to your door, anywhere in the world.', icon: 'Globe' },
            { title: 'Authentic Craftsmanship', link: 'Hand-woven detailing by master Nigerian artisans.', icon: 'Gem' },
            { title: 'Premium Fabrics', link: 'Guaranteed luxury cottons and bespoke silks.', icon: 'Layers' }
          ]
        }
      },
      {
        id: 'home-featured',
        type: 'features',
        title: 'Featured Collection',
        isVisible: true,
        content: {
          heading: 'Featured Collection',
          smallHeading: 'Curated Excellence',
          items: [
            { title: 'New Arrivals', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', link: '/shop/new' },
            { title: 'Best Sellers', image: 'https://images.unsplash.com/photo-1529139574466-a302d27f6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', link: '/shop/best-sellers' },
            { title: 'Accessories', image: 'https://images.unsplash.com/photo-1509319117193-51043f6556f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', link: '/shop/accessories' },
            { title: 'Limited Edition', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', link: '/shop/limited' }
          ]
        }
      },
      {
        id: 'home-story',
        type: 'split',
        title: 'Story Section',
        isVisible: true,
        content: {
          mediaItems: [
            {
              id: 1,
              type: 'image',
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeBhEn-EOzB9gmZQPNqkQVzZ-xNnW6TAb2s989SZBLmldrHJ2Al1OPQx7yVcUOyxWuimxTuX9zgTmQ25ZLSjZ_bYo29APMCNb84aAQ1jX_dFYTwZkWmZ9e42fFAfQgD_uftCqmQKpsLnacIpxyUUXikUv21Zu_1fl0J4hDsNRudMwZfbEX0SaervB1rT33TRCNbx-e_LMLIU_GyMcMr9ZH5dPT_lyXchylZneklp6Lt0ZyWoW2UkBSAYpRVKeRCg_RBE5quvdo6Ww',
              alt: 'Sustainable Materials'
            }
          ],
          smallHeading: 'Our Heritage',
          heading: 'Tradition Reimagined for the Modern World',
          text1: 'Founded in the heart of Lagos and refined for the global stage, Cynth Fabrics is more than a fashion label. We are a bridge between generations. Each piece we create is a love letter to Nigerian craftsmanship, utilizing techniques passed down through centuries to dress the visionaries of today.',
          text2: 'We source only the finest fabrics—from authentic Aso-Oke to premium Italian silks—ensuring that when you wear Cynth Fabrics, you carry the weight of tradition with the comfort of modern luxury.',
          linkText: 'Discover Our Process',
          linkUrl: '/about'
        }
      },
      {
        id: 'home-newsletter',
        type: 'cta',
        title: 'Newsletter',
        isVisible: true,
        content: {
          heading: 'Join the Heritage Circle',
          subheading: 'Subscribe to receive exclusive access to our private collection drops, style guides, and cultural stories.',
          buttonText: 'Join Now'
        }
      }
    ]
  },
  {
    id: 'story',
    name: 'Our Story',
    slug: '/story',
    sections: [
      {
        id: 'story-hero',
        type: 'hero',
        title: 'Hero Section',
        isVisible: true,
        content: {
          smallHeading: 'Established in the Heart of Lagos',
          heading: 'The Soul of Nigerian Craft',
          subheading: 'Honoring the master tailors who stitch our history into every garment, bridging the gap between ancestral heritage and the global diaspora.',
          backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdEpS500GCpu7k5CJkkqzugQ5o-nLBDfi4kWCrUDJPDAUBUNRoudD3BsaGIvCINmPwbZ4CNewkVCh7N-oY9NNVIgxxRKVlWags2dGh1-NUcoMMd6Gu10T_xY1zLKCiNJGrKWrP_tHCWq4VMn3aATINfdF03y_Q0zR74DY8Y3P4ooS6uSOH9LfFHY_0zm08NhAwCMrBdO5pOY_yTl22KAFGHEl0-WGZPzhtkoz_naQ_yezmPhOfic8vYeIuDjUC-X97yiEdLB7JU1E'
        }
      },
      {
        id: 'story-master-intro',
        type: 'split',
        title: 'Master Tailors Intro',
        isVisible: true,
        content: {
          smallHeading: 'Heritage & Innovation',
          heading: 'Master Tailors: The Keepers of Art',
          text1: "At Cynth Fabrics, we don't just source material; we preserve legacy. Our master tailors in Nigeria are artisans whose techniques have been passed down through centuries. Each stitch is a testament to the resilience and vibrancy of Nigerian culture.",
          text2: 'From the intricate hand-weaving of Aso Oke to the precision of modern couture silhouettes, we celebrate the hands that bring our vision to life. This is luxury defined by lineage.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNZq8uO4AjadlkM3P9OrlylVcPtGgBhzOAFFk6uaopmZ0ujREvl8vviU7Cjo4r44J5OYL18KFXJA3agJdcnBedPTw8WEM1S3PIWdBumqgL17f0pHyE7vFIP0US-rMmoL32eouNv5DSSgsnNYjKy1_-twBRFbhog1_IAPRNdKGwA1L3P-OZVISsDQUcu3olbp2HvHxgiMcH1jb90YxXbq23EO-WArMHg1HT4TYgpLJWVUjgkFDqJwh6jStVeJ63KfpEqKbkOYDowW0',
          cardTitle: 'Signature Quality',
          cardSubtitle: 'Gold-Threaded Excellence'
        }
      },
      {
        id: 'story-master-list',
        type: 'features',
        title: 'Master Tailors List',
        isVisible: true,
        content: {
          items: [
            { title: '01', link: 'Ancestral Weaving Techniques' },
            { title: '02', link: 'Master Tailor Collaboration' },
            { title: '03', link: 'Diaspora Identity Silhouettes' }
          ]
        }
      },
      {
        id: 'story-quote',
        type: 'quote',
        title: 'Founder Quote',
        isVisible: true,
        content: {
          text: '"We are not merely creating garments; we are stitching together the fragmented stories of home for a global generation. Cynth Fabrics is where heritage meets the horizon."',
          author: 'Cynthia Abiodun',
          role: 'Founder & Creative Director'
        }
      },
      {
        id: 'story-narrative',
        type: 'features',
        title: 'The Narrative',
        isVisible: true,
        content: {
          smallHeading: 'The Narrative',
          heading: 'The Diaspora Odyssey',
          sideText: 'Our journey mirrors your own. From the bustling energy of Lagos markets to the refined luxury of the world\'s fashion capitals.',
          items: [
            { title: 'Origins: Lagos', link: 'The heartbeat. Inspired by the master artisans of Balogun, where color and texture tell stories of royalty and pride.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdLwujNqyDuqlxstsaptVSnqMv48BPvPX1gcRvjy7_V03XwsnDZc1WOSsyYNWZRIK4m9JYkpGt-3VK4OzYu_KqSeaih-GivoKLFhRoyWDzOvEnzMQMESiyF2-k1U3guWn0sKq-syRD6cvJR-gTc5eV_1BaN0nCEpaa_SWZvw98wCnWq3IbK5dQlYLSCLeR2Gyh-EqDDHxIwRD-fXugFIgfgJzzQZ0wDfFX0FdJRmNFGr37aGgO60LvogzNT76NHs_glObA27NDGck' },
            { title: 'Craft: The Atelier', link: 'Where heritage is honed. Applying the rigor of high-fashion tailoring to traditional West African textiles.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHPt6j3zgrV7Vf4DYlTwSeWKA_ZELacoQkbZLtDyUhM_MSVLBNvwOtKHS3xZWNf5o0tVC8B4XmD30F1f_qCzbIr9nm3j7-w-zQXFQBEyXewLung33U2dsksz1t6glUAkfvVwYojhHTgSGy3nt0WklHtFlslesCJciOB-GXwszvuGHKpJZj4U4kUB6iUuZyvZTuMwTjj3F7pW8ZI6uawKYsoAv8saeEsgAckL1Nni3HP5e3QLIxQEqQ7NsaRv00pd0VlUenW8AaScE' },
            { title: 'Vision: Global Impact', link: 'Demanding a permanent seat for Nigerian excellence in the global luxury landscape.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNcM1UGVQ8dCijn9yEFMh3pOjvOedPf0Y4xcIlVs4PGfs370pokxR8W59c8En4p6tR208JqwIG8i3HTiJNQf4RWJ6L_pUxzQEqbXM5M6bp68T2WH_aD1Yi0ewez-FOXKsPN4tggnN5DALwgahsZAw3T0S9_oodrcVQDxaRkxFFyLES1qWHWzAJZzVDsAywrxHq87R8eVSxG0Cap4H4SaBb80VrLHtOpI4GTrrQdf54RkJvLlNt6N93YTlaTGx5HgkhqxgdRhx4a9I' }
          ]
        }
      },
      {
        id: 'story-guarantee',
        type: 'stats',
        title: 'The Guarantee',
        isVisible: true,
        content: {
          heading: 'The Cynth Guarantee',
          text1: 'True luxury is found in the details that honor the maker. We refuse to compromise on the dignity of our master tailors or the integrity of our ancestral fabrics.',
          text2: 'Every purchase supports the training of new apprentices in Lagos, ensuring the art of Nigerian tailoring thrives for generations to come.',
          buttonText: 'Experience the Craft',
          buttonLink: '/shop',
          stats: [
            { value: '100%', label: 'Artisanal Fibers' },
            { value: '36hr', label: 'Master Finishing' },
            { value: 'Gold', label: 'Standard Quality' },
            { value: 'Ethic', label: 'Fair Artisan Trade' }
          ]
        }
      },
      {
        id: 'story-global',
        type: 'split',
        title: 'Global Presence',
        isVisible: true,
        content: {
          heading: 'Global Presence',
          subheading: 'Lagos • London • New York',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmyyNW1NA1gMeAV9GvhCSsok2F8vDYPiAKDWg3bd4OpupjvKZaCGNGUUxn0Or495vaI4SZBFg79vqY8dr7LnZWRdg9Aw2m3jwK-EhyYY2YdsYxkNjSkeARcnFNEVaWZ0wBpppvSwNlBiwFtsgjejHo8_zEMvQXGnHu7H3PdkW-3jdxlgd-4otpkDh1jyD8jMcVGfU65tmWPg9_m3DZpuJAw7w5LR4C-TGQjrIbxGuLdo2JXHdoIf3UGxQZfJansJFSmxPZt0f3KJE',
          cardTitle: 'Lagos flagship Atelier',
          cardSubtitle: 'Victoria Island, Nigeria',
          linkText: 'Book a Consultation',
          linkUrl: '/contact'
        }
      }
    ]
  },
  {
    id: 'contact',
    name: 'Contact Us',
    slug: '/contact',
    sections: [
      {
        id: 'contact-intro',
        type: 'split',
        title: 'Intro Section',
        isVisible: true,
        content: {
          smallHeading: 'Connect with Oma',
          heading: 'Get in Touch',
          text1: 'Bridging heritage and contemporary luxury. Whether it\'s a sizing query or a custom commission, our artisans are here to assist you.',
          image: ''
        }
      },
      {
        id: 'contact-bespoke',
        type: 'cta',
        title: 'Bespoke Tailoring Card',
        isVisible: true,
        content: {
          heading: 'Bespoke Tailoring',
          subheading: 'Experience the ultimate in Nigerian craftsmanship. We offer worldwide virtual consultations for custom bridal and gala wear.',
          buttonText: 'Start a Commission',
          buttonLink: '/'
        }
      },
      {
        id: 'contact-details',
        type: 'features',
        title: 'Contact Details',
        isVisible: true,
        content: {
          items: [
            { title: 'WhatsApp', link: '+234 800 OMA HERITAGE' },
            { title: 'Email', link: 'concierge@omaheritage.com' },
            { title: 'Instagram', link: '@omaheritage_official' },
            { title: 'Studio', link: 'Lagos & London' }
          ]
        }
      }
    ]
  },
  {
    id: 'shop',
    name: 'Shop',
    slug: '/shop',
    sections: [
      {
        id: 'shop-quote',
        type: 'quote',
        title: 'Sidebar Quote',
        isVisible: true,
        content: {
          text: '"Crafting identity for the global Nigerian. Every stitch tells a story of heritage and prestige."'
        }
      }
    ]
  },
  {
    id: 'checkout',
    name: 'Checkout',
    slug: '/checkout',
    sections: [
      {
        id: 'checkout-hero',
        type: 'text',
        title: 'Hero Section',
        isVisible: true,
        content: {
          text: 'Luxury Nigerian Fashion — Finalize your bespoke custom order details below. Our artisans are ready to bring your vision to life.'
        }
      },
      {
        id: 'checkout-info',
        type: 'text',
        title: 'Confirmation Message',
        isVisible: true,
        content: {
          text: 'Our team will contact you via WhatsApp within 24 hours to confirm availability and payment details.'
        }
      }
    ]
  },
  {
    id: 'product-detail',
    name: 'Product Detail',
    slug: '/product/:id',
    sections: [
      {
        id: 'product-accordions',
        type: 'features',
        title: 'Info Accordions',
        isVisible: true,
        content: {
          items: [
            { title: 'Tailored Fit Guide', link: 'Link to guide or modal' },
            { title: 'Worldwide Shipping', link: 'Link to shipping policy' }
          ]
        }
      },
      {
        id: 'product-badges',
        type: 'features',
        title: 'Trust Badges',
        isVisible: true,
        content: {
          items: [
            { title: 'Authentic Wool', link: '' },
            { title: 'Hand Crafted', link: '' },
            { title: 'Free Returns', link: '' }
          ]
        }
      }
    ]
  },
  {
    id: 'global',
    name: 'Global Settings',
    slug: 'global',
    sections: [
      {
        id: 'global-header',
        type: 'features',
        title: 'Header Navigation',
        isVisible: true,
        content: {
          items: [
            { title: 'Collections', link: '/collections' },
            { title: 'Home', link: '/' },
            { title: 'Our Story', link: '/story' },
            { title: 'Contact', link: '/contact' }
          ]
        }
      },
      {
        id: 'global-footer',
        type: 'text',
        title: 'Footer Settings',
        isVisible: true,
        content: {
          text: 'Premium Nigerian native wears tailored for excellence. Crafted at home, worn across the world.',
          copyright: '© 2024 Cynth Fabrics. All rights reserved.'
        }
      }
    ]
  }
];

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const AdminContent = () => {
  const [pages, setPages] = useState<PageContent[]>(initialPages);
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPages[0].id);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'content', 'siteContent');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPages(docSnap.data().pages);
        } else {
          // Fallback to local storage if not in firestore yet
          const saved = localStorage.getItem('siteContent');
          if (saved) setPages(JSON.parse(saved));
        }
      } catch (error) {
        // Fallback to local storage if offline or permission denied
        const saved = localStorage.getItem('siteContent');
        if (saved) setPages(JSON.parse(saved));
      }
    };
    fetchContent();
  }, []);

  const selectedPage = pages.find(p => p.id === selectedPageId) || initialPages[0];

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Save Changes');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('Saving...');
    
    try {
      if (!auth.currentUser) {
        throw new Error('Not authenticated with database');
      }
      const docRef = doc(db, 'content', 'siteContent');
      await setDoc(docRef, { pages });
      localStorage.setItem('siteContent', JSON.stringify(pages)); // Keep local backup
      setIsSaving(false);
      setSaveMessage('Saved!');
    } catch (error: any) {
      console.error('Error saving content:', error);
      setIsSaving(false);
      setSaveMessage(error.message === 'Not authenticated with database' ? 'Login with Google to save' : 'Error saving');
    }
    
    // Reset message after 2 seconds
    setTimeout(() => {
      setSaveMessage('Save Changes');
    }, 2000);
  };

  const updateSectionContent = (sectionId: string, newContent: any) => {
    setPages(pages.map(page => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return { ...section, content: { ...section.content, ...newContent } };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };

  const renderInput = (label: string, value: string, key: string, sectionId: string, type: 'text' | 'textarea' = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          value={value || ''}
          onChange={(e) => updateSectionContent(sectionId, { [key]: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none h-24"
        />
      ) : (
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => updateSectionContent(sectionId, { [key]: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none"
        />
      )}
    </div>
  );

  const renderSectionEditor = (section: ContentSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            {renderInput('Small Heading', section.content.smallHeading, 'smallHeading', section.id)}
            {renderInput('Heading', section.content.heading, 'heading', section.id)}
            {renderInput('Subheading', section.content.subheading, 'subheading', section.id, 'textarea')}
            
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Button 1 Text', section.content.buttonText, 'buttonText', section.id)}
              {renderInput('Button 1 Link', section.content.buttonLink, 'buttonLink', section.id)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Button 2 Text', section.content.button2Text, 'button2Text', section.id)}
              {renderInput('Button 2 Link', section.content.button2Link, 'button2Link', section.id)}
            </div>

            {section.content.backgroundImage !== undefined && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={section.content.backgroundImage || ''}
                    onChange={(e) => updateSectionContent(section.id, { backgroundImage: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none"
                  />
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <Upload size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSaveMessage("Uploading...");
                          uploadFile(file).then((url) => {
                            updateSectionContent(section.id, { backgroundImage: url });
                            setSaveMessage("Uploaded!");
                            setTimeout(() => setSaveMessage('Save Changes'), 2000);
                          }).catch((err: any) => {
                            setSaveMessage(err.message || "Upload Failed");
                            setTimeout(() => setSaveMessage('Save Changes'), 3000);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {section.content.backgroundImage && (
                  <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    <img src={section.content.backgroundImage} alt="Preview" className="max-w-full max-h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {section.content.items !== undefined && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Carousel Media Items</h4>
              <div className="space-y-4">
                {section.content.items?.map((item: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                    <button 
                      onClick={() => {
                        const newItems = section.content.items.filter((_: any, i: number) => i !== index);
                        updateSectionContent(section.id, { items: newItems });
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const newItems = [...section.content.items];
                            newItems[index] = { ...item, type: e.target.value };
                            updateSectionContent(section.id, { items: newItems });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Source (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={item.src}
                            onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[index] = { ...item, src: e.target.value };
                              updateSectionContent(section.id, { items: newItems });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                            placeholder={item.type === 'video' ? "Video URL" : "Image URL"}
                          />
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center transition-colors" title="Upload from computer">
                            <Upload size={16} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept={item.type === 'video' ? "video/*" : "image/*"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Check size (limit to 50MB for video to avoid browser crash)
                                  if (file.size > 50 * 1024 * 1024) {
                                    setSaveMessage("File too large (>50MB)");
                                    setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                    return;
                                  }
                                  
                                  if (file.type.startsWith('image/')) {
                                    setSaveMessage("Uploading...");
                                    uploadFile(file).then((url) => {
                                      const newItems = [...section.content.items];
                                      newItems[index] = { ...item, src: url };
                                      updateSectionContent(section.id, { items: newItems });
                                      setSaveMessage("Uploaded!");
                                      setTimeout(() => setSaveMessage('Save Changes'), 2000);
                                    }).catch((err: any) => {
                                      setSaveMessage(err.message || "Upload Failed");
                                      setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                    });
                                  } else {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newItems = [...section.content.items];
                                      newItems[index] = { ...item, src: reader.result as string };
                                      updateSectionContent(section.id, { items: newItems });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        {item.type === 'video' && <p className="text-[10px] text-gray-400 mt-1">Supported formats: MP4, WebM. Max 50MB.</p>}
                      </div>

                      {item.type === 'video' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Poster Image (URL or Upload)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={item.poster}
                              onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[index] = { ...item, poster: e.target.value };
                                updateSectionContent(section.id, { items: newItems });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                              placeholder="Poster Image URL"
                            />
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center transition-colors" title="Upload poster">
                              <Upload size={16} />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSaveMessage("Uploading...");
                                    uploadFile(file).then((url) => {
                                      const newItems = [...section.content.items];
                                      newItems[index] = { ...item, poster: url };
                                      updateSectionContent(section.id, { items: newItems });
                                      setSaveMessage("Uploaded!");
                                      setTimeout(() => setSaveMessage('Save Changes'), 2000);
                                    }).catch((err: any) => {
                                      setSaveMessage(err.message || "Upload Failed");
                                      setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {item.type === 'image' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text</label>
                          <input 
                            type="text" 
                            value={item.alt}
                            onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[index] = { ...item, alt: e.target.value };
                              updateSectionContent(section.id, { items: newItems });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-3 h-32 bg-gray-200 rounded overflow-hidden">
                       {item.type === 'video' ? (
                         <video src={item.src} className="w-full h-full object-cover" muted />
                       ) : (
                         <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                       )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    const newItems = [...(section.content.items || []), { id: Date.now(), type: 'image', src: '' }];
                    updateSectionContent(section.id, { items: newItems });
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#f20c92] hover:text-[#f20c92] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Media Item
                </button>
              </div>
            </div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            {Object.keys(section.content).map((key) => {
              if (key === 'listItems' || key.toLowerCase().includes('image')) return null;
              const isTextArea = ['text', 'description', 'subheading', 'quote', 'message'].some(term => key.toLowerCase().includes(term));
              return renderInput(key.replace(/([A-Z])/g, ' $1').trim(), section.content[key], key, section.id, isTextArea ? 'textarea' : 'text');
            })}
            
            {Object.keys(section.content).filter(key => key.toLowerCase().includes('image')).map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={section.content[key]}
                    onChange={(e) => updateSectionContent(section.id, { [key]: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none"
                  />
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <Upload size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSaveMessage("Uploading...");
                          uploadFile(file).then((url) => {
                            updateSectionContent(section.id, { [key]: url });
                            setSaveMessage("Uploaded!");
                            setTimeout(() => setSaveMessage('Save Changes'), 2000);
                          }).catch((err: any) => {
                            setSaveMessage(err.message || "Upload Failed");
                            setTimeout(() => setSaveMessage('Save Changes'), 3000);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {section.content[key] && (
                  <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    <img src={section.content[key]} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'split':
        return (
          <div className="space-y-4">
             {renderInput('Small Heading', section.content.smallHeading, 'smallHeading', section.id)}
             {renderInput('Heading', section.content.heading, 'heading', section.id)}
             {renderInput('Subheading', section.content.subheading, 'subheading', section.id)}
             {renderInput('Text 1', section.content.text1, 'text1', section.id, 'textarea')}
             {renderInput('Text 2', section.content.text2, 'text2', section.id, 'textarea')}
             {renderInput('Link Text', section.content.linkText, 'linkText', section.id)}
             {renderInput('Link URL', section.content.linkUrl, 'linkUrl', section.id)}
             
             {section.content.mediaItems !== undefined ? (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Carousel Media Items</h4>
                <div className="space-y-4">
                  {section.content.mediaItems?.map((item: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                      <button 
                        onClick={() => {
                          const newItems = section.content.mediaItems.filter((_: any, i: number) => i !== index);
                          updateSectionContent(section.id, { mediaItems: newItems });
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newItems = [...section.content.mediaItems];
                              newItems[index] = { ...item, type: e.target.value };
                              updateSectionContent(section.id, { mediaItems: newItems });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Source (URL or Upload)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={item.src}
                              onChange={(e) => {
                                const newItems = [...section.content.mediaItems];
                                newItems[index] = { ...item, src: e.target.value };
                                updateSectionContent(section.id, { mediaItems: newItems });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                              placeholder={item.type === 'video' ? "Video URL" : "Image URL"}
                            />
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center transition-colors" title="Upload from computer">
                              <Upload size={16} />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept={item.type === 'video' ? "video/*" : "image/*"}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSaveMessage("Uploading...");
                                    try {
                                      const url = await uploadFile(file);
                                      const newItems = [...section.content.mediaItems];
                                      newItems[index] = { ...item, src: url };
                                      updateSectionContent(section.id, { mediaItems: newItems });
                                      setSaveMessage("Uploaded!");
                                      setTimeout(() => setSaveMessage('Save Changes'), 2000);
                                    } catch (err: any) {
                                      setSaveMessage(err.message || "Upload Failed");
                                      setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {item.type === 'video' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Poster Image (URL or Upload)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={item.poster || ''}
                                onChange={(e) => {
                                  const newItems = [...section.content.mediaItems];
                                  newItems[index] = { ...item, poster: e.target.value };
                                  updateSectionContent(section.id, { mediaItems: newItems });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                                placeholder="Poster Image URL"
                              />
                              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md border border-gray-300 flex items-center justify-center transition-colors" title="Upload poster">
                                <Upload size={16} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setSaveMessage("Uploading...");
                                      try {
                                        const url = await uploadFile(file);
                                        const newItems = [...section.content.mediaItems];
                                        newItems[index] = { ...item, poster: url };
                                        updateSectionContent(section.id, { mediaItems: newItems });
                                        setSaveMessage("Uploaded!");
                                        setTimeout(() => setSaveMessage('Save Changes'), 2000);
                                      } catch (err: any) {
                                        setSaveMessage(err.message || "Upload Failed");
                                        setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        {item.type === 'image' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text</label>
                            <input 
                              type="text" 
                              value={item.alt || ''}
                              onChange={(e) => {
                                const newItems = [...section.content.mediaItems];
                                newItems[index] = { ...item, alt: e.target.value };
                                updateSectionContent(section.id, { mediaItems: newItems });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Preview */}
                      <div className="mt-3 h-32 bg-gray-200 rounded overflow-hidden">
                        {item.type === 'image' && item.src ? (
                          <img src={item.src} alt="Preview" className="w-full h-full object-cover" />
                        ) : item.type === 'video' && item.src ? (
                          <video src={item.src} className="w-full h-full object-cover" muted />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No media
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    const newItems = [...(section.content.mediaItems || []), { id: Date.now(), type: 'image', src: '', alt: '' }];
                    updateSectionContent(section.id, { mediaItems: newItems });
                  }}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-[#f20c92] hover:text-[#d00a7d]"
                >
                  <Plus size={16} /> Add Media Item
                </button>
              </div>
             ) : (
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={section.content.image || ''}
                  onChange={(e) => updateSectionContent(section.id, { image: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none"
                />
                <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Upload size={20} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSaveMessage("Uploading...");
                        uploadFile(file).then((url) => {
                          updateSectionContent(section.id, { image: url });
                          setSaveMessage("Uploaded!");
                          setTimeout(() => setSaveMessage('Save Changes'), 2000);
                        }).catch((err: any) => {
                          setSaveMessage(err.message || "Upload Failed");
                          setTimeout(() => setSaveMessage('Save Changes'), 3000);
                        });
                      }
                    }}
                  />
                </label>
              </div>
              {section.content.image && (
                <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden">
                  <img src={section.content.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            )}

            {section.content.cardTitle && (
               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                 <h4 className="text-sm font-bold text-gray-900 mb-2">Floating Card</h4>
                 {renderInput('Card Title', section.content.cardTitle, 'cardTitle', section.id)}
                 {renderInput('Card Subtitle', section.content.cardSubtitle, 'cardSubtitle', section.id)}
               </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            {renderInput('Quote Text', section.content.text, 'text', section.id, 'textarea')}
            {renderInput('Author', section.content.author, 'author', section.id)}
            {renderInput('Role', section.content.role, 'role', section.id)}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            {renderInput('Heading', section.content.heading, 'heading', section.id)}
            {renderInput('Text 1', section.content.text1, 'text1', section.id, 'textarea')}
            {renderInput('Text 2', section.content.text2, 'text2', section.id, 'textarea')}
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Button Text', section.content.buttonText, 'buttonText', section.id)}
              {renderInput('Button Link', section.content.buttonLink, 'buttonLink', section.id)}
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium text-gray-900">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                {section.content.stats.map((stat: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <input 
                      type="text" 
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...section.content.stats];
                        newStats[index] = { ...stat, value: e.target.value };
                        updateSectionContent(section.id, { stats: newStats });
                      }}
                      className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                      placeholder="Value"
                    />
                    <input 
                      type="text" 
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...section.content.stats];
                        newStats[index] = { ...stat, label: e.target.value };
                        updateSectionContent(section.id, { stats: newStats });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="Label"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            {renderInput('Badge', section.content.badge, 'badge', section.id)}
            {renderInput('Heading', section.content.heading, 'heading', section.id)}
            {renderInput('Side Text', section.content.sideText, 'sideText', section.id, 'textarea')}

            {section.content.items.map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Item {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...section.content.items];
                        newItems[index] = { ...item, title: e.target.value };
                        updateSectionContent(section.id, { items: newItems });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#f20c92] outline-none"
                    />
                  </div>
                  {item.description !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea 
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...section.content.items];
                          newItems[index] = { ...item, description: e.target.value };
                          updateSectionContent(section.id, { items: newItems });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#f20c92] outline-none h-20"
                      />
                    </div>
                  )}
                  {item.image !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={item.image}
                          onChange={(e) => {
                            const newItems = [...section.content.items];
                            newItems[index] = { ...item, image: e.target.value };
                            updateSectionContent(section.id, { items: newItems });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#f20c92] outline-none"
                        />
                        <label className="cursor-pointer px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
                          <Upload size={16} />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSaveMessage("Uploading...");
                                uploadFile(file).then((url) => {
                                  const newItems = [...section.content.items];
                                  newItems[index] = { ...item, image: url };
                                  updateSectionContent(section.id, { items: newItems });
                                  setSaveMessage("Uploaded!");
                                  setTimeout(() => setSaveMessage('Save Changes'), 2000);
                                }).catch((err: any) => {
                                  setSaveMessage(err.message || "Upload Failed");
                                  setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                      {item.image && (
                        <div className="mt-2 relative h-24 w-full rounded-md overflow-hidden bg-gray-100">
                          <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                  {item.link !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
                      <input 
                        type="text" 
                        value={item.link}
                        onChange={(e) => {
                          const newItems = [...section.content.items];
                          newItems[index] = { ...item, link: e.target.value };
                          updateSectionContent(section.id, { items: newItems });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#f20c92] outline-none"
                      />
                    </div>
                  )}
                  {item.icon !== undefined && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Icon Name</label>
                      <input 
                        type="text" 
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...section.content.items];
                          newItems[index] = { ...item, icon: e.target.value };
                          updateSectionContent(section.id, { items: newItems });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#f20c92] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#f20c92] hover:text-[#f20c92] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} />
              Add Item
            </button>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {section.content.images?.map((img: string, index: number) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-32 object-cover rounded-lg" />
                  <button 
                    onClick={() => {
                      const newImages = section.content.images.filter((_: any, i: number) => i !== index);
                      updateSectionContent(section.id, { images: newImages });
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] hover:bg-[#f20c92]/5 transition-colors">
                <Plus size={24} />
                <span className="text-xs mt-1">Add Image</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSaveMessage("Uploading...");
                      uploadFile(file).then((url) => {
                        const newImages = [...(section.content.images || []), url];
                        updateSectionContent(section.id, { images: newImages });
                        setSaveMessage("Uploaded!");
                        setTimeout(() => setSaveMessage('Save Changes'), 2000);
                      }).catch((err: any) => {
                        setSaveMessage(err.message || "Upload Failed");
                        setTimeout(() => setSaveMessage('Save Changes'), 3000);
                      });
                    }
                  }}
                />
              </label>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            {renderInput('Heading', section.content.heading, 'heading', section.id)}
            {renderInput('Subheading', section.content.subheading, 'subheading', section.id, 'textarea')}
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Button Text', section.content.buttonText, 'buttonText', section.id)}
              {renderInput('Button Link', section.content.buttonLink, 'buttonLink', section.id)}
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500 italic">Editor for {section.type} not implemented yet.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#f20c92] selection:text-white">
      <AdminSidebar />
      
      <main className="md:ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif text-gray-900">Content Manager</h2>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
              {selectedPage.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Eye size={18} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2 bg-[#f20c92] text-white rounded-lg transition-all shadow-md shadow-[#f20c92]/20 ${
                isSaving ? 'opacity-80 cursor-wait' : 'hover:bg-[#f20c92]/90 hover:shadow-lg hover:shadow-[#f20c92]/30'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{saveMessage}</span>
            </button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Page Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pages</h3>
              <div className="space-y-1">
                {pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setSelectedPageId(page.id);
                      setActiveSectionId(null);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPageId === page.id 
                        ? 'bg-[#f20c92]/10 text-[#f20c92]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
              
              <button className="mt-4 w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-[#f20c92] transition-colors">
                <Plus size={16} />
                Add New Page
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{selectedPage.name}</h1>
                <p className="text-gray-500">Manage the sections and content for this page.</p>
              </div>

              <div className="space-y-6">
                {selectedPage.sections.map(section => (
                  <div 
                    key={section.id} 
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                      activeSectionId === section.id 
                        ? 'border-[#f20c92] shadow-lg ring-1 ring-[#f20c92]/20' 
                        : 'border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer bg-gray-50/50"
                      onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeSectionId === section.id ? 'bg-[#f20c92]/10 text-[#f20c92]' : 'bg-gray-100 text-gray-500'}`}>
                          {section.type === 'hero' && <ImageIcon size={18} />}
                          {section.type === 'text' && <Type size={18} />}
                          {section.type === 'features' && <Layout size={18} />}
                          {section.type === 'split' && <SplitSquareHorizontal size={18} />}
                          {section.type === 'quote' && <Quote size={18} />}
                          {section.type === 'stats' && <BarChart3 size={18} />}
                          {section.type === 'cta' && <LinkIcon size={18} />}
                        </div>
                        <span className="font-medium text-gray-900">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${section.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {section.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                        <ChevronRight size={18} className={`text-gray-400 transition-transform ${activeSectionId === section.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    
                    {activeSectionId === section.id && (
                      <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        {renderSectionEditor(section)}
                      </div>
                    )}
                  </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#f20c92] hover:text-[#f20c92] hover:bg-[#f20c92]/5 transition-all flex items-center justify-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#f20c92]/10 flex items-center justify-center transition-colors">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium">Add New Section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContent;
