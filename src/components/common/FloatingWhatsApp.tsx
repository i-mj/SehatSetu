/**
 * Nurse Care - Floating WhatsApp Button
 * Persistent quick-connect button connecting to wa.me with current settings number.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useApp();

  // Strip spaces, dashes, or pluses from whatsapp number
  const cleanNumber = (settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent('Hello Nurse Care, I would like to enquire about home nursing services.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <div className="relative inline-flex items-center justify-center">
        {/* Subtle pulse ripple ring */}
        <span className="whatsapp-pulse-ripple" aria-hidden="true" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pulse-btn group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          aria-label="Chat with Nurse Care on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366] shrink-0" />
          <span className="hidden sm:inline text-sm font-semibold tracking-wide pr-1">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </aside>
  );
};
