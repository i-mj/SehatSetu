/**
 * Nurse Care - About Us Page
 * Details organization mission, clinical governance, nurse screening & credentialing,
 * and regional geographical service coverage.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  HeartPulse,
  ShieldCheck,
  Award,
  FileCheck,
  UserCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { settings } = useApp();
  const selectionSteps = [
    {
      step: '01',
      title: 'Council Registration & Degree Verification',
      description: 'Every candidate must produce valid registration numbers with the State Nursing Council along with authenticated transcripts from accredited B.Sc or GNM nursing colleges.'
    },
    {
      step: '02',
      title: 'Clinical Skill & Aseptic Demonstration',
      description: 'Nurses undergo practical simulation exams supervised by our Senior Nursing Superintendent, covering sterile wound dressing, IV cannulation, catheter care, and emergency response.'
    },
    {
      step: '03',
      title: 'Police Clearance & Identity Check',
      description: 'We perform complete criminal background checks, address verifications, and cross-reference government IDs (Aadhaar/Passport) to ensure absolute safety inside private family homes.'
    },
    {
      step: '04',
      title: 'Geriatric & Bedside Sensitivity Training',
      description: 'Approved nurses complete soft-skills coaching on patient dignity, gentle mobility support, dementia communication, and family caregiver updates.'
    }
  ];

  const coverageClusters = [
    {
      zone: 'Central & South Capital',
      neighborhoods: 'Greater Kailash, Vasant Vihar, Defence Colony, Hauz Khas, Saket, Chanakyapuri, Connaught Place',
      speed: '2 - 3 Hours Response'
    },
    {
      zone: 'Gurugram Tech & Residential Hubs',
      neighborhoods: 'DLF Phase 1-5, Cyber City, Golf Course Road, Sohna Road, Sector 56, Sushant Lok',
      speed: '2 - 4 Hours Response'
    },
    {
      zone: 'Noida & Greater Noida Expressways',
      neighborhoods: 'Sector 15, Sector 50, Sector 62, Sector 137, Expressway Towers, Pari Chowk corridors',
      speed: '3 - 4 Hours Response'
    },
    {
      zone: 'East & North Corridors',
      neighborhoods: 'Mayur Vihar, Preet Vihar, Rohini, Pitampura, Model Town, Civil Lines',
      speed: '3 - 5 Hours Response'
    }
  ];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nursecare.org';

  const aboutStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${origin}/about-us/#webpage`,
        url: `${origin}/about-us`,
        name: 'About Nurse Care - Clinical Care & Credentialing Standards',
        description: 'Learn how Nurse Care meticulously screens registered nurses with State Council degree verification, police checks, sterile simulation exams, and geographic dispatch.',
        mainEntity: {
          '@type': ['MedicalOrganization', 'HomeHealthCareService'],
          '@id': `${origin}/#organization`,
          name: settings.siteName,
          url: origin,
          logo: settings.logoUrl || `${origin}/images/og-default.svg`,
          telephone: settings.phone,
          email: settings.email,
          foundingDate: '2018',
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressCountry: 'IN'
          },
          medicalSpecialty: [
            'Geriatrics',
            'HomeNursing',
            'PostOperativeCare',
            'PalliativeCare'
          ],
          knowsAbout: [
            'Home Nursing Care',
            'Bedside Patient Attendant Assistance',
            'Geriatric Healthcare',
            'Post-Operative Wound Dressing',
            'Intravenous (IV) Infusion Monitoring',
            'Tracheostomy & Catheterization Care',
            'ICU At Home Setup'
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${origin}/about-us/#breadcrumbs`,
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
            name: 'About Us',
            item: `${origin}/about-us`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="About Us - Clinical Care & Credentialing"
        description="Learn how Nurse Care meticulously screens registered nurses with State Council degree verification, police checks, sterile simulation exams, and geographic dispatch."
        ogType="website"
        ogTitle="About Nurse Care — Accredited In-Home Nursing & Screening Standards"
        ogDescription="Learn how Nurse Care verifies State Nursing Council diplomas, conducts 4-tier clinical background checks, and dispatches compassionate nurses to homes across the capital."
        ogImage="/images/og-about.svg"
        ogImageAlt="Nurse Care Registered Nursing & Clinical Governance Standards"
        twitterCard="summary_large_image"
        twitterTitle="About Nurse Care — Accredited In-Home Nursing & Screening Standards"
        twitterDescription="Learn how Nurse Care verifies State Nursing Council diplomas, conducts 4-tier clinical background checks, and dispatches compassionate nurses to homes across the capital."
        twitterImage="/images/og-about.svg"
        twitterImageAlt="Nurse Care Registered Nursing & Clinical Governance Standards"
        schema={aboutStructuredData}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/30 to-white pt-7 pb-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold mb-4">
            <HeartPulse className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Our Healthcare Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Compassionate healing in the comfort of your home
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Nurse Care was founded by clinical practitioners and family caregivers who recognized that hospital discharge shouldn’t mean compromised medical standards or family anxiety.
          </p>
        </div>
      </section>

      {/* Section 1: Who We Are */}
      <section className="py-6 sm:py-7 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0f8672]">
                Who We Are
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Bridging hospital clinical precision with bedside warmth
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                When a family member undergoes surgery, manages a chronic illness, or reaches advanced age, home is the most restorative environment. However, administering complex prescriptions, IV fluids, and sterile wound dressings requires trained clinical hands.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We operate a carefully vetted roster of licensed nurses and trained patient attendants. Rather than an impersonal directory, our clinical coordinators remain actively involved in every case—verifying prescriptions, matching specific nursing competencies, and monitoring daily care notes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-[#0f8672]">100% Licensed</div>
                  <div className="text-xs text-slate-500 mt-1">State Nursing Council accredited nurses</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-[#0f8672]">Strict Asepsis</div>
                  <div className="text-xs text-slate-500 mt-1">Single-use sterile clinical consumables</div>
                </div>
              </div>
            </div>

            {/* Visual highlight box */}
            <div className="bg-[#effaf8]/60 border border-teal-100 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0f8672]" />
                <span>Our Core Operating Commitments</span>
              </h3>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Zero Compromise on Verification:</strong> No nurse is deployed without verified credentials, criminal background clearance, and registered council certification.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Prescription Adherence:</strong> Every injection, wound protocol, or medication is validated against an authorized physician’s discharge document.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Caregiver Transparency:</strong> Detailed vitals charts and daily progress notes are made available directly to patient families.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How Nurses Are Selected */}
      <section className="py-6 sm:py-7 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f8672]">
              Rigorous Onboarding
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              How Our Nurses Are Selected
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Only approximately 1 in 8 applicants meets our clinical benchmark. Here is our non-negotiable 4-tier selection process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectionSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="text-xs font-bold text-[#0f8672] uppercase tracking-wider mb-2">
                    Phase {step.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-[#0f8672] mr-1.5" />
                  <span>Mandatory Requirement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Areas Covered */}
      <section className="py-6 sm:py-7 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f8672]">
              Regional Presence
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Areas Covered Across the National Capital Region
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We maintain localized clusters of certified nurses stationed in designated zones to ensure rapid bedside arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {coverageClusters.map((cluster) => (
              <div
                key={cluster.zone}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-teal-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0f8672]" />
                    <h3 className="text-base font-bold text-slate-900">
                      {cluster.zone}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span>{cluster.speed}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  <strong className="text-slate-700">Covered Neighborhoods: </strong>
                  {cluster.neighborhoods}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              Living outside our standard coverage sectors? Call our coordinator desk at <strong className="text-slate-700">+91 98765 43210</strong> to check customized dedicated nurse assignments.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-7 bg-[#effaf8]/50 border-t border-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-7 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Need skilled nursing for a loved one today?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Share your patient’s details with our clinical desk, and we will match a qualified nurse within hours.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <span>Enquiry Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact-us"
              className="px-6 py-3 bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
