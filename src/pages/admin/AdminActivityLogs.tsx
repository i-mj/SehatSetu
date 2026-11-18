/**
 * Nurse Care - Super Admin Activity Logs Page
 * Route: /admin/activity-logs
 * Strictly accessible only by SUPER_ADMIN. Tracks actions performed by
 * secondary admins (CLINICAL_ADMIN) and staff users (STAFF, FINANCE), with
 * optional toggle to inspect Super Admin and public intake activity.
 */

import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { ActivityLogCategory, ActivityLogEntry } from '../../types';
import {
  Activity,
  Search,
  Download,
  ShieldAlert,
  RotateCcw,
  Users,
  Clock,
  Filter
} from 'lucide-react';

type ActorScopeFilter = 'OTHER_USERS' | 'ALL' | 'PUBLIC' | string;

const ROLE_LABELS: Record<ActivityLogEntry['actorRole'], string> = {
  SUPER_ADMIN: 'Super Admin',
  CLINICAL_ADMIN: 'Admin 2 (Clinical)',
  COORDINATOR: 'Care Coordinator',
  STAFF: 'Clinical Staff',
  FINANCE: 'Finance Staff',
  PUBLIC: 'Public Intake'
};

const CATEGORY_LABELS: Record<ActivityLogCategory, string> = {
  AUTH: 'Authentication',
  ENQUIRY: 'Enquiries',
  NURSE: 'Nurses',
  FINANCE: 'Finances & Billing',
  CONTACT: 'Contact Enquiries',
  REVIEW: 'Reviews',
  SERVICE: 'Services & Locations',
  STAFF: 'Staff & Admin Users',
  SETTINGS: 'Settings & Forms'
};

