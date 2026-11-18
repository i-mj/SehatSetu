/**
 * Nurse Care - Primary Public Navigation Header
 * Features brand wordmark, clean text navigation, Enquire Now action, and mobile menu.
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HeartPulse, Menu, X, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, isAdminLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Services', path: '/services' },
    { label: 'Feedbacks', path: '/feedbacks' },
    { label: 'Contact Us', path: '/contact-us' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e3ebef] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
        <div className="flex items-center justify-between h-[76px]">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[#079b9a] rounded-lg p-1 group"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={`${settings.siteName} Logo`}
                referrerPolicy="no-referrer"
                className="h-10 w-auto object-contain rounded"
              />
            ) : (
              <div className="w-[37px] h-[37px] rounded-[12px] bg-[#eaf7f7] flex items-center justify-center text-[#079b9a] group-hover:bg-[#079b9a] group-hover:text-white transition-colors duration-200 border border-[#e3ebef]">
                <HeartPulse className="w-5 h-5 stroke-[2.4]" />
              </div>
            )}
            <span className="text-xl font-extrabold tracking-tight text-[#102d4b] group-hover:text-[#079b9a] transition-colors">
              {settings.siteName}
            </span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm transition-colors relative py-1 focus-visible:outline-2 focus-visible:outline-[#079b9a] rounded-sm ${
                    active
                      ? 'text-[#087e83] font-bold'
                      : 'text-[#506477] hover:text-[#087e83] font-medium'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#079b9a] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Phone */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-xs font-semibold text-[#506477] hover:text-[#087e83] px-3 py-2 rounded-lg hover:bg-[#eaf7f7] transition-colors"
              title="Call for clinical queries"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#079b9a]" />
              <span>{settings.phone}</span>
            </a>

            <Link
              to="/enquiry"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-[#079b9a] hover:bg-[#087e83] rounded-[10px] shadow-[0_6px_15px_rgba(7,155,154,0.22)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#079b9a]"
            >
              Enquiry Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/enquiry"
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#079b9a] rounded-[8px] shadow-xs"
            >
              Enquiry Now
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#506477] hover:text-[#102d4b] rounded-lg focus-visible:outline-2 focus-visible:outline-[#079b9a]"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e3ebef] bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-2.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-base rounded-lg transition-colors ${
                    active
                      ? 'bg-[#eaf7f7] text-[#087e83] font-bold'
                      : 'text-[#18324b] hover:bg-[#f7fafb] font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-[#e3ebef] flex flex-col gap-2.5">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#18324b] font-medium bg-[#f7fafb] rounded-lg"
              >
                <PhoneCall className="w-4 h-4 text-[#079b9a]" />
                <span>Call {settings.phone}</span>
              </a>

              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-bold text-white bg-[#079b9a] hover:bg-[#087e83] rounded-[10px] shadow-[0_6px_15px_rgba(7,155,154,0.22)]"
              >
                Enquiry Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
