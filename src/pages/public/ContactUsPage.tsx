/**
 * Nurse Care - Contact Us Page
 * Direct communication channels: Clinical phone desk, verified email, physical address,
 * operating hours, instant WhatsApp chat, and interactive Contact Us submission form.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Headphones,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { settings, addContactMessage, addToast } = useApp();

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Clinical Query');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cleanNumber = (settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Nurse Care, I am contacting you for home nursing support.')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setFormError('Please provide at least an email address or mobile number so we can reach you.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError('Please describe your query in detail (minimum 10 characters).');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      addContactMessage({
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim()
      });

      addToast(
        'Message Sent',
        'Thank you! Your inquiry has been received. Our duty coordinator will get in touch shortly.',
        'success'
      );

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('General Clinical Query');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Contact Us - Clinical Support & Patient Intake"
        description="Get in touch with Nurse Care. Reach our on-duty patient coordinators by phone, official email, instant WhatsApp chat, or direct message form for immediate nurse dispatch."
        ogType="website"
        ogTitle="Contact Clinical Support Desk & Direct Intake — Nurse Care"
        ogDescription="Need clinical home healthcare support? Speak with our 24/7 on-duty clinical coordinators via phone, WhatsApp, email, or send an urgent direct message."
        ogImage="/images/og-contact.svg"
        ogImageAlt="Nurse Care 24/7 Clinical Support & Care Coordination Desk"
        twitterCard="summary_large_image"
        twitterTitle="Contact Clinical Support Desk & Direct Intake — Nurse Care"
        twitterDescription="Need clinical home healthcare support? Speak with our 24/7 on-duty clinical coordinators via phone, WhatsApp, email, or send an urgent direct message."
        twitterImage="/images/og-contact.svg"
        twitterImageAlt="Nurse Care 24/7 Clinical Support & Care Coordination Desk"
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/30 to-white pt-7 pb-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold mb-4">
            <Headphones className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Care Coordination Helpline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            We are here to support your family
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about clinical qualifications, emergency referrals, or setting up a nurse visit? Connect directly with our on-duty healthcare coordinators.
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="py-6 sm:py-7 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Phone */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-teal-200 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#effaf8] text-[#0f8672] flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Telephone Helpline
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Direct clinical intake & family consultations.
                </p>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-sm font-bold text-[#0f8672] hover:underline"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Mon - Sun: 07:00 AM - 10:00 PM
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-[#25D366]/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 fill-[#25D366] text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  WhatsApp Direct
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Instant messaging, prescription uploads & shift updates.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#20ba59] hover:underline"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Average reply time: &lt; 10 mins
              </div>
            </div>

            {/* Email */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-teal-200 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#effaf8] text-[#0f8672] flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Email Support
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Formal care reports, invoices, and feedback inquiries.
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xs font-bold text-[#0f8672] hover:underline break-all"
                >
                  {settings.email}
                </a>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Responses within 2 business hours
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-teal-200 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#effaf8] text-[#0f8672] flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Central Coordination Hub
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {settings.address}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f8672] hover:text-[#0e6b5c] hover:underline"
                  title="Open location in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Administrative desk visits by appointment
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* INTERACTIVE CONTACT US FORM SECTION */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Intro & Highlights */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0f8672] text-xs font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send a Direct Message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Leave us a message & we’ll respond shortly
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Whether you need general medical counsel, want to discuss long-term elder assistance, or have billing inquiries, our coordination team is on standby to help.
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0f8672] shrink-0 mt-0.5" />
                    <span>Clinical inquiries answered by licensed nursing coordinators.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0f8672] shrink-0 mt-0.5" />
                    <span>Average reply time under 2 business hours during operating shifts.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0f8672] shrink-0 mt-0.5" />
                    <span>Complete patient data privacy and confidentiality protected.</span>
                  </div>
                </div>

                <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-[#0e6b5c] block">Need an immediate home nurse assigned?</span>
                  <p className="text-slate-600">
                    Use our dedicated clinical intake form to select specific medical interventions and start dates.
                  </p>
                  <Link
                    to="/enquiry"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0f8672] hover:underline pt-1"
                  >
                    <span>Go to Patient Booking Form</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-7">
                {isSubmitted ? (
                  <div className="text-center py-7 space-y-4 animate-in fade-in duration-200">
                    <div className="w-14 h-14 rounded-full bg-[#0f8672] text-white flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        Thank You, {name}!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                        Your message has been safely delivered to our care coordination desk. One of our duty nurses will review your query and respond shortly.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {formError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                        Your Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Sengupta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus-visible:outline-teal-700 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. anand@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus-visible:outline-teal-700 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                          Mobile / Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98112 34567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus-visible:outline-teal-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                        Subject / Query Purpose
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus-visible:outline-teal-700 font-medium"
                      >
                        <option value="General Clinical Query">General Clinical Inquiry</option>
                        <option value="Home Nurse Rates & Schedules">Home Nurse Rates & Shifts</option>
                        <option value="Elderly Companionship Guidance">Elderly Companionship Guidance</option>
                        <option value="Post-Surgical Care Details">Post-Surgical Wound / Care Details</option>
                        <option value="Feedback or Service Support">Feedback or Service Support</option>
                        <option value="Nurse Career Inquiries">Nursing Career / Joining Roster</option>
                        <option value="Other">Other Topic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                        Message Details <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please describe how we can assist your family or patient..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus-visible:outline-teal-700 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-400 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message to Coordinators</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Quick Care Request Action Banner */}
          <div className="bg-gradient-to-r from-[#0f8672] to-[#0e6b5c] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Immediate Clinical Intake</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Prefer to submit an official patient care enquiry?
                </h2>
                <p className="text-teal-100 text-sm max-w-2xl leading-relaxed">
                  Fill out our structured patient care form with medical requirements, preferred timings, and location for immediate coordinator triage.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#0e6b5c] hover:bg-teal-50 font-bold text-sm rounded-xl shadow transition-colors"
                >
                  <span>Enquiry Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