export const AdminActivityLogs: React.FC = () => {
  const { activityLogs, currentAdminUser, adminUsers, staffRecords, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [actorScope, setActorScope] = useState<ActorScopeFilter>('OTHER_USERS');
  const [roleFilter, setRoleFilter] = useState<'ALL' | ActivityLogEntry['actorRole']>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ActivityLogCategory>('ALL');

  // Strict route guard: only SUPER_ADMIN can access Activity Logs
  if (currentAdminUser?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Unique actor options combining team directory + existing log entries
  const actorOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; role: ActivityLogEntry['actorRole'] }>();

    adminUsers.forEach((u) => {
      map.set(u.id, { id: u.id, name: u.fullName, role: u.role });
    });

    staffRecords
      .filter((s) => s.canLogin || activityLogs.some((l) => l.actorId === s.id))
      .forEach((s) => {
        if (!map.has(s.id)) {
          map.set(s.id, {
            id: s.id,
            name: s.fullName,
            role: s.loginRole === 'FINANCE' ? 'FINANCE' : 'STAFF'
          });
        }
      });

    activityLogs.forEach((log) => {
      if (log.actorId && log.actorRole !== 'PUBLIC' && !map.has(log.actorId)) {
        map.set(log.actorId, {
          id: log.actorId,
          name: log.actorName,
          role: log.actorRole
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [adminUsers, staffRecords, activityLogs]);

  // Summary metrics
  const metrics = useMemo(() => {
    const todayPrefix = new Date().toISOString().slice(0, 10);
    const otherUsersLogs = activityLogs.filter(
      (log) => log.actorRole !== 'SUPER_ADMIN' && log.actorRole !== 'PUBLIC'
    );
    const uniqueOtherActors = new Set(otherUsersLogs.map((log) => log.actorId)).size;
    const todayLogsCount = activityLogs.filter((log) => {
      try {
        return new Date(log.timestamp).toISOString().slice(0, 10) === todayPrefix;
      } catch {
        return false;
      }
    }).length;

    return {
      total: activityLogs.length,
      otherUsersTotal: otherUsersLogs.length,
      uniqueOtherActors,
      todayCount: todayLogsCount
    };
  }, [activityLogs]);

  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return [...activityLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter((log) => {
        if (actorScope === 'OTHER_USERS') {
          if (log.actorRole === 'SUPER_ADMIN' || log.actorRole === 'PUBLIC') {
            return false;
          }
        } else if (actorScope === 'PUBLIC') {
          if (log.actorRole !== 'PUBLIC') return false;
        } else if (actorScope !== 'ALL') {
          if (log.actorId !== actorScope) return false;
        }

        if (roleFilter !== 'ALL' && log.actorRole !== roleFilter) {
          return false;
        }

        if (categoryFilter !== 'ALL' && log.category !== categoryFilter) {
          return false;
        }

        if (!q) return true;

        return (
          log.action.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          (log.actorEmail || '').toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          (log.targetType || '').toLowerCase().includes(q) ||
          (log.targetId || '').toLowerCase().includes(q)
        );
      });
  }, [activityLogs, actorScope, roleFilter, categoryFilter, searchTerm]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    actorScope !== 'OTHER_USERS' ||
    roleFilter !== 'ALL' ||
    categoryFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearchTerm('');
    setActorScope('OTHER_USERS');
    setRoleFilter('ALL');
    setCategoryFilter('ALL');
  };

  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      addToast('Nothing to Export', 'No matching activity records available for export.', 'warning');
      return;
    }

    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const headers = [
      'Log ID',
      'Timestamp',
      'Actor Name',
      'Actor Email',
      'Actor Role',
      'Category',
      'Action',
      'Target Type',
      'Target ID',
      'Details'
    ];

    const rows = filteredLogs.map((log) => [
      escapeCsv(log.id),
      escapeCsv(new Date(log.timestamp).toISOString()),
      escapeCsv(log.actorName),
      escapeCsv(log.actorEmail || ''),
      escapeCsv(ROLE_LABELS[log.actorRole] || log.actorRole),
      escapeCsv(CATEGORY_LABELS[log.category] || log.category),
      escapeCsv(log.action),
      escapeCsv(log.targetType || ''),
      escapeCsv(log.targetId || ''),
      escapeCsv(log.details)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nursecare-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('CSV Exported', `Downloaded ${filteredLogs.length} activity log entries.`, 'success');
  };

  const getRoleBadgeClass = (role: ActivityLogEntry['actorRole']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-slate-900 text-white border-slate-800';
      case 'CLINICAL_ADMIN':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'COORDINATOR':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'STAFF':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'FINANCE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'PUBLIC':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getCategoryBadgeClass = (category: ActivityLogCategory) => {
    switch (category) {
      case 'AUTH':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'ENQUIRY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'NURSE':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'FINANCE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CONTACT':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'REVIEW':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'SERVICE':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'STAFF':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SETTINGS':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageSeo
        title="Activity Logs - Nurse Care Super Admin"
        description="Super Admin audit trail of system actions performed by admin and staff users."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0f8672] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Super Admin Audit Console</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track all system actions, status updates, billing operations, and sign-ins performed by other admin and staff users.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#0f8672] shrink-0" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Recorded Actions</span>
            <Activity className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{metrics.total}</div>
        </div>

        <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-800">
            <span>Admin & Staff Actions</span>
            <Users className="w-4 h-4 text-[#0f8672] shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-[#0f8672] mt-1 tabular-nums">
            {metrics.otherUsersTotal}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active Team Actors</span>
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {metrics.uniqueOtherActors}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Actions Today</span>
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {metrics.todayCount}
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search action, user, email, record ID, or details..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
            />
          </div>

          {/* Actor Scope Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={actorScope}
              onChange={(e) => setActorScope(e.target.value)}
              aria-label="Filter by user or scope"
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus-visible:outline-teal-700 cursor-pointer"
            >
              <option value="OTHER_USERS">Other Admins &amp; Staff Only</option>
              <option value="ALL">All System Activity</option>
              <option value="PUBLIC">Public Website Submissions</option>
              <optgroup label="Specific Team Member">
                {actorOptions.map((actor) => (
                  <option key={actor.id} value={actor.id}>
                    {actor.name} ({ROLE_LABELS[actor.role]})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | ActivityLogEntry['actorRole'])}
              aria-label="Filter by role"
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus-visible:outline-teal-700 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="CLINICAL_ADMIN">Admin 2 (Clinical)</option>
              <option value="COORDINATOR">Care Coordinator</option>
              <option value="STAFF">Clinical Staff</option>
              <option value="FINANCE">Finance Staff</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="PUBLIC">Public Intake</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | ActivityLogCategory)}
              aria-label="Filter by module category"
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus-visible:outline-teal-700 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ENQUIRY">Enquiries</option>
              <option value="NURSE">Nurses</option>
              <option value="FINANCE">Finances &amp; Billing</option>
              <option value="CONTACT">Contact Enquiries</option>
              <option value="REVIEW">Reviews</option>
              <option value="SERVICE">Services &amp; Locations</option>
              <option value="STAFF">Staff &amp; Admin Users</option>
              <option value="SETTINGS">Settings &amp; Forms</option>
              <option value="AUTH">Authentication</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 tabular-nums">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Showing <strong className="text-slate-800">{filteredLogs.length}</strong> matching activity records
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-semibold text-[#0f8672] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <Activity className="w-8 h-8 text-slate-300 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-slate-700">No matching activity records found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Try switching the user scope, clearing the search text, or resetting your active filters.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0f8672] hover:bg-[#0e6b5c] rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 whitespace-nowrap">Timestamp</th>
                  <th className="py-3 px-4 whitespace-nowrap">User &amp; Role</th>
                  <th className="py-3 px-4 whitespace-nowrap">Category</th>
                  <th className="py-3 px-4 whitespace-nowrap">Action &amp; Target</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const dateLabel = isNaN(dateObj.getTime())
                    ? log.timestamp
                    : dateObj.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                  const timeLabel = isNaN(dateObj.getTime())
                    ? ''
                    : dateObj.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors align-top">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap tabular-nums">
                        <div className="font-mono font-semibold text-slate-800">{dateLabel}</div>
                        {timeLabel && (
                          <div className="font-mono text-[11px] text-slate-400 mt-0.5">{timeLabel}</div>
                        )}
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 whitespace-nowrap">{log.actorName}</div>
                        {log.actorEmail && (
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                            {log.actorEmail}
                          </div>
                        )}
                        <span
                          className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0 ${getRoleBadgeClass(
                            log.actorRole
                          )}`}
                        >
                          {ROLE_LABELS[log.actorRole] || log.actorRole}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0 ${getCategoryBadgeClass(
                            log.category
                          )}`}
                        >
                          {CATEGORY_LABELS[log.category] || log.category}
                        </span>
                      </td>

                      {/* Action & Target */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 whitespace-nowrap">{log.action}</div>
                        {(log.targetType || log.targetId) && (
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                            {log.targetType}
                            {log.targetId ? ` #${log.targetId}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-slate-600 leading-relaxed min-w-[240px]">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
