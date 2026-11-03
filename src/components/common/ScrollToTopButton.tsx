/**
 * Nurse Care - Scroll to Top Button
 * Floats in the bottom right corner once user scrolls past the hero section (scrollY > 380px),
 * leaving the WhatsApp button on the bottom left corner.
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal button once scrolled past the hero section (~380px)
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check in case user loaded page with scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to top"
      className={`fixed bottom-22 right-6 z-30 w-10 h-10 rounded-full bg-[#079b9a] hover:bg-[#087e83] text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#079b9a] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.4]" />
    </button>
  );
};
