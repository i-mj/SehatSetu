/**
 * Nurse Care - Nursing Services Grid
 * Styled to match the exact design from the reference image:
 * - Eyebrow: "WHAT WE OFFER"
 * - Heading: "Our Nursing Services"
 * - Subtitle: "A wide range of professional care services, tailored to your needs."
 * - 4-Card Responsive Grid with pastel mint illustration block & clean typography card
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ==========================================
// CUSTOM SVG ILLUSTRATIONS MATCHING REFERENCE
// ==========================================

export const HomeIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Chimney */}
    <rect x="46" y="15" width="7" height="15" rx="1.5" fill="#B4533C" />
    <path d="M44 15H55" stroke="#9A3D27" strokeWidth="2" strokeLinecap="round" />
    {/* Roof */}
    <path d="M36 11L11 33H61L36 11Z" fill="#E65D3C" />
    <path d="M10 33L36 10L62 33" stroke="#C9492A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Wall */}
    <rect x="18" y="32" width="36" height="26" fill="#F6D6AE" />
    <rect x="18" y="32" width="36" height="26" stroke="#E3B787" strokeWidth="1.5" />
    {/* Door */}
    <rect x="30" y="41" width="12" height="17" rx="1" fill="#7D4627" />
    <circle cx="39" cy="50" r="1.3" fill="#F5C042" />
    {/* Window */}
    <rect x="22" y="37" width="9" height="9" rx="1.5" fill="#74B9E7" />
    <line x1="26.5" y1="37" x2="26.5" y2="46" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="22" y1="41.5" x2="31" y2="41.5" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Base grass shrub */}
    <ellipse cx="36" cy="59" rx="26" ry="3.5" fill="#72C048" />
  </svg>
);

export const ElderlyIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair Bun */}
    <ellipse cx="36" cy="18" rx="10" ry="7" fill="#C5C9CE" />
    {/* Hair Base */}
    <ellipse cx="36" cy="30" rx="19" ry="17" fill="#B2B7BD" />
    {/* Face */}
    <ellipse cx="36" cy="38" rx="14" ry="14" fill="#FFCF7D" />
    {/* Front Hair Waves */}
    <path
      d="M22 30C26 24 34 23 36 26C38 23 46 24 50 30C46 26 38 24 36 27C34 24 26 26 22 30Z"
      fill="#C5C9CE"
    />
    {/* Round Glasses */}
    <circle cx="30" cy="36" r="4.2" stroke="#4A5568" strokeWidth="1.8" fill="#E6F4FF" fillOpacity="0.35" />
    <circle cx="42" cy="36" r="4.2" stroke="#4A5568" strokeWidth="1.8" fill="#E6F4FF" fillOpacity="0.35" />
    <line x1="34.2" y1="36" x2="37.8" y2="36" stroke="#4A5568" strokeWidth="1.8" />
    {/* Eyes */}
    <circle cx="30" cy="36" r="1.4" fill="#2D3748" />
    <circle cx="42" cy="36" r="1.4" fill="#2D3748" />
    {/* Rosy Cheeks */}
    <ellipse cx="26" cy="42" rx="2.4" ry="1.4" fill="#F87171" fillOpacity="0.45" />
    <ellipse cx="46" cy="42" rx="2.4" ry="1.4" fill="#F87171" fillOpacity="0.45" />
    {/* Warm Smile */}
    <path d="M32 43.5C34 46 38 46 40 43.5" stroke="#8C461C" strokeWidth="1.8" strokeLinecap="round" />
    {/* Teal Collar */}
    <path d="M29 51C33 54 39 54 43 51" fill="#FFCF7D" />
    <path d="M24 54C28 51 36 51 48 54L52 62H20L24 54Z" fill="#38B2AC" />
  </svg>
);

export const StethoscopeIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Earpieces in purple */}
    <circle cx="28" cy="18" r="2.5" fill="#6B46C1" />
    <circle cx="44" cy="18" r="2.5" fill="#6B46C1" />
    {/* Metal arch */}
    <path
      d="M28 20V25C28 32 34 35 36 35C38 35 44 32 44 25V20"
      stroke="#94A3B8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Violet tubing loop */}
    <path
      d="M36 35V38C36 44 31 48 26 48C21 48 18 43 18 38C18 31 23 27 28 27"
      stroke="#6B46C1"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 48C34 48 42 45 42 38C42 33 46 32 49 34L50 35"
      stroke="#6B46C1"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Chestpiece in Cyan */}
    <circle cx="52" cy="38" r="6.8" fill="#0EA5E9" />
    <circle cx="52" cy="38" r="6.8" stroke="#0284C7" strokeWidth="1.5" />
    <circle cx="52" cy="38" r="3.2" fill="#E0F2FE" />
  </svg>
);

export const IcuClipboardIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Back folder / board */}
    <rect x="22" y="16" width="28" height="42" rx="4" fill="#938BA1" />
    {/* Medical Sheet */}
    <rect x="25" y="24" width="22" height="30" rx="2" fill="#FFFFFF" />
    {/* Clip Badge with Medical Cross in Pink */}
    <rect x="28" y="13" width="16" height="11" rx="2.5" fill="#F43F5E" />
    <path d="M36 15.5V20.5M33.5 18H38.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    {/* Prescription / Vital Lines */}
    <line x1="28" y1="30" x2="43" y2="30" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="35" x2="40" y2="35" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="40" x2="42" y2="40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    {/* ECG Pulse Indicator */}
    <path
      d="M28 47L31 47L33 44L35 50L37 46L39 47L43 47"
      stroke="#F43F5E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Fallback / Additional procedure icons
