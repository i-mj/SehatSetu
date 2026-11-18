/**
 * Nurse Care - Admin Layout & Shell
 * Provides sidebar navigation (Dashboard, Enquiries, Nurses, Reviews, Settings),
 * authentication guard, sign-out handler, and responsive drawer.
 */

import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  HeartPulse,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sliders,
  FileSpreadsheet,
  Stethoscope,
  User,
  UserCheck,
  DollarSign,
  Inbox,
  Activity
} from 'lucide-react';
import { GoogleSheetsSyncModal } from '../../components/admin/GoogleSheetsSyncModal';

export const AdminLayout: React.FC = () => {
  const { isAdminLoggedIn, adminLogout, settings, enquiries, nurses, reviews, contactMessages, googleSheetId, currentAdminUser } = useApp();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Authentication Guard: redirect unauthenticated users to /admin/login
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Badge counts
  const newEnquiriesCount = enquiries.filter((e) => e.stage === 'NEW').length;
  const newContactCount = contactMessages.filter(
    (m) => (m.status || 'NEW') === 'NEW' || m.status === 'PENDING'
  ).length;
  const pendingNursesCount = nurses.filter((n) => n.status === 'PENDING').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'PENDING').length;

  const isSuperAdmin = currentAdminUser?.role === 'SUPER_ADMIN';
  const isStaffUser = currentAdminUser?.role === 'STAFF';
  const isFinanceUser = currentAdminUser?.role === 'FINANCE';
  const { pathname } = useLocation();

  // If staff user attempts to access restricted pages, redirect to /admin/enquiries
  const staffAllowedPaths = ['/admin/enquiries', '/admin/nurses', '/admin/account'];
  if (isStaffUser && !staffAllowedPaths.some((p) => pathname.startsWith(p))) {
    return <Navigate to="/admin/enquiries" replace />;
  }

  // If finance staff attempts to access non-finance pages, redirect to /admin/finances
  const financeAllowedPaths = ['/admin/finances', '/admin/account'];
  if (isFinanceUser && !financeAllowedPaths.some((p) => pathname.startsWith(p))) {
    return <Navigate to="/admin/finances" replace />;
  }

  // Activity Logs is strictly restricted to Super Admin
  if (pathname.startsWith('/admin/activity-logs') && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const navItems = isFinanceUser
    ? [
        {
          to: '/admin/finances',
          label: 'Finances & Billing',
          icon: DollarSign,
          badge: null
        },
        {
          to: '/admin/account',
          label: 'My Account',
          icon: User,
          badge: null
        }
      ]
    : isStaffUser
    ? [
        {
          to: '/admin/enquiries',
          label: 'Enquiries',
          icon: ClipboardList,
          badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} new` : null
        },
        {
          to: '/admin/nurses',
          label: 'Nurses',
          icon: Users,
          badge: pendingNursesCount > 0 ? `${pendingNursesCount} pending` : null
        },
        {
          to: '/admin/account',
          label: 'My Account',
          icon: User,
          badge: null
        }
      ]
    : [
        {
          to: '/admin/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          to: '/admin/enquiries',
          label: 'Enquiries',
          icon: ClipboardList,
          badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} new` : null
        },
        {
          to: '/admin/contact-messages',
          label: 'Contact Enquiries',
          icon: Inbox,
          badge: newContactCount > 0 ? `${newContactCount} open` : null
        },
        {
          to: '/admin/nurses',
          label: 'Nurses',
          icon: Users,
          badge: pendingNursesCount > 0 ? `${pendingNursesCount} pending` : null
        },
        {
          to: '/admin/finances',
          label: 'Finances',
          icon: DollarSign,
          badge: null
        },
        {
          to: '/admin/reviews',
          label: 'Reviews',
          icon: MessageSquare,
          badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} pending` : null
        },
        {
          to: '/admin/form-fields',
          label: 'Form Builder',
          icon: Sliders,
          badge: null
        },
        {
          to: '/admin/services',
          label: 'Services & Locations',
          icon: Stethoscope,
          badge: null
        },
        {
          to: '/admin/staff',
          label: 'Staff Records',
          icon: UserCheck,
          badge: null
        },
        ...(isSuperAdmin
          ? [
              {
                to: '/admin/activity-logs',
                label: 'Activity Logs',
                icon: Activity,
                badge: null
              }
            ]
          : []),
        {
          to: '/admin/account',
          label: 'Admin Account',
          icon: User,
          badge: null
        },
        {
          to: '/admin/settings',
          label: 'Settings',
          icon: Settings,
          badge: null
        }
      ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          {currentAdminUser?.avatarUrl ? (
            <img
              src={currentAdminUser.avatarUrl}
              alt={currentAdminUser.fullName}
              className="w-8 h-8 rounded-lg object-cover border border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#0f8672] flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
          )}
          <span className="font-bold text-sm tracking-tight">{settings.siteName} Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg focus-visible:outline-teal-400"
          aria-label="Toggle admin sidebar"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop for Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Wordmark & Role */}
          <div className="p-5 border-b border-slate-800">
            <Link
              to={isFinanceUser ? '/admin/finances' : isStaffUser ? '/admin/enquiries' : '/admin/dashboard'}
              className="flex items-center gap-2.5 text-white focus-visible:outline-teal-500 rounded"
            >
              {currentAdminUser?.avatarUrl ? (
                <img
                  src={currentAdminUser.avatarUrl}
                  alt={currentAdminUser.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#0f8672] flex items-center justify-center text-white shadow shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="font-bold text-sm tracking-tight text-white leading-none truncate">
                  {settings.siteName}
                </div>
                {isFinanceUser ? (
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1 truncate max-w-[155px]">
                    <DollarSign className="w-3 h-3 shrink-0" />
                    <span className="truncate">Finance Desk (Staff)</span>
                  </div>
                ) : isStaffUser ? (
                  <div className="text-[11px] text-purple-300 mt-1 font-semibold flex items-center gap-1 truncate max-w-[155px]">
                    <UserCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">Clinical Staff Desk</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-teal-400 mt-1 font-medium flex items-center gap-1 truncate max-w-[155px]">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">{currentAdminUser?.fullName || 'Clinical Administrator'}</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Sections">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0f8672] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Quick Google Sheets Integration Launcher - Admin Only */}
            {!isStaffUser && !isFinanceUser && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    setIsSheetsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors"
                  title="Open Google Sheets real-time synchronization"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Google Sheets Sync</span>
                  </div>
                  {googleSheetId ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40" title="Connected to Google Sheet" />
                  ) : (
                    <span className="text-[10px] text-emerald-300/80 font-mono">Connect</span>
                  )}
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer: Back to public site & Sign Out */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">tab</span>
          </Link>

          <button
            onClick={handleSignOut}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors focus-visible:outline-rose-500"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        <Outlet />
      </main>

      {/* Google Sheets Sync Modal */}
      <GoogleSheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
};
