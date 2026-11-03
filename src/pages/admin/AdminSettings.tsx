/**
 * Nurse Care - Admin Settings Management
 * Controls site name, logo upload with instant preview, phone, email, address,
 * WhatsApp number, social media profiles, and default SEO titles.
 * Updates reflect immediately across the public website.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  Settings,
  Globe,
  Upload,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Share2,
  Search,
  CheckCircle2,
  X,
  HeartPulse,
  FileSpreadsheet,
  ExternalLink,
  Stethoscope,
  User,
  ShieldCheck
} from 'lucide-react';
import { GoogleSheetsSyncModal } from '../../components/admin/GoogleSheetsSyncModal';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, addToast, googleSheetId, lastSheetSync } = useApp();
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Form states initialized with current settings
  const [siteName, setSiteName] = useState(settings.siteName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [facebook, setFacebook] = useState(settings.socialLinks.facebook || '');
  const [twitter, setTwitter] = useState(settings.socialLinks.twitter || '');
  const [instagram, setInstagram] = useState(settings.socialLinks.instagram || '');
  const [linkedin, setLinkedin] = useState(settings.socialLinks.linkedin || '');
  const [defaultSeoTitle, setDefaultSeoTitle] = useState(settings.defaultSeoTitle);
  const [defaultSeoDescription, setDefaultSeoDescription] = useState(settings.defaultSeoDescription);

  // Logo upload with preview
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Invalid File', 'Please upload a PNG, JPG, or SVG image file.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('File Too Large', 'Logo image size must be under 2 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
      addToast('Logo Loaded', 'Logo preview updated. Click "Save Settings" to publish.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    setLogoUrl('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      siteName: siteName.trim(),
      logoUrl: logoUrl.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      whatsappNumber: whatsappNumber.trim(),
      socialLinks: {
        facebook: facebook.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
        linkedin: linkedin.trim()
      },
      defaultSeoTitle: defaultSeoTitle.trim(),
      defaultSeoDescription: defaultSeoDescription.trim()
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageSeo
        title="Admin - Site Settings"
        description="Configure branding, contact numbers, WhatsApp links, and search engine metadata."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System & Public Site Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Changes applied here propagate instantly to the public header, footer, WhatsApp launcher, and SEO meta tags.
          </p>
        </div>

        <Link
          to="/admin/account"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#0f8672] border border-teal-200 text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
        >
          <User className="w-4 h-4" />
          <span>My Admin Account Settings →</span>
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Logo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-[#0f8672]" />
            <h2 className="text-sm font-bold text-slate-900">Branding & Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Service Brand Name *
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
              />
            </div>

            {/* Logo Upload with Preview */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Brand Logo (Optional Upload with Preview)
              </label>

              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Brand Logo Preview"
                      className="h-10 w-auto object-contain max-w-[120px]"
                    />
                    <button
                      type="button"
                      onClick={handleClearLogo}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                      title="Clear Logo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-[#effaf8] border border-teal-100 rounded-xl text-teal-800 text-xs">
                    <HeartPulse className="w-5 h-5 text-[#0f8672]" />
                    <span>Default SVG Wordmark Active</span>
                  </div>
                )}

                <label className="px-3.5 py-2 bg-slate-100 hover:bg-teal-50 hover:text-[#0f8672] border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Logo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#0f8672]" />
            <h2 className="text-sm font-bold text-slate-900">Clinical Helpline & WhatsApp</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Public Support Telephone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Official Clinical Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                WhatsApp wa.me Number (with country code) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 919876543210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Used to generate the floating WhatsApp button link on public pages.
              </span>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Physical Office & Coordination Hub Address *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Share2 className="w-4 h-4 text-[#0f8672]" />
            <h2 className="text-sm font-bold text-slate-900">Social Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Search className="w-4 h-4 text-[#0f8672]" />
            <h2 className="text-sm font-bold text-slate-900">Search Engine Optimization (SEO)</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Default Document Title
              </label>
              <input
                type="text"
                value={defaultSeoTitle}
                onChange={(e) => setDefaultSeoTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={defaultSeoDescription}
                onChange={(e) => setDefaultSeoDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Clinical Services & Coverage Locations Management */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#0f8672]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Services Catalog & Dispatch Locations
              </h2>
            </div>
            <Link
              to="/admin/services"
              className="px-3.5 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Manage Services & Locations</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Customize which nursing procedures are offered, edit procedure descriptions, clinical FAQs, shift pricing notes, and configure active geographical coverage zones (response times, dispatch ETAs, and prominent sectors).
          </p>
        </div>

        {/* Google Workspace & Google Sheets Integration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Google Sheets Integration
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsSheetsModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Manage Sheets Sync</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Connected Spreadsheet ID</span>
              <span className="font-mono font-semibold text-slate-800 break-all">
                {googleSheetId || 'None connected yet'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Last Sync Timestamp</span>
              <span className="font-semibold text-slate-800">
                {lastSheetSync ? new Date(lastSheetSync).toLocaleString() : 'Never synced'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Enquiries are exported directly to Google Sheets with real-time OAuth authorization. Patient names, contact numbers, services, and nurse assignments remain synchronized.
          </p>
        </div>

        {/* Save CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Apply Settings Immediately</span>
          </button>
        </div>
      </form>

      {/* Google Sheets Sync Modal */}
      <GoogleSheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
};