export const WoundCareIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="24" width="36" height="24" rx="4" fill="#FDE047" transform="rotate(-15 36 36)" />
    <rect x="18" y="24" width="36" height="24" rx="4" fill="#FCD34D" transform="rotate(15 36 36)" />
    <circle cx="36" cy="36" r="6" fill="#F43F5E" />
    <path d="M36 33V39M33 36H39" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IvTherapyIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="26" y="18" width="20" height="30" rx="6" fill="#67E8F9" fillOpacity="0.4" stroke="#0891B2" strokeWidth="2" />
    <rect x="31" y="14" width="10" height="4" rx="1" fill="#0891B2" />
    <path d="M36 48V56L42 58" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 32H38M28 36H34M28 40H37" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  illustration: React.ReactNode;
}

export const NursingServicesGrid: React.FC<{
  showLocationStrip?: boolean;
  isServicePage?: boolean;
}> = ({ showLocationStrip = true, isServicePage = false }) => {
  const { services, serviceLocations } = useApp();

  // Reference services matching the 4 cards in the user's screenshot
  const referenceCards: ServiceCardItem[] = [
    {
      id: 'srv-1',
      title: 'Home Nursing Care',
      description: 'Compassionate nursing assistance and everyday clinical care at home.',
      slug: 'home-nursing-care',
      illustration: <HomeIllustration className="w-18 h-18 drop-shadow-xs" />
    },
    {
      id: 'srv-2',
      title: 'Elderly Care',
      description: 'Thoughtful support for senior citizens and daily living needs.',
      slug: 'elderly-care',
      illustration: <ElderlyIllustration className="w-18 h-18 drop-shadow-xs" />
    },
    {
      id: 'srv-3',
      title: 'Post-Surgery Care',
      description: 'Recovery support, wound care and help after hospital discharge.',
      slug: 'post-surgery-care',
      illustration: <StethoscopeIllustration className="w-18 h-18 drop-shadow-xs" />
    },
    {
      id: 'srv-4',
      title: 'ICU Trained Nursing',
      description: 'Specialised nursing support for complex care requirements.',
      slug: 'icu-trained-nursing',
      illustration: <IcuClipboardIllustration className="w-18 h-18 drop-shadow-xs" />
    }
  ];

  // Helper to map DB services to high-fidelity illustrations
  const getIllustrationForService = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes('home') || t.includes('general')) return <HomeIllustration className="w-18 h-18 drop-shadow-xs" />;
    if (t.includes('elder') || t.includes('senior') || t.includes('geriatric')) return <ElderlyIllustration className="w-18 h-18 drop-shadow-xs" />;
    if (t.includes('post-surg') || t.includes('surgery') || t.includes('wound') || t.includes('dressing')) return <StethoscopeIllustration className="w-18 h-18 drop-shadow-xs" />;
    if (t.includes('icu') || t.includes('critical') || t.includes('tracheo')) return <IcuClipboardIllustration className="w-18 h-18 drop-shadow-xs" />;
    if (t.includes('iv') || t.includes('injection') || t.includes('infusion')) return <IvTherapyIllustration className="w-18 h-18 drop-shadow-xs" />;
    if (t.includes('wound') || t.includes('suture')) return <WoundCareIllustration className="w-18 h-18 drop-shadow-xs" />;

    // fallback rotation
    const defaultList = [
      <HomeIllustration className="w-18 h-18 drop-shadow-xs" />,
      <ElderlyIllustration className="w-18 h-18 drop-shadow-xs" />,
      <StethoscopeIllustration className="w-18 h-18 drop-shadow-xs" />,
      <IcuClipboardIllustration className="w-18 h-18 drop-shadow-xs" />
    ];
    return defaultList[index % defaultList.length];
  };

  // Combine database services or fallback cleanly to the exact reference
  const activeDbServices = services.filter((s) => s.isActive !== false);

  const displayCards: ServiceCardItem[] =
    activeDbServices.length >= 4
      ? activeDbServices.map((service, idx) => ({
          id: service.id,
          title: service.title,
          description: service.shortDescription,
          slug: service.slug,
          illustration: getIllustrationForService(service.title, idx)
        }))
      : referenceCards;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* EXACT HEADER LAYOUT FROM ATTACHED REFERENCE IMAGE        */}
        {/* ======================================================== */}
        <div className="text-left mb-10 sm:mb-12">
          {/* Eyebrow */}
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#079b9a] mb-2 font-mono">
            WHAT WE OFFER
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#102d4b] tracking-tight leading-tight">
            Our Nursing Services
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            A wide range of professional care services, tailored to your needs.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 4 CARDS GRID (EXACT LAYOUT & PROPORTIONS AS ATTACHED)    */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayCards.slice(0, 4).map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-[#e3ebef] overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top Mint Illustration Block */}
                <div className="h-44 sm:h-48 bg-[#e6f4f3] rounded-t-3xl flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-[1.02]">
                  {card.illustration}
                </div>

                {/* Bottom Content Area */}
                <div className="p-6 pb-4">
                  <h3 className="font-bold text-[#102d4b] text-[18px] sm:text-[19px] leading-snug mb-2 group-hover:text-[#079b9a] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-[13px] sm:text-[14px] leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Action Link: Enquire now → */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/enquiry?service=${card.id}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#079b9a] hover:text-[#087e83] group-hover:translate-x-1 transition-all duration-150 cursor-pointer"
                >
                  <span>Enquiry Now</span>
                  <span aria-hidden="true" className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Location Coverage Strip if locations exist */}
        {showLocationStrip && serviceLocations.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#079b9a] shrink-0" />
              <span>
                Available across <strong>{serviceLocations.filter((l) => l.isActive !== false).length} operational zones</strong> including South Delhi, West Delhi, Gurgaon, and Noida.
              </span>
            </div>

            <Link
              to="/services#coverage-locations"
              className="text-[#079b9a] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Check your neighborhood availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
