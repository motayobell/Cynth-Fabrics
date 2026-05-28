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
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
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
  if (file.size > 500 * 1024 * 1024) {
    throw new Error(`File ${file.name} is too large. Please select a file under 500MB.`);
  }
  
  let fileToUpload: File | Blob = file;
  
  // High-resolution image compression bypass. We upload the original high-quality raw file as configured to the server storage.

  const formData = new FormData();
  formData.append('media', fileToUpload);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If not JSON, it might be an HTML error from nginx/server
        const text = await response.text();
        if (text.includes('413 Request Entity Too Large')) {
          errorMessage = 'File is too large for the server configuration (Nginx limit).';
        } else {
          errorMessage = `Server error (${response.status}): ${text.substring(0, 100)}...`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error.message || "Failed to upload file");
  }
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

import { api } from '../services/api';

const AdminContent = () => {
  const [pages, setPages] = useState<PageContent[]>(initialPages);
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPages[0].id);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getContent('siteContent');
        if (data && data.pages && data.pages.length > 0) {
          setPages(data.pages);
        } else {
          // Fallback to local storage if not in database yet
          const saved = localStorage.getItem('siteContent');
          if (saved) {
            setPages(JSON.parse(saved));
          } else {
            setPages(initialPages);
          }
        }
      } catch (error) {
        // Fallback to local storage if offline or error
        const saved = localStorage.getItem('siteContent');
        if (saved) {
          setPages(JSON.parse(saved));
        } else {
          setPages(initialPages);
        }
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
      let pagesJson = JSON.stringify(pages);
      const finalPages = JSON.parse(pagesJson);

      try {
        await api.updateContent('siteContent', { pages: finalPages });
      } catch (error) {
        console.error('Error saving to SQL:', error);
        throw error;
      }
      localStorage.setItem('siteContent', pagesJson); // Keep local backup
      setPages(finalPages);
      setIsSaving(false);
      setSaveMessage('Saved!');
    } catch (error: any) {
      console.error('Error saving content:', error);
      setIsSaving(false);
      let errorMessage = error.message || 'Error saving';
      setSaveMessage(errorMessage);
    }
    
    // Reset message after 3 seconds
    setTimeout(() => {
      setSaveMessage('Save Changes');
    }, 3000);
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

  const handleAddPage = () => {
    const name = window.prompt("Enter page name:");
    if (!name || !name.trim()) return;
    const slug = window.prompt("Enter page URL route slug (e.g. /custom-page):", `/${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`);
    if (!slug || !slug.trim()) return;

    const newPage: PageContent = {
      id: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      slug: slug.trim(),
      sections: []
    };

    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
    setActiveSectionId(null);
  };

  const handleRenamePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    const newName = window.prompt("Rename page name:", page.name);
    if (!newName || !newName.trim()) return;
    setPages(pages.map(p => p.id === pageId ? { ...p, name: newName.trim() } : p));
  };

  const handleDeletePage = (pageId: string) => {
    const remainPages = pages.filter(p => p.id !== pageId);
    setPages(remainPages);
    if (selectedPageId === pageId) {
      setSelectedPageId(remainPages[0].id);
      setActiveSectionId(null);
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setPages(pages.map(page => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return { ...section, isVisible: !section.isVisible };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };

  const deleteSection = (sectionId: string) => {
    setPages(pages.map(page => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          sections: page.sections.filter(section => section.id !== sectionId)
        };
      }
      return page;
    }));
    if (activeSectionId === sectionId) {
      setActiveSectionId(null);
    }
  };

  const handleAddSection = () => {
    const type = window.prompt("Enter section type ('hero', 'features', 'text', 'gallery', 'cta', 'split', 'quote', 'stats'):", 'text');
    if (!type) return;
    const normalizedType = type.trim().toLowerCase() as SectionType;
    const validTypes: SectionType[] = ['hero', 'features', 'text', 'gallery', 'cta', 'split', 'quote', 'stats'];
    if (!validTypes.includes(normalizedType)) {
      alert(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      return;
    }
    const title = window.prompt("Enter section title:", `New ${normalizedType.toUpperCase()} Section`);
    if (!title || !title.trim()) return;

    let defaultContent: any = {};
    if (normalizedType === 'text') defaultContent = { text: 'New text section' };
    else if (normalizedType === 'hero') defaultContent = { smallHeading: 'New season', heading: 'Headline title', subheading: 'Subheading text', buttonText: 'Shop', buttonLink: '/shop', items: [] };
    else if (normalizedType === 'features') defaultContent = { items: [{ title: 'New Feature', link: '', description: '' }] };
    else if (normalizedType === 'gallery') defaultContent = { images: [] };
    else if (normalizedType === 'cta') defaultContent = { heading: 'Call to Action', subheading: 'Action description', buttonText: 'Button', buttonLink: '/' };
    else if (normalizedType === 'split') defaultContent = { smallHeading: 'Split Section', heading: 'Split title', text1: 'Sample text 1', text2: 'Sample text 2', mediaItems: [] };
    else if (normalizedType === 'quote') defaultContent = { text: 'Quote text', author: 'Author', role: 'Role' };
    else if (normalizedType === 'stats') defaultContent = { heading: 'Stats heading', text1: 'Text 1', text2: 'Text 2', stats: [{ value: '100%', label: 'Label' }] };

    const newSection: ContentSection = {
      id: `${selectedPageId}-${normalizedType}-${Date.now()}`,
      type: normalizedType,
      title: title.trim(),
      isVisible: true,
      content: defaultContent
    };

    setPages(pages.map(page => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          sections: [...page.sections, newSection]
        };
      }
      return page;
    }));
    setActiveSectionId(newSection.id);
  };

  const renderInput = (label: string, value: string, key: string, sectionId: string, type: 'text' | 'textarea' = 'text') => (
    <div className="mb-4">
      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          value={value || ''}
          onChange={(e) => updateSectionContent(sectionId, { [key]: e.target.value })}
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none h-24 text-sm"
        />
      ) : (
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => updateSectionContent(sectionId, { [key]: e.target.value })}
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f20c92] focus:border-transparent outline-none text-sm"
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Background Image URL</label>
                  {section.content.backgroundImage && (
                    <button
                      type="button"
                      onClick={() => updateSectionContent(section.id, { backgroundImage: '' })}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 size={12} /> Clear Background
                    </button>
                  )}
                </div>
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
                <h4 className="font-medium text-gray-900 mb-4 animate-fade-in">Carousel Media Items</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.content.items?.map((item: any, index: number) => (
                    <div key={item.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative flex flex-col justify-between shadow-sm">
                      <button 
                        type="button"
                        onClick={() => {
                          const newItems = section.content.items.filter((_: any, i: number) => i !== index);
                          updateSectionContent(section.id, { items: newItems });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow transition-all z-10 active:scale-90"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="space-y-3 flex-1">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                          <select
                            value={item.type || 'image'}
                            onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[index] = { ...item, type: e.target.value };
                              updateSectionContent(section.id, { items: newItems });
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs outline-none bg-white font-medium"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Source (URL or Upload)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={item.src}
                              onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[index] = { ...item, src: e.target.value };
                                updateSectionContent(section.id, { items: newItems });
                              }}
                              className="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-md text-[11px] font-mono outline-none bg-white focus:border-[#f20c92]"
                              placeholder={item.type === 'video' ? "Video URL" : "Image URL"}
                            />
                            <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 flex items-center justify-center transition-colors flex-shrink-0" title="Upload from computer">
                              <Upload size={14} />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept={item.type === 'video' ? "video/*" : "image/*"}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 500 * 1024 * 1024) {
                                      setSaveMessage("File too large (>500MB)");
                                      setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                      return;
                                    }
                                    
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
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {item.type === 'video' && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Poster Image (URL or Upload)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={item.poster || ''}
                                onChange={(e) => {
                                  const newItems = [...section.content.items];
                                  newItems[index] = { ...item, poster: e.target.value };
                                  updateSectionContent(section.id, { items: newItems });
                                }}
                                className="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-md text-[11px] font-mono outline-none bg-white focus:border-[#f20c92]"
                                placeholder="Poster Image URL"
                              />
                              <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 flex items-center justify-center transition-colors flex-shrink-0" title="Upload poster">
                                <Upload size={14} />
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

                        {item.type !== 'video' && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Text</label>
                            <input 
                              type="text" 
                              value={item.alt || ''}
                              onChange={(e) => {
                                const newItems = [...section.content.items];
                                newItems[index] = { ...item, alt: e.target.value };
                                updateSectionContent(section.id, { items: newItems });
                              }}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs outline-none bg-white"
                              placeholder="Decorative alternative text"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Preview Box */}
                      <div className="mt-4 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200/60 relative flex-shrink-0 flex items-center justify-center">
                        {item.src ? (
                          item.type === 'video' ? (
                            <div className="relative w-full h-full">
                              <video src={item.src} className="w-full h-full object-cover" muted controls />
                              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase font-mono">Video</span>
                            </div>
                          ) : (
                            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="text-gray-400 text-[11px] font-medium italic">No media preview</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Big Add Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      const newItems = [...(section.content.items || []), { id: Date.now(), type: 'image', src: '', alt: '' }];
                      updateSectionContent(section.id, { items: newItems });
                    }}
                    className="h-full min-h-[220px] py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] hover:bg-[#f20c92]/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer duration-200 hover:shadow-sm"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Add Media Item</span>
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
              if (key === 'listItems' || key.toLowerCase().includes('image') || key.toLowerCase().includes('video')) return null;
              const isTextArea = ['text', 'description', 'subheading', 'quote', 'message'].some(term => key.toLowerCase().includes(term));
              return renderInput(key.replace(/([A-Z])/g, ' $1').trim(), section.content[key], key, section.id, isTextArea ? 'textarea' : 'text');
            })}
            
            {Object.keys(section.content).filter(key => key.toLowerCase().includes('image') || key.toLowerCase().includes('video')).map(key => {
              const value = section.content[key];
              const isValueVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('video') || value.includes('coverr.co'));
              return (
                <div key={key} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {value && (
                      <button 
                        type="button"
                        onClick={() => updateSectionContent(section.id, { [key]: '' })}
                        className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1 font-bold bg-white px-2 py-1 rounded shadow-sm border border-red-100 active:scale-95 transition-all"
                      >
                        <Trash2 size={11} /> Clear Media
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={value || ''}
                      onChange={(e) => updateSectionContent(section.id, { [key]: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-[#f20c92] outline-none text-xs font-mono"
                      placeholder="Image or Video URL"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0" title="Upload media">
                      <Upload size={14} />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 500 * 1024 * 1024) {
                              setSaveMessage("File too large (>500MB)");
                              setTimeout(() => setSaveMessage('Save Changes'), 3000);
                              return;
                            }
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

                  {value && (
                    <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-inner">
                      {isValueVideo ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <video src={value} className="max-w-full max-h-full object-contain" muted controls />
                          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase font-mono">Video</span>
                        </div>
                      ) : (
                        <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
             
             {/* Media Items Carousel */}
             <div className="mt-6 border-t pt-6">
               <h4 className="font-medium text-gray-900 mb-4">Carousel Media Items</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {(section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : [])).map((item: any, index: number) => (
                   <div key={item.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative flex flex-col justify-between shadow-sm">
                     <button 
                       onClick={() => {
                         const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                         const newItems = currentItems.filter((_: any, i: number) => i !== index);
                         updateSectionContent(section.id, { mediaItems: newItems, image: null });
                       }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow transition-all z-10 active:scale-95"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                              const newItems = [...currentItems];
                              newItems[index] = { ...item, type: e.target.value };
                              updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                                const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                                const newItems = [...currentItems];
                                newItems[index] = { ...item, src: e.target.value };
                                updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                                      const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                                      const newItems = [...currentItems];
                                      newItems[index] = { ...item, src: url };
                                      updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                                  const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                                  const newItems = [...currentItems];
                                  newItems[index] = { ...item, poster: e.target.value };
                                  updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                                        const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                                        const newItems = [...currentItems];
                                        newItems[index] = { ...item, poster: url };
                                        updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                                const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                                const newItems = [...currentItems];
                                newItems[index] = { ...item, alt: e.target.value };
                                updateSectionContent(section.id, { mediaItems: newItems, image: null });
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
                    const currentItems = section.content.mediaItems || (section.content.image ? [{ id: 1, type: 'image', src: section.content.image, alt: 'Image' }] : []);
                    const newItems = [...currentItems, { id: Date.now(), type: 'image', src: '', alt: '' }];
                    updateSectionContent(section.id, { mediaItems: newItems, image: null });
                  }}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-[#f20c92] hover:text-[#d00a7d]"
                >
                  <Plus size={16} /> Add Media Item
                </button>
              </div>

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
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-gray-900">Item {index + 1}</h4>
                  <button 
                    onClick={() => {
                      const newItems = section.content.items.filter((_: any, i: number) => i !== index);
                      updateSectionContent(section.id, { items: newItems });
                    }}
                    className="p-1 hover:text-red-500 rounded text-gray-400 hover:bg-red-50 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Media Type</label>
                        <select
                          value={item.mediaType || 'image'}
                          onChange={(e) => {
                            const newItems = [...section.content.items];
                            newItems[index] = { ...item, mediaType: e.target.value };
                            updateSectionContent(section.id, { items: newItems });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs outline-none bg-white font-medium"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-gray-500">Media Source (URL or Upload)</label>
                          {item.image && (
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...section.content.items];
                                newItems[index] = { ...item, image: '' };
                                updateSectionContent(section.id, { items: newItems });
                              }}
                              className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-red-100 shadow-sm active:scale-95 transition-all"
                            >
                              <Trash2 size={10} /> Clear Media
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={item.image}
                            onChange={(e) => {
                              const newItems = [...section.content.items];
                              newItems[index] = { ...item, image: e.target.value };
                              updateSectionContent(section.id, { items: newItems });
                            }}
                            className="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-md text-[11px] font-mono outline-none bg-white focus:border-[#f20c92]"
                            placeholder={item.mediaType === 'video' ? "Video URL" : "Image URL"}
                          />
                          <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 flex items-center justify-center transition-colors flex-shrink-0" title="Upload media">
                            <Upload size={14} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept={item.mediaType === 'video' ? "video/*" : "image/*"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 500 * 1024 * 1024) {
                                    setSaveMessage("File too large (>500MB)");
                                    setTimeout(() => setSaveMessage('Save Changes'), 3000);
                                    return;
                                  }
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
                      </div>

                      {item.image && (
                        <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200/60 relative flex items-center justify-center">
                          {item.mediaType === 'video' ? (
                            <div className="relative w-full h-full">
                              <video src={item.image} className="w-full h-full object-cover" muted controls />
                              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase font-mono">Video</span>
                            </div>
                          ) : (
                            <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                          )}
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
            <button 
              onClick={() => {
                const draftItem: any = { title: 'New Item' };
                if (section.content.items?.[0]) {
                  const sample = section.content.items[0];
                  if (sample.description !== undefined) draftItem.description = '';
                  if (sample.image !== undefined) draftItem.image = '';
                  if (sample.link !== undefined) draftItem.link = '';
                  if (sample.icon !== undefined) draftItem.icon = '';
                } else {
                  draftItem.description = '';
                  draftItem.link = '';
                }
                const newItems = [...(section.content.items || []), draftItem];
                updateSectionContent(section.id, { items: newItems });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#f20c92] hover:text-[#f20c92] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.content.images?.map((img: string, index: number) => {
                if (!img) return null;
                const isVideo = img.endsWith('.mp4') || img.endsWith('.webm') || img.endsWith('.mov') || img.includes('video') || img.includes('cdn.coverr.co');
                return (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    {isVideo ? (
                      <div className="relative w-full h-32 bg-black">
                        <video src={img} className="w-full h-full object-cover" muted />
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase font-mono">Video</span>
                      </div>
                    ) : (
                      <img src={img} alt={`Gallery ${index}`} className="w-full h-32 object-cover" />
                    )}
                    
                    {/* Delete button always responsive/visible or on hover */}
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = section.content.images.filter((_: any, i: number) => i !== index);
                        updateSectionContent(section.id, { images: newImages });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full shadow-md text-gray-500 hover:text-red-500 transition-all active:scale-95 hover:bg-red-50"
                      title="Delete media"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              
              <label className="cursor-pointer h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] hover:bg-[#f20c92]/5 transition-all duration-250">
                <Plus size={24} />
                <span className="text-xs font-bold uppercase tracking-wider mt-1.5">Add Media</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 500 * 1024 * 1024) {
                        setSaveMessage("File too large (>500MB)");
                        setTimeout(() => setSaveMessage('Save Changes'), 3000);
                        return;
                      }
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
      
      <main className="md:ml-64 min-h-screen bg-gray-50 flex flex-col pt-16 md:pt-0">
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-16 md:top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <h2 className="text-lg md:text-xl font-serif text-gray-900 truncate">Content Manager</h2>
            <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 rounded-full text-[10px] md:text-xs font-medium text-gray-500 truncate">
              {selectedPage.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button className="flex items-center gap-2 px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
              <Eye size={18} />
              <span className="hidden lg:inline">Preview</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 bg-[#f20c92] text-white rounded-lg transition-all shadow-md shadow-[#f20c92]/20 text-sm active:scale-95 ${
                isSaving ? 'opacity-80 cursor-wait' : 'hover:bg-[#f20c92]/90 hover:shadow-lg hover:shadow-[#f20c92]/30'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span className="hidden sm:inline">{saveMessage}</span>
              <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Page Sidebar - Horizontal on mobile, vertical on desktop */}
          <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 overflow-x-auto md:overflow-y-auto scrollbar-hide">
            <div className="p-3 md:p-4 flex md:flex-col gap-2 md:gap-1">
              <h3 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pages</h3>
              {pages.map(page => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between w-full rounded-lg text-xs md:text-sm font-medium transition-colors group relative ${
                    selectedPageId === page.id 
                      ? 'bg-[#f20c92]/10 text-[#f20c92]' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedPageId(page.id);
                      setActiveSectionId(null);
                    }}
                    className="flex-1 text-left px-4 py-2 truncate"
                  >
                    {page.name}
                  </button>
                  <div className="flex items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenamePage(page.id);
                      }}
                      className="p-1 hover:text-[#f20c92] hover:bg-white/50 rounded transition-colors"
                      title="Rename Page"
                    >
                      <Type size={14} />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete the "${page.name}" page?`)) {
                            handleDeletePage(page.id);
                          }
                        }}
                        className="p-1 hover:text-red-500 hover:bg-white/50 rounded transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddPage}
                className="whitespace-nowrap md:whitespace-normal mt-0 md:mt-4 flex items-center gap-2 px-4 py-2 text-xs md:text-sm text-gray-500 hover:text-[#f20c92] transition-colors flex-shrink-0 md:flex-shrink"
              >
                <Plus size={16} />
                <span className="hidden md:inline">Add New Page</span>
                <span className="md:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-1 md:mb-2">{selectedPage.name}</h1>
                <p className="text-gray-500 text-xs md:text-sm">Manage the sections and content for this page.</p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {selectedPage.sections.map(section => (
                  <div 
                    key={section.id} 
                    className={`bg-white border rounded-lg md:rounded-xl overflow-hidden transition-all duration-200 ${
                      activeSectionId === section.id 
                        ? 'border-[#f20c92] shadow-lg ring-1 ring-[#f20c92]/20' 
                        : 'border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    <div 
                      className="p-3 md:p-4 flex items-center justify-between cursor-pointer bg-gray-50/50"
                      onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
                    >
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${activeSectionId === section.id ? 'bg-[#f20c92]/10 text-[#f20c92]' : 'bg-gray-100 text-gray-500'}`}>
                          {section.type === 'hero' && <ImageIcon size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'text' && <Type size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'features' && <Layout size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'split' && <SplitSquareHorizontal size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'quote' && <Quote size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'stats' && <BarChart3 size={16} className="md:w-[18px] md:h-[18px]" />}
                          {section.type === 'cta' && <LinkIcon size={16} className="md:w-[18px] md:h-[18px]" />}
                        </div>
                        <span className="font-medium text-gray-900 text-sm md:text-base truncate">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSectionVisibility(section.id)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                            section.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="Toggle Visibility"
                        >
                          {section.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this section?")) {
                              deleteSection(section.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          title="Delete Section"
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight 
                          size={16} 
                          className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] cursor-pointer ${activeSectionId === section.id ? 'rotate-90' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSectionId(activeSectionId === section.id ? null : section.id);
                          }}
                        />
                      </div>
                    </div>
                    
                    {activeSectionId === section.id && (
                      <div className="p-4 md:p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        {renderSectionEditor(section)}
                      </div>
                    )}
                  </div>
                ))}

                <button 
                  onClick={handleAddSection}
                  className="w-full py-3 md:py-4 border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl text-gray-500 hover:border-[#f20c92] hover:text-[#f20c92] hover:bg-[#f20c92]/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 group-hover:bg-[#f20c92]/10 flex items-center justify-center transition-colors">
                    <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="font-medium text-sm md:text-base">Add New Section</span>
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
