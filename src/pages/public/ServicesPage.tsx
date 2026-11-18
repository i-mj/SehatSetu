/**
 * Nurse Care - Services Catalog Page
 * Detailed clinical outlines for Elderly Care, Post-Surgery Wound Care, Injections/IV,
 * Attendant Care, and Short-Term Nursing Visits with individual FAQs and
 * interactive Service Coverage & Availability by Location.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { NursingServicesGrid } from '../../components/common/NursingServicesGrid';
import {
  CheckCircle2,
  ArrowRight,
  FileText,
  MapPin,
  Search,
  Clock3,
  ShieldCheck
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { settings, services, serviceLocations } = useApp();
  const location = useLocation();

  // Coverage search state
  const [searchAreaQuery, setSearchAreaQuery] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Active locations only
  const activeLocations = useMemo(
    () => serviceLocations.filter((l) => l.isActive !== false),
    [serviceLocations]
  );

  // Filter services if active flag exists
  const activeServices = useMemo(
    () => services.filter((s) => s.isActive !== false),
    [services]
  );

  // Handle hash scrolling on page mount or hash change
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Search match logic for coverage checker
  const matchedLocation = useMemo(() => {
    if (!searchAreaQuery.trim()) return null;
    const q = searchAreaQuery.toLowerCase().trim();
    return activeLocations.find(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.popularAreas.some((area) => area.toLowerCase().includes(q))
    );
  }, [searchAreaQuery, activeLocations]);

  const allServiceFaqs = activeServices.flatMap((s) => s.faqs || []);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nursecare.org';

  const servicesStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'HomeHealthCareService'],
        '@id': `${origin}/#organization`,
        name: settings.siteName,
        url: `${origin}/services`,
        telephone: settings.phone,
        email: settings.email,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'IN'
        },
        areaServed: activeLocations.map((loc) => ({
          '@type': 'City',
          name: `${loc.name}, ${loc.city}`
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Home Nursing Care & Clinical Procedures Catalog',
          itemListElement: activeServices.map((service, index) => ({
            '@type': 'Offer',
            position: index + 1,
            name: service.title,
            itemOffered: {
              '@type': 'MedicalService',
              name: service.title,
              description: service.shortDescription || service.fullDescription,
              provider: {
                '@type': 'MedicalBusiness',
                name: settings.siteName,
                telephone: settings.phone
              }
            },
            price: service.pricingNote || '₹₹',
            priceCurrency: 'INR'
          }))
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}/services/#faq`,
        mainEntity: allServiceFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${origin}/services/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: `${origin}/services`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Home Nursing Services & Clinical Procedures"
        description="Comprehensive in-home healthcare services: Elderly care, post-surgical wound dressings, IV therapy, patient attendant support, and short-term nursing visits with full regional coverage."
        ogType="website"
        ogTitle="Specialized Home Nursing Services & Procedures — Nurse Care"
        ogDescription="Explore accredited in-home nursing services: 12h/24h elderly care, post-surgical aseptic wound care, IV therapy, catheterization, and bedside attendants."
        ogImage="/images/og-services.svg"
        ogImageAlt="Nurse Care Specialized Clinical Services Catalog"
        twitterCard="summary_large_image"
        twitterTitle="Specialized Home Nursing Services & Procedures — Nurse Care"
        twitterDescription="Explore accredited in-home nursing services: 12h/24h elderly care, post-surgical aseptic wound care, IV therapy, catheterization, and bedside attendants."
        twitterImage="/images/og-services.svg"
        twitterImageAlt="Nurse Care Specialized Clinical Services Catalog"
        schema={servicesStructuredData}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/20 to-white pt-7 pb-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Clinical Care Portfolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Specialized home nursing services
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Delivering registered hospital competencies directly to your residence with sterile hygiene, clinical discipline, and family warmth.
          </p>

          {/* Quick Anchor Navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#coverage-locations"
              className="px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0f8672]" />
              <span>Available Locations</span>
            </a>
          </div>
        </div>
      </section>

      {/* Primary Services Grid - Styled as requested from reference image */}
      <NursingServicesGrid showLocationStrip={false} isServicePage={true} />

      {/* LOCATIONS WHERE WE ARE AVAILABLE (Interactive Coverage Section) */}
      <section id="coverage-locations" className="scroll-mt-24 py-6 sm:py-7 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0f8672]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Regional Availability & Coverage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Where our home nurses are available
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Registered nurses and attendants are strategically positioned across {activeLocations.length} major zones for rapid bedside dispatch.
              </p>
            </div>

            {/* Live Search Locality Checker */}
            <div className="w-full md:w-96 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Check Availability in Your Locality:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAreaQuery}
                  onChange={(e) => setSearchAreaQuery(e.target.value)}
                  placeholder="e.g. Vasant Vihar, DLF Phase 2, Sector 62..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus-visible:outline-teal-700 shadow-2xs"
                />
                {searchAreaQuery && (
                  <button
                    onClick={() => setSearchAreaQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Instant Match Status */}
              {searchAreaQuery.trim() && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                    matchedLocation
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {matchedLocation ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Available in {matchedLocation.name}!</strong> Dispatch {matchedLocation.responseEta}.
                        </span>
                      </div>
                      <Link
                        to={`/enquiry?area=${encodeURIComponent(searchAreaQuery)}`}
                        className="px-2.5 py-1 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors"
                      >
                        Book Now
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span>We may still arrange custom clinical dispatch to "{searchAreaQuery}".</span>
                      <Link
                        to="/enquiry"
                        className="text-[#0f8672] underline font-semibold text-[11px] shrink-0"
                      >
                        Inquire
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeLocations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocationId(isSelected ? null : loc.id)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0f8672] ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200/90 hover:border-teal-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-[#0f8672]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                            {loc.name}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {loc.city}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-[#0f8672] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 shrink-0">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 my-2">
                      <Clock3 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{loc.responseEta}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Prominent Localities:
                      </span>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {loc.popularAreas.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(loc.name + ', ' + loc.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0f8672] transition-colors font-medium"
                      title={`View ${loc.name} on Google Maps`}
                    >
                      <MapPin className="w-3 h-3 text-[#0f8672]" />
                      <span>View on Map</span>
                    </a>
                    <Link
                      to={`/enquiry?area=${encodeURIComponent(loc.name)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#0f8672] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Book in {loc.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0f8672]" />
              <span>Hospital-grade asepsis and clinical standards maintained across all locations.</span>
            </span>
            <Link
              to="/enquiry"
              className="text-[#0f8672] font-semibold hover:underline"
            >
              Request Nursing Dispatch in Your Area →
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Care Note */}
      <section className="py-7 bg-[#effaf8]/60 border-t border-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-7 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Need a customized multi-disciplinary care regimen?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Our supervisory head nurse can design combined shifts incorporating both registered clinical nurse visits and daytime patient attendant support across all active coverage locations.
          </p>
          <div className="pt-2">
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow transition-colors whitespace-nowrap shrink-0"
            >
              <span>Enquiry Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
