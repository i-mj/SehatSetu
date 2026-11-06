/**
 * Nurse Care - Public Homepage
 * Highlights hero value proposition, service offerings, 3-step workflow,
 * approved customer reviews with photo/video media, and comprehensive FAQs.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { NursingServicesGrid } from '../../components/common/NursingServicesGrid';
import {
  HeartPulse,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronDown,
  Star,
  MessageCircle,
  ArrowRight,
  UserCheck,
  Stethoscope,
  HeartHandshake,
  Syringe,
  ShieldAlert,
  Play,
  FileCheck2,
  AlertOctagon,
  Image as ImageIcon,
  MapPin,
  Activity,
  Calendar,
  Send
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, services, reviews, serviceLocations, addEnquiry, addToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  // Homepage Quick Enquiry Form State
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqServiceId, setEnqServiceId] = useState(services[0]?.id || 'elderly-care');
  const [enqCityArea, setEnqCityArea] = useState('South Delhi');
  const [enqPreferredDate, setEnqPreferredDate] = useState('');
  const [enqMessage, setEnqMessage] = useState('');
  const [enqIsSubmitting, setEnqIsSubmitting] = useState(false);
  const [enqSubmittedId, setEnqSubmittedId] = useState<string | null>(null);
  const [enqError, setEnqError] = useState<string | null>(null);

  const handleHomeEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqName.trim()) {
      setEnqError('Please provide the patient or caregiver name.');
      return;
    }
    const cleanDigits = enqPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      setEnqError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setEnqError(null);
    setEnqIsSubmitting(true);

    setTimeout(() => {
      const newId = addEnquiry({
        fullName: enqName.trim(),
        phone: enqPhone.trim(),
        email: enqEmail.trim() || '',
        serviceId: enqServiceId || (services[0]?.id || 'elderly-care'),
        cityArea: enqCityArea.trim() || 'New Delhi',
        preferredDate: enqPreferredDate || '',
        message: enqMessage.trim() || 'Urgent home nurse inquiry submitted via homepage.',
        customFields: {}
      });

      setEnqSubmittedId(newId);
      setEnqIsSubmitting(false);
      addToast(
        'Enquiry Received',
        `Your care request #${newId} is registered. A clinical coordinator will call within 30 minutes.`,
        'success'
      );
    }, 450);
  };

  const resetHomeEnquiry = () => {
    setEnqName('');
    setEnqPhone('');
    setEnqEmail('');
    setEnqMessage('');
    setEnqPreferredDate('');
    setEnqSubmittedId(null);
  };

  // Filter ONLY APPROVED reviews for the home page
  const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');

  const cleanNumber = (settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hi, I need assistance booking a trained home nurse.')}`;

  const homeFaqs = [
    {
      q: 'How quickly can a nurse be assigned to our home?',
      a: 'For urgent short-term procedures (e.g. IV infusions, wound dressing), we coordinate certified nurse visits within 2 to 4 hours. For full-day or 24/7 care, we match an experienced nurse within 12 to 24 hours following clinical assessment.'
    },
    {
      q: 'Are all nurses verified and registered?',
      a: 'Yes. Every nurse on our roster possesses accredited diplomas (GNM or B.Sc Nursing) registered with the Nursing Council. We conduct rigorous 4-tier screening: government ID verification, background police checks, physical credential review, and practical skills evaluation.'
    },
    {
      q: 'Do you require a doctor’s prescription for nursing procedures?',
      a: 'Yes. For medical interventions like intravenous injections, surgical dressings, catheterizations, and medication dispensing, a valid doctor’s prescription is mandatory to ensure patient safety.'
    },
    {
      q: 'Can we interview or speak with the nurse prior to the assignment?',
      a: 'Certainly. Our clinical coordinators arrange a preparatory telephone introduction so family caregivers can discuss patient preferences, schedule details, and any specific dietary or physical guidelines.'
    },
    {
      q: 'What happens if our assigned nurse falls ill or is unavailable?',
      a: 'We maintain an active backup roster of licensed standby nurses to ensure uninterrupted continuity of care without disruptions to your patient schedule.'
    }
  ];

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-[#0f8672]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#0f8672]" />;
      case 'Syringe':
        return <Syringe className="w-6 h-6 text-[#0f8672]" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#0f8672]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-[#0f8672]" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#0f8672]" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#0f8672]" />;
      default:
        return <Clock className="w-6 h-6 text-[#0f8672]" />;
    }
  };

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Trained Nurses for Care at Home"
        description="Book certified and compassionate nurses for elderly care, post-surgery recovery, wound care, and IV infusions at home."
        ogTitle="Nurse Care — Trained Nurses for Compassionate Care at Home"
        ogDescription="Book council-accredited registered nurses for elderly care, post-surgical recovery, sterile dressings, and IV infusions at home."
        ogImage="/images/og-default.svg"
        ogImageAlt="Nurse Care — Trained Nurses for Care at Home"
        twitterCard="summary_large_image"
        twitterTitle="Nurse Care — Trained Nurses for Compassionate Care at Home"
        twitterDescription="Book council-accredited registered nurses for elderly care, post-surgical recovery, sterile dressings, and IV infusions at home."
        twitterImage="/images/og-default.svg"
        twitterImageAlt="Nurse Care — Trained Nurses for Care at Home"
        schema={homeFaqSchema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#effaf8]/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Hero Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#0f8672]" />
                <span>Certified Nursing Roster · Aseptic Protocols</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
                Trained nurses for care at home
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Hospital-grade clinical expertise delivered with family warmth. From elderly companionship and surgical wound recovery to timely IV infusions, our registered nurses ensure safe healing in familiar surroundings.
              </p>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/enquiry"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-[#0f8672] hover:bg-[#0e6b5c] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8672]"
                >
                  <span>Enquiry Now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-[#102d4b] hover:text-[#0f8672] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl text-slate-700">
                <div>
                  <div className="text-2xl font-bold text-[#0f8672]">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Council Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0f8672]">24/7</div>
                  <div className="text-xs text-slate-500 mt-0.5">Clinical Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0f8672]">4.9 / 5</div>
                  <div className="text-xs text-slate-500 mt-0.5">Patient Family Score</div>
                </div>
              </div>
            </div>

            {/* Right Col: Graphic Showcase / Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-teal-500/20 to-emerald-300/30 rounded-3xl blur-xl -z-10" />

                <div className="bg-white rounded-2xl border border-teal-100 shadow-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#effaf8] flex items-center justify-center text-[#0f8672]">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">Standard Clinical Intake</h2>
                        <p className="text-xs text-slate-500">Supervised by Head Nurse</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">
                      Verified
                    </span>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-3.5 text-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong>Physician Prescription Review:</strong> All medication & dosage cross-checked.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong>Sterile Single-Use Kits:</strong> Complete barrier asepsis at home bedside.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0f8672] shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong>Family Progress Updates:</strong> Daily vitals chart shared directly.
                      </span>
                    </div>
                  </div>

                  {/* Fast booking snippet */}
                  <div className="p-4 bg-[#effaf8] rounded-xl border border-teal-100/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0e6b5c] mb-1">
                      <span>Need care today?</span>
                      <span className="text-teal-700 font-bold">Fast-Track</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Direct consultation with our duty coordinator for urgent recovery support.
                    </p>
                    <Link
                      to="/enquiry"
                      className="block text-center py-2 px-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Book Nurse Visit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* HOMEPAGE DIRECT ENQUIRY FORM SECTION */}
      {/* ========================================================= */}
      <section className="py-16 bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/30 to-white border-y border-teal-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border-2 border-teal-200/90 shadow-xl p-6 sm:p-10 relative overflow-hidden">
            {/* Background decorative corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold">
                <Stethoscope className="w-3.5 h-3.5 text-[#0f8672]" />
                <span>Fast Home Nursing Intake</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Request a Certified Nurse for Your Home
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Submit this quick form to match with a council-verified nurse in your neighborhood. Our triage coordinator will contact you to confirm timings.
              </p>
            </div>

            {enqSubmittedId ? (
              <div className="p-8 bg-[#effaf8] border border-teal-200 rounded-2xl text-center space-y-4 max-w-lg mx-auto animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-full bg-[#0f8672] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    Patient Care Request Registered!
                  </h4>
                  <div className="inline-block px-3 py-1 bg-white border border-teal-300 rounded-lg text-xs font-mono font-bold text-teal-900">
                    Booking ID: #{enqSubmittedId}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Thank you, <strong>{enqName}</strong>. Our on-duty clinical coordinator has received your request and will call you within 30 minutes to review clinical prescriptions and assign a registered nurse.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetHomeEnquiry}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                  <Link
                    to="/enquiry"
                    className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    View Detailed Form
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleHomeEnquirySubmit} className="space-y-4 text-xs max-w-3xl mx-auto">
                {enqError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    <span>{enqError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Patient or Caregiver Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={enqName}
                      onChange={(e) => setEnqName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 text-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Contact Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98112 34567"
                      value={enqPhone}
                      onChange={(e) => setEnqPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Service Needed */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Service Required *
                    </label>
                    <select
                      value={enqServiceId}
                      onChange={(e) => setEnqServiceId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 text-xs font-medium"
                    >
                      {services
                        .filter((s) => s.isActive !== false)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Area / Location */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Locality / City Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vasant Vihar / DLF Phase 5"
                      value={enqCityArea}
                      onChange={(e) => setEnqCityArea(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 text-xs"
                    />
                  </div>

                  {/* Preferred Start Date */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={enqPreferredDate}
                      onChange={(e) => setEnqPreferredDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 text-xs"
                    />
                  </div>
                </div>

                {/* Medical Condition & Requirements */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                    Medical Condition & Specific Clinical Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe diagnosis, post-op instructions, required shift timings (12h/24h or procedure-based)..."
                    value={enqMessage}
                    onChange={(e) => setEnqMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 text-xs"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Council Registered</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Quick Dispatch</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No Advance Fees</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={enqIsSubmitting}
                    className="w-full sm:w-auto px-7 py-3 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-400 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {enqIsSubmitting ? (
                      <span>Registering enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enquiry Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>


      {/* Services Section - Styled to match exact reference image */}
      <NursingServicesGrid showLocationStrip={true} />

      {/* "How it Works" in 3 Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f8672] mb-2">
              Seamless Process
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              How Home Nursing Works in 3 Steps
            </h3>
            <p className="text-slate-600 text-sm mt-3">
              Simple, transparent booking designed to give your family comfort and reliability from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#effaf8]/50 border border-teal-100/80 rounded-2xl p-8 relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#0f8672] text-white flex items-center justify-center font-bold text-base shadow-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Submit Your Enquiry
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tell us about the patient’s condition, location, and preferred care routine through our simple online form or quick phone consultation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#effaf8]/50 border border-teal-100/80 rounded-2xl p-8 relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#0f8672] text-white flex items-center justify-center font-bold text-base shadow-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Clinical Match & Verification
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our care supervisor verifies the medical prescription, confirms the required clinical skill level, and matches a verified active nurse.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#effaf8]/50 border border-teal-100/80 rounded-2xl p-8 relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#0f8672] text-white flex items-center justify-center font-bold text-base shadow-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Certified Nurse at Home
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your designated nurse arrives punctually with clinical equipment, ready to provide gentle bedside care, daily logs, and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS SECTION (Approved reviews with text, photo, and video placeholders) */}
      <section className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f8672] mb-2">
                Real Patient Stories
              </h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                Customer Reviews
              </h3>
              <p className="text-slate-600 text-sm mt-2 max-w-xl">
                Read approved feedback from families across our service coverage areas.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/feedbacks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f8672] hover:text-[#0e6b5c] bg-[#effaf8] hover:bg-teal-100/70 px-4 py-2 rounded-xl transition-colors"
              >
                <span>Submit Your Feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {approvedReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No approved reviews yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      "{rev.message}"
                    </p>

                    {/* Media Placeholders (Photo / Video) */}
                    {rev.mediaType === 'photo' && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPhoto({
                              url: rev.photoUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
                              name: rev.reviewerName
                            })
                          }
                          className="w-full text-left group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-teal-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-lg bg-teal-100/80 flex items-center justify-center text-[#0f8672] shrink-0 overflow-hidden">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0f8672] flex items-center gap-1">
                              <span>Patient Care Photo</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                            <span className="text-[11px] text-slate-500 block">Click to view snapshot</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {rev.mediaType === 'video' && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedVideo(
                              rev.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'
                            )
                          }
                          className="w-full text-left group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-teal-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-lg bg-[#0f8672] text-white flex items-center justify-center shrink-0">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0f8672] flex items-center gap-1">
                              <span>Video Testimonial</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                            <span className="text-[11px] text-slate-500 block">Click to play video clip</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{rev.reviewerName}</div>
                      {rev.serviceName && (
                        <div className="text-slate-500 text-[11px] mt-0.5">{rev.serviceName}</div>
                      )}
                    </div>
                    <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] font-medium">
                      Verified Care
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal Placeholder */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h4 className="text-sm font-semibold">Video Testimonial Preview</h4>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>
            <div className="py-4">
              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video controls className="w-full h-full object-contain" autoPlay>
                  <source src={selectedVideo} type="video/mp4" />
                  Your browser does not support HTML video preview.
                </video>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Short patient family testimonial clip verified by Nurse Care clinical coordinators.
              </p>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-xs font-semibold rounded-lg text-white"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Photo Modal Placeholder */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900">
                Feedback Photo - {selectedPhoto.name}
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>
            <div className="py-4">
              <div className="rounded-xl overflow-hidden bg-[#effaf8] border border-teal-100 aspect-4/3 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 text-[#0f8672] flex items-center justify-center mb-3">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Verified Patient Bedside Care Documented
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Privacy-protected care log provided with consent by {selectedPhoto.name}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-full py-2 bg-[#0f8672] text-white hover:bg-[#0e6b5c] text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0f8672] mb-2">
              Common Inquiries
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to know about booking, nursing standards, and home procedures.
            </p>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-150"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    type="button"
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-teal-700"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0f8672]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#effaf8]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Medical Disclaimer Banner (Explicitly required on Home) */}
      <section className="py-12 bg-rose-50 border-y border-rose-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-rose-900 uppercase tracking-wide">
                Important Emergency Notice
              </h3>
              <p className="text-sm text-rose-800 mt-1 leading-relaxed">
                Nurse Care provides scheduled home nursing procedures and rehabilitation visits. <strong>Not an emergency service. In case of acute clinical emergencies, immediately call 112 or visit the nearest hospital emergency department.</strong>
              </p>
            </div>
            <a
              href="tel:112"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow whitespace-nowrap transition-colors"
            >
              Call 112 Now
            </a>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready to arrange certified care for your family?
          </h2>
          <p className="text-sm text-slate-600">
            Submit a fast enquiry or connect directly with our duty coordinator today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/enquiry"
              className="px-6 py-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              Enquiry Now
            </Link>
            <Link
              to="/contact-us"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
