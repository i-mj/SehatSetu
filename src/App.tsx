/**
 * Nurse Care - Main Application & React Router Configuration
 * Maps all public healthcare pathways, hidden nurse onboarding, and protected admin console.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutUsPage } from './pages/public/AboutUsPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ContactUsPage } from './pages/public/ContactUsPage';
import { EnquiryPage } from './pages/public/EnquiryPage';
import { FeedbacksPage } from './pages/public/FeedbacksPage';
import { SitemapPage, TermsConditionsPage, PrivacyPolicyPage, PatientCharterPage } from './pages/public/LegalPages';
import { NurseOnboardingPage } from './pages/public/NurseOnboardingPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminNurses } from './pages/admin/AdminNurses';
import { AdminFinances } from './pages/admin/AdminFinances';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminFormFields } from './pages/admin/AdminFormFields';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminStaffUsers } from './pages/admin/AdminStaffUsers';
import { AdminAccountSettings } from './pages/admin/AdminAccountSettings';

// Scroll to top on navigation change & Discreet Admin Shortcut Listener
const NavigationHelpers = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Discreet keyboard shortcut (Alt+A or Ctrl+Shift+A) for admin access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};

// Public Website Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTopButton />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <NavigationHelpers />
        <ToastContainer />

        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/feedbacks" element={<FeedbacksPage />} />
            <Route path="/reviews" element={<Navigate to="/feedbacks" replace />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/patient-charter" element={<PatientCharterPage />} />
          </Route>

          {/* Hidden Nurse Onboarding (Not linked in header/footer) */}
          <Route path="/join/nurse-7k2x" element={<NurseOnboardingPage />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="nurses" element={<AdminNurses />} />
            <Route path="finances" element={<AdminFinances />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="form-fields" element={<AdminFormFields />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="staff" element={<AdminStaffUsers />} />
            <Route path="account" element={<AdminAccountSettings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
