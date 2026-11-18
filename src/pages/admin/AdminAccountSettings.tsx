/**
 * Nurse Care - Admin Account Settings
 * Route: /admin/account
 * Features:
 * - Update personal administrator profile details (Name, Email, Phone, Designation)
 * - Secure password change with verification & strength check
 * - Two-Factor Authentication (2FA) simulation toggle
 * - Active session details & security login history
 * - Switch between configured admin accounts seamlessly
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { ProfileAvatarUploader } from '../../components/common/ProfileAvatarUploader';
import {
  User,
  ShieldCheck,
  Key,
  Lock,
  Mail,
  Phone,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  Users
} from 'lucide-react';

export const AdminAccountSettings: React.FC = () => {
  const {
    currentAdminUser,
    updateCurrentAdminProfile,
    changeAdminPassword,
    adminUsers,
    adminLogin,
    addToast
  } = useApp();

  // Profile Form State
  const [fullName, setFullName] = useState(currentAdminUser?.fullName || 'Dr. Priya Sharma');
  const [email, setEmail] = useState(currentAdminUser?.email || 'admin@nursecare.org');
  const [phone, setPhone] = useState(currentAdminUser?.phone || '+91 98112 34567');
  const [designation, setDesignation] = useState(currentAdminUser?.designation || 'Chief Clinical Director & Super Admin');
  const [avatarUrl, setAvatarUrl] = useState(currentAdminUser?.avatarUrl || '');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Security 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const isSuperAdmin = currentAdminUser?.role === 'SUPER_ADMIN';

  // Keep state synced if currentAdminUser changes
  React.useEffect(() => {
    if (currentAdminUser) {
      setFullName(currentAdminUser.fullName);
      setEmail(currentAdminUser.email);
      setPhone(currentAdminUser.phone || '');
      setDesignation(currentAdminUser.designation || '');
      setAvatarUrl(currentAdminUser.avatarUrl || '');
    }
  }, [currentAdminUser]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      addToast('Validation Error', 'Full name and email are mandatory.', 'error');
      return;
    }

    updateCurrentAdminProfile({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      designation: designation.trim(),
      avatarUrl
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Current Password Required', 'Please enter your current administrator password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password Too Short', 'New password must have at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Password Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    const success = changeAdminPassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageSeo
        title="Admin - Account Settings"
        description="Manage your clinical administrator profile, security credentials, and authentication preferences."
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Administrator Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal credentials, contact profile, security settings, and session status.
        </p>
      </div>

      {/* Active Profile Summary Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {currentAdminUser?.avatarUrl ? (
              <img
                src={currentAdminUser.avatarUrl}
                alt={currentAdminUser.fullName}
                className="w-14 h-14 rounded-2xl object-cover border border-teal-200 shadow-sm shrink-0 bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#0f8672] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                {currentAdminUser?.fullName?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  {currentAdminUser?.fullName || 'Super Administrator'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f8672] text-white">
                  {currentAdminUser?.role?.replace('_', ' ') || 'SUPER ADMIN'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Session Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentAdminUser?.email || 'admin@nursecare.org'} · {currentAdminUser?.designation || 'Clinical Director'}
              </p>
            </div>
          </div>

          {/* Quick Account Switcher - Strictly Visible to Super Admin Only */}
          {isSuperAdmin && (
            <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-200">
              <span className="text-[11px] font-bold text-teal-950 uppercase tracking-wider block mb-1">
                Super Admin Oversight Switch:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {adminUsers.slice(0, 2).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      adminLogin(u.email, u.password || 'admin123');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      currentAdminUser?.id === u.id
                        ? 'bg-teal-900 text-white shadow-2xs'
                        : 'bg-white hover:bg-teal-100 text-teal-900 border border-teal-200'
                    }`}
                  >
                    {u.fullName.split(' ')[0]} ({u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin 2'})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleProfileSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-[#0f8672]" />
          <h2 className="text-sm font-bold text-slate-900">Personal & Clinical Profile</h2>
        </div>

        <ProfileAvatarUploader
          avatarUrl={avatarUrl}
          fullName={fullName}
          onChange={(nextUrl) => {
            setAvatarUrl(nextUrl);
            updateCurrentAdminProfile({ avatarUrl: nextUrl });
          }}
          label="Your Profile Picture"
          helperText="Upload a JPG, PNG, or WebP photo from your device. Updates immediately in the console."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Direct Mobile Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Clinical Title / Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Profile Updates
          </button>
        </div>
      </form>

      {/* Change Password Card */}
      <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key className="w-4 h-4 text-[#0f8672]" />
          <h2 className="text-sm font-bold text-slate-900">Change Password & Credentials</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Default demo: admin123</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Security & Authentication Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-[#0f8672]" />
          <h2 className="text-sm font-bold text-slate-900">Security & Session Details</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#0f8672] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Require OTP verification code upon coordinator login to safeguard patient health records.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                addToast(
                  twoFactorEnabled ? '2FA Disabled' : '2FA Enabled',
                  twoFactorEnabled ? 'Two-factor protection disabled.' : 'Two-factor authentication enabled.',
                  'info'
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                twoFactorEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {twoFactorEnabled ? 'Active (Protected)' : 'Disabled'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Current Session</span>
              <p>Logged in via Secure SSL Browser Session</p>
              <p className="font-mono text-slate-400">IP: 103.21.244.11 · New Delhi, India</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Account Created</span>
              <p>Certified Clinical Administration Console</p>
              <p className="text-slate-400">
                Created on {new Date(currentAdminUser?.createdAt || '2026-01-15').toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
