/**
 * Nurse Care - Administrator Login Page
 * Route: /admin/login
 * Features demo credentials hint banner, input validation, and automatic session storage.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  HeartPulse,
  Info
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, isAdminLoggedIn, currentAdminUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@nursecare.org');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  // If already logged in, navigate straight to role appropriate page
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      if (currentAdminUser?.role === 'FINANCE') {
        navigate('/admin/finances', { replace: true });
      } else if (currentAdminUser?.role === 'STAFF') {
        navigate('/admin/enquiries', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAdminLoggedIn, currentAdminUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = adminLogin(email, password);
    if (success) {
      const lower = email.trim().toLowerCase();
      if (lower.includes('finance') || currentAdminUser?.role === 'FINANCE') {
        navigate('/admin/finances');
      } else if (lower.includes('staff') || lower === 'pooja.nair@nursecare.org' || currentAdminUser?.role === 'STAFF') {
        navigate('/admin/enquiries');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError('Invalid credentials. Please use the demo credentials provided below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageSeo
        title="Admin Portal Login"
        description="Administrative authentication portal for Nurse Care home healthcare system."
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0f8672] text-white flex items-center justify-center shadow">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900">Nurse Care</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Clinical & Financial Administration Console
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Role-governed secure access for medical directors, care coordinators, and finance staff
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        {/* Demo Hint Banner - Two Admins & Two Staff Roles */}
        <div className="mb-6 bg-teal-50/90 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between font-bold text-[#0e6b5c]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0f8672] shrink-0" />
              <span>Pre-configured Logins by Department (Click to Autofill):</span>
            </div>
            <span className="text-[10px] bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded-full font-semibold">4 Profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@nursecare.org');
                setPassword('admin123');
              }}
              className="p-2.5 bg-white hover:bg-teal-100/60 border border-teal-200 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#0e6b5c] text-[11px] flex items-center justify-between">
                <span>Admin 1</span>
                <span className="text-[9px] bg-teal-100 text-[#0e6b5c] px-1.5 py-0.5 rounded-full font-bold">Super Admin</span>
              </div>
              <div className="font-medium text-slate-700 text-[10px] mt-0.5 truncate">Dr. Priya Sharma</div>
              <div className="font-mono text-slate-500 text-[9px] truncate">admin@nursecare.org</div>
              <div className="text-[9px] text-teal-700 font-medium mt-1">Full System Access</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('coordinator@nursecare.org');
                setPassword('admin123');
              }}
              className="p-2.5 bg-white hover:bg-teal-100/60 border border-teal-200 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#0e6b5c] text-[11px] flex items-center justify-between">
                <span>Admin 2</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">Clinical Ops</span>
              </div>
              <div className="font-medium text-slate-700 text-[10px] mt-0.5 truncate">Rajesh Malhotra</div>
              <div className="font-mono text-slate-500 text-[9px] truncate">coordinator@nursecare.org</div>
              <div className="text-[9px] text-emerald-700 font-medium mt-1">Full Clinical Admin</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('pooja.nair@nursecare.org');
                setPassword('staff123');
              }}
              className="p-2.5 bg-white hover:bg-purple-100/60 border border-purple-200 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-purple-800 text-[11px] flex items-center justify-between">
                <span>Staff Desk</span>
                <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-bold">Staff Role</span>
              </div>
              <div className="font-medium text-slate-700 text-[10px] mt-0.5 truncate">Pooja Nair</div>
              <div className="font-mono text-slate-500 text-[9px] truncate">pooja.nair@nursecare.org</div>
              <div className="text-[9px] text-purple-700 font-bold mt-1">Nurses & Enquiries</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('finance@nursecare.org');
                setPassword('finance123');
              }}
              className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl text-left transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="font-bold text-slate-900 group-hover:text-amber-900 text-[11px] flex items-center justify-between">
                <span>Finance Staff</span>
                <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Finance Only</span>
              </div>
              <div className="font-medium text-slate-700 text-[10px] mt-0.5 truncate">Amit Saxena</div>
              <div className="font-mono text-slate-500 text-[9px] truncate">finance@nursecare.org</div>
              <div className="text-[9px] text-amber-800 font-bold mt-1">Finances & Billing Only</div>
            </button>
          </div>
          <div className="text-[11px] text-teal-800/80 pt-1.5 border-t border-teal-200/60 leading-relaxed">
            <strong>Role Permissions:</strong> Administrators have complete access. <em>Clinical Staff</em> manage nurses and patient enquiries. <em>Finance Staff</em> manage only patient billing, collections, duration adjustments, and refund records.
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="adminEmail"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="adminEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="adminPassword"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In to Admin Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-[#0f8672] transition-colors"
            >
              ← Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
