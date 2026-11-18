/**
 * Nurse Care - Public Website Footer
 * Contains clinical contact details, service pathways, legal links, and emergency disclaimer.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HeartPulse, Phone, Mail, MapPin, AlertOctagon, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, services } = useApp();

  return (
    <footer className="bg-[#102d4b] text-[#d7e3e9] pt-7 pb-6 border-t border-[#1e4b68]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
        {/* Emergency Disclaimer Banner - Prominent & Mandatory */}
        <div className="mb-7 bg-rose-950/60 border border-rose-800/80 rounded-2xl p-5 md:p-6 shadow-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-rose-900/60 text-rose-300 rounded-xl shrink-0">
              <AlertOctagon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-base font-bold text-rose-200 tracking-wide uppercase">
                Emergency Medical Disclaimer
              </h2>
              <p className="text-xs sm:text-sm text-rose-300/90 mt-1 leading-relaxed">
                <strong className="text-white">Nurse Care is NOT an emergency response service.</strong> If the patient is facing acute chest pain, severe breathing difficulty, sudden paralysis, loss of consciousness, or profuse bleeding, please immediately call <strong className="text-white underline decoration-rose-400 underline-offset-2">112</strong> or transport them to the nearest hospital casualty emergency ward.
              </p>
            </div>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-sm whitespace-nowrap transition-colors"
            >
              Emergency Call 112
            </a>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-6 border-b border-[#1e4b68]">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-[37px] h-[37px] rounded-[12px] bg-[#eaf7f7] flex items-center justify-center text-[#079b9a] font-bold">
                <HeartPulse className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {settings.siteName}
              </span>
            </div>
            <p className="text-sm text-[#b8cbd6] leading-relaxed max-w-sm">
              Compassionate, certified healthcare right at home. We connect recovering patients and elderly family members with certified, background-checked nursing practitioners for dignified home recovery.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Heart className="w-3.5 h-3.5 fill-teal-400" />
                Verified Clinical Roster
              </span>
              <span>·</span>
              <span>Strict Aseptic Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/feedbacks" className="text-slate-400 hover:text-white transition-colors">
                  Customer Feedbacks
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                  Enquiry Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Quick Nav */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Care Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((srv) => (
                <li key={srv.id}>
                  <Link
                    to={`/services#${srv.slug}`}
                    className="text-slate-400 hover:text-white transition-colors text-xs leading-relaxed block"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Support Desk
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                  title="View on Google Maps"
                >
                  {settings.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p>
              © {new Date().getFullYear()} {settings.siteName}. All rights reserved. Prototype demonstration.
            </p>
            {/* Discreet index link of admin panel (invisible on public preview, visible on intentional hover/focus) */}
            <Link
              to="/admin"
              className="text-slate-900 select-none opacity-0 hover:opacity-100 focus:opacity-100 hover:text-teal-400 focus:text-teal-300 transition-opacity text-[11px] p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
              title="Admin Console Index"
              aria-label="Admin Console Index Portal"
            >
              [Admin Index]
            </Link>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <Link to="/patient-charter" className="hover:text-teal-400 transition-colors">
              Patient Charter
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/sitemap" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
