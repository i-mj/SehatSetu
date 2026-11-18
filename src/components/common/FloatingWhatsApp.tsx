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
      <div className="group/wa relative inline-flex items-center justify-center">
        {/* Hover / Focus Tooltip */}
        <div
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#102d4b] px-3.5 py-2 text-xs font-medium text-white shadow-lg opacity-0 translate-x-1.5 group-hover/wa:opacity-100 group-hover/wa:translate-x-0 group-focus-within/wa:opacity-100 group-focus-within/wa:translate-x-0 transition-all duration-150 hidden sm:flex items-center gap-2"
        >
          <span>Need a nurse? Chat with us on WhatsApp</span>
          <span
            aria-hidden="true"
            className="absolute left-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[6px] border-l-[#102d4b]"
          />
        </div>

        {/* Mobile Tooltip (above button when label text is hidden) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full mb-2.5 right-0 whitespace-nowrap rounded-lg bg-[#102d4b] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg opacity-0 translate-y-1 group-hover/wa:opacity-100 group-hover/wa:translate-y-0 group-focus-within/wa:opacity-100 group-focus-within/wa:translate-y-0 transition-all duration-150 sm:hidden"
        >
          Chat with care team
        </div>

        {/* Subtle pulse ripple ring */}
        <span className="whatsapp-pulse-ripple" aria-hidden="true" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pulse-btn relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
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
