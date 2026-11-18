/**
 * Nurse Care - Nursing Services Grid
 * Styled to match the exact design from the reference image:
 * - Eyebrow: "WHAT WE OFFER"
 * - Heading: "Our Nursing Services"
 * - Subtitle: "A wide range of professional care services, tailored to your needs."
 * - 4-Card Responsive Grid with pastel mint illustration block & clean typography card
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MapPin,
  X,
  CheckCircle2,
  Clock,
  HeartPulse,
  Activity,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

// ==========================================
// CUSTOM SVG ILLUSTRATIONS MATCHING REFERENCE
// ==========================================

export const HomeIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="46" y="15" width="7" height="15" rx="1.5" fill="#B4533C" />
    <path d="M44 15H55" stroke="#9A3D27" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 11L11 33H61L36 11Z" fill="#E65D3C" />
    <path d="M10 33L36 10L62 33" stroke="#C9492A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="18" y="32" width="36" height="26" fill="#F6D6AE" />
    <rect x="18" y="32" width="36" height="26" stroke="#E3B787" strokeWidth="1.5" />
    <rect x="30" y="41" width="12" height="17" rx="1" fill="#7D4627" />
    <circle cx="39" cy="50" r="1.3" fill="#F5C042" />
    <rect x="22" y="37" width="9" height="9" rx="1.5" fill="#74B9E7" />
    <line x1="26.5" y1="37" x2="26.5" y2="46" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="22" y1="41.5" x2="31" y2="41.5" stroke="#FFFFFF" strokeWidth="1.2" />
    <ellipse cx="36" cy="59" rx="26" ry="3.5" fill="#72C048" />
  </svg>
);

export const ElderlyIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="18" rx="10" ry="7" fill="#C5C9CE" />
    <ellipse cx="36" cy="30" rx="19" ry="17" fill="#B2B7BD" />
    <ellipse cx="36" cy="38" rx="14" ry="14" fill="#FFCF7D" />
    <path
      d="M22 30C26 24 34 23 36 26C38 23 46 24 50 30C46 26 38 24 36 27C34 24 26 26 22 30Z"
      fill="#C5C9CE"
    />
    <circle cx="30" cy="36" r="4.2" stroke="#4A5568" strokeWidth="1.8" fill="#E6F4FF" fillOpacity="0.35" />
    <circle cx="42" cy="36" r="4.2" stroke="#4A5568" strokeWidth="1.8" fill="#E6F4FF" fillOpacity="0.35" />
    <line x1="34.2" y1="36" x2="37.8" y2="36" stroke="#4A5568" strokeWidth="1.8" />
    <circle cx="30" cy="36" r="1.4" fill="#2D3748" />
    <circle cx="42" cy="36" r="1.4" fill="#2D3748" />
    <ellipse cx="26" cy="42" rx="2.4" ry="1.4" fill="#F87171" fillOpacity="0.45" />
    <ellipse cx="46" cy="42" rx="2.4" ry="1.4" fill="#F87171" fillOpacity="0.45" />
    <path d="M32 43.5C34 46 38 46 40 43.5" stroke="#8C461C" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M29 51C33 54 39 54 43 51" fill="#FFCF7D" />
    <path d="M24 54C28 51 36 51 48 54L52 62H20L24 54Z" fill="#38B2AC" />
  </svg>
);

export const StethoscopeIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="2.5" fill="#6B46C1" />
    <circle cx="44" cy="18" r="2.5" fill="#6B46C1" />
    <path
      d="M28 20V25C28 32 34 35 36 35C38 35 44 32 44 25V20"
      stroke="#94A3B8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    <circle cx="52" cy="38" r="6.8" fill="#0EA5E9" />
    <circle cx="52" cy="38" r="6.8" stroke="#0284C7" strokeWidth="1.5" />
    <circle cx="52" cy="38" r="3.2" fill="#E0F2FE" />
  </svg>
);

export const IcuClipboardIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="16" width="28" height="42" rx="4" fill="#938BA1" />
    <rect x="25" y="24" width="22" height="30" rx="2" fill="#FFFFFF" />
    <rect x="28" y="13" width="16" height="11" rx="2.5" fill="#F43F5E" />
    <path d="M36 15.5V20.5M33.5 18H38.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="28" y1="30" x2="43" y2="30" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="35" x2="40" y2="35" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="40" x2="42" y2="40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M28 47L31 47L33 44L35 50L37 46L39 47L43 47"
      stroke="#F43F5E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

export const NursingServicesGrid: React.FC<{
  showLocationStrip?: boolean;
  isServicePage?: boolean;
  layout?: 'grid' | 'horizontal';
}> = ({ showLocationStrip = true, isServicePage = false, layout = 'grid' }) => {
  const { services, serviceLocations } = useApp();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [openModalFaqIndex, setOpenModalFaqIndex] = useState<number | null>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenServiceSummary = (service: ServiceItem) => {
    setSelectedService(service);
    setOpenModalFaqIndex(0);
  };
  const [scrollState, setScrollState] = useState({
    canScrollPrev: false,
    canScrollNext: false,
    hasOverflow: false
  });

  const getIllustrationForService = (service: ServiceItem, index: number) => {
    const t = service.title.toLowerCase();
    const icon = (service.iconName || '').toLowerCase();

    if (icon === 'syringe' || t.includes('iv') || t.includes('injection') || t.includes('infusion')) {
      return <IvTherapyIllustration className="w-18 h-18 drop-shadow-xs" />;
    }
    if (icon === 'shieldalert' || t.includes('post-surg') || t.includes('surgery') || t.includes('wound') || t.includes('dressing')) {
      return <StethoscopeIllustration className="w-18 h-18 drop-shadow-xs" />;
    }
    if (icon === 'usercheck' || t.includes('attendant')) {
      return <IcuClipboardIllustration className="w-18 h-18 drop-shadow-xs" />;
    }
    if (icon === 'hearthandshake' || t.includes('elder') || t.includes('senior') || t.includes('geriatric')) {
      return <HomeIllustration className="w-18 h-18 drop-shadow-xs" />;
    }
    if (icon === 'clock' || t.includes('short') || t.includes('visit')) {
      return <WoundCareIllustration className="w-18 h-18 drop-shadow-xs" />;
    }
    if (icon === 'heartpulse' || t.includes('cardiac')) {
      return <HeartPulse className="w-14 h-14 text-[#079b9a]" />;
    }
    if (icon === 'activity' || t.includes('icu') || t.includes('critical')) {
      return <Activity className="w-14 h-14 text-[#079b9a]" />;
    }
    if (icon === 'stethoscope') {
      return <Stethoscope className="w-14 h-14 text-[#079b9a]" />;
    }

    const defaultList = [
      <HomeIllustration className="w-18 h-18 drop-shadow-xs" />,
      <StethoscopeIllustration className="w-18 h-18 drop-shadow-xs" />,
      <IvTherapyIllustration className="w-18 h-18 drop-shadow-xs" />,
      <IcuClipboardIllustration className="w-18 h-18 drop-shadow-xs" />,
      <ElderlyIllustration className="w-18 h-18 drop-shadow-xs" />
    ];
    return defaultList[index % defaultList.length];
  };

  const activeDbServices = useMemo(
    () => services.filter((s) => s.isActive !== false),
    [services]
  );

  const activeLocations = useMemo(
    () => serviceLocations.filter((l) => l.isActive !== false),
    [serviceLocations]
  );

  const routerLocation = useLocation();

  useEffect(() => {
    if (!isServicePage || !routerLocation.hash) return;
    const targetSlug = routerLocation.hash.replace('#', '');
    const matched = activeDbServices.find((s) => s.slug === targetSlug);
    if (matched) {
      handleOpenServiceSummary(matched);
    }
  }, [isServicePage, routerLocation.hash, activeDbServices]);

  const selectedServiceLocations = useMemo(() => {
    if (!selectedService) return [];
    if (selectedService.locations && selectedService.locations.length > 0) {
      return activeLocations.filter((l) => selectedService.locations?.includes(l.id));
    }
    return activeLocations;
  }, [selectedService, activeLocations]);

  const updateScrollIndicators = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || layout !== 'horizontal') {
      setScrollState({ canScrollPrev: false, canScrollNext: false, hasOverflow: false });
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    const hasOverflow = maxScroll > 4;
    const canScrollPrev = el.scrollLeft > 4;
    const canScrollNext = el.scrollLeft < maxScroll - 4;
    setScrollState({ canScrollPrev, canScrollNext, hasOverflow });
  }, [layout]);

  useEffect(() => {
    if (layout !== 'horizontal') return;
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollIndicators();

    const handleScroll = () => updateScrollIndicators();
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 4) return;
        const movingRight = e.deltaY > 0;
        const canMove = movingRight ? el.scrollLeft < maxScroll - 2 : el.scrollLeft > 2;
        if (canMove) {
          e.preventDefault();
          el.scrollBy({ left: e.deltaY, behavior: 'auto' });
        }
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', updateScrollIndicators);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollIndicators());
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateScrollIndicators);
      resizeObserver?.disconnect();
    };
  }, [layout, activeDbServices.length, updateScrollIndicators]);

  const handleScrollByStep = (direction: -1 | 1) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 300;
    const gapPx = window.innerWidth >= 640 ? 24 : 20;
    el.scrollBy({ left: direction * (cardWidth + gapPx), behavior: 'smooth' });
  };

  const renderServiceCard = (service: ServiceItem, idx: number, isHorizontal: boolean) => (
    <div
      key={service.id}
      className={`bg-white rounded-3xl border border-[#e3ebef] overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group ${
        isHorizontal
          ? 'flex-none snap-start w-[84%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]'
          : ''
      }`}
    >
      {/* Clickable Image + Text Region -> Opens Summary Modal */}
      <button
        type="button"
        onClick={() => handleOpenServiceSummary(service)}
        className="text-left w-full flex-1 flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-[#079b9a] focus-visible:outline-offset-[-2px]"
        aria-label={`View summary for ${service.title}`}
      >
        {/* Top Mint Illustration Block */}
        <div className="h-40 sm:h-44 w-full bg-[#e6f4f3] flex items-center justify-center p-5 relative overflow-hidden">
          <div className="transition-transform duration-300 group-hover:scale-105">
            {getIllustrationForService(service, idx)}
          </div>
          <span className="absolute bottom-2.5 right-3 text-[11px] font-semibold text-[#087e83] bg-white/90 px-2.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Quick Summary
          </span>
        </div>

        {/* Bottom Content Area */}
        <div className="p-5 pb-3 flex-1">
          <h3 className="font-bold text-[#102d4b] text-[17px] sm:text-[18px] leading-snug mb-1.5 group-hover:text-[#079b9a] transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-500 text-[13px] sm:text-[14px] leading-relaxed line-clamp-3">
            {service.shortDescription}
          </p>
        </div>
      </button>

      {/* Action Footer: Summary + Enquiry Now */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-slate-100/80 mt-2">
        <Link
          to={`/enquiry?service=${service.id}`}
          className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#079b9a] hover:text-[#087e83] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Enquiry Now</span>
          <span aria-hidden="true" className="text-base leading-none">→</span>
        </Link>

        <button
          type="button"
          onClick={() => handleOpenServiceSummary(service)}
          className="text-xs font-semibold text-slate-500 hover:text-[#102d4b] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          View Summary
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-6 sm:py-7 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
        {/* Header with optional Horizontal Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="text-left">
            <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#079b9a] mb-1.5 font-mono">
              WHAT WE OFFER
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-bold text-[#102d4b] tracking-tight leading-tight">
              Our Nursing Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
              A wide range of professional care services, tailored to your needs. Click any service card to view a quick summary.
            </p>
          </div>

          {layout === 'horizontal' && scrollState.hasOverflow && (
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap tabular-nums">
                {activeDbServices.length} Services · Scroll to explore
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScrollByStep(-1)}
                  disabled={!scrollState.canScrollPrev}
                  aria-label="Scroll services left"
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-[#102d4b] flex items-center justify-center shadow-2xs hover:border-[#079b9a] hover:text-[#079b9a] disabled:opacity-35 disabled:hover:border-slate-200 disabled:hover:text-[#102d4b] disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#079b9a]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollByStep(1)}
                  disabled={!scrollState.canScrollNext}
                  aria-label="Scroll services right"
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-[#102d4b] flex items-center justify-center shadow-2xs hover:border-[#079b9a] hover:text-[#079b9a] disabled:opacity-35 disabled:hover:border-slate-200 disabled:hover:text-[#102d4b] disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#079b9a]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Services Showcase: Single Scrollable Row (Home) or Multi-Row Grid (Services Page) */}
        {activeDbServices.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-sm text-slate-500">
            No active nursing services configured yet.
          </div>
        ) : layout === 'horizontal' ? (
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-1 pb-2 -mt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Nursing services list"
          >
            {activeDbServices.map((service, idx) => renderServiceCard(service, idx, true))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {activeDbServices.map((service, idx) => renderServiceCard(service, idx, false))}
          </div>
        )}

        {/* Location Coverage Strip */}
        {showLocationStrip && activeLocations.length > 0 && (
          <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#079b9a] shrink-0" />
              <span>
                Available across <strong>{activeLocations.length} operational zones</strong> including{' '}
                {activeLocations.slice(0, 4).map((l) => l.name).join(', ')}.
              </span>
            </div>

            {!isServicePage && (
              <Link
                to="/services#coverage-locations"
                className="text-[#079b9a] font-semibold hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span>Check your neighborhood availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* SERVICE SUMMARY MODAL */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-summary-title"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Modal Header */}
            <div className="px-6 py-4 bg-[#eaf7f7] border-b border-teal-100 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-teal-100 flex items-center justify-center shrink-0 p-1.5">
                  {getIllustrationForService(selectedService, 0)}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#087e83]">
                    Service Summary
                  </div>
                  <h3
                    id="service-summary-title"
                    className="text-lg sm:text-xl font-bold text-[#102d4b] truncate"
                  >
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white/70 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Close service summary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
              {selectedService.pricingNote && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100 text-[#0e6b5c] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#079b9a]" />
                  <span>{selectedService.pricingNote}</span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clinical Overview
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {selectedService.fullDescription || selectedService.shortDescription}
                </p>
              </div>

              {selectedService.bulletPoints && selectedService.bulletPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What Is Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.bulletPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#079b9a] shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedServiceLocations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#079b9a]" />
                    <span>Available Coverage Zones ({selectedServiceLocations.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServiceLocations.map((loc) => (
                      <Link
                        key={loc.id}
                        to={`/enquiry?service=${selectedService.id}&area=${encodeURIComponent(loc.name)}`}
                        onClick={() => setSelectedService(null)}
                        className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-[#079b9a] border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        {loc.name} · <span className="text-slate-400">{loc.responseEta}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.faqs && selectedService.faqs.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#079b9a]" />
                    <span>Frequently Asked Questions ({selectedService.faqs.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedService.faqs.map((faq, fIdx) => {
                      const isOpen = openModalFaqIndex === fIdx;
                      return (
                        <div
                          key={fIdx}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenModalFaqIndex(isOpen ? null : fIdx)}
                            aria-expanded={isOpen}
                            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-[#102d4b] leading-snug">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
                                isOpen ? 'rotate-180 text-[#079b9a]' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#effaf8]/40">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>All visits follow hospital-grade aseptic protocols with Nursing Council verified professionals.</span>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <Link
                to="/contact-us"
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <span>Ask a Coordinator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to={`/enquiry?service=${selectedService.id}`}
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#079b9a] hover:bg-[#087e83] text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span>Enquiry / Book This Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
