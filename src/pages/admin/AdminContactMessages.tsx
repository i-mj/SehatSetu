/**
 * Nurse Care - Contact Us Enquiries Management Page
 * Route: /admin/contact-messages
 * Displays messages submitted from the public Contact Us page with a status
 * filtering dropdown (All, New, Pending, In Progress, Resolved, Archived),
 * coordinator notes, direct outreach links, and conversion to patient care enquiries.
 */

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { ContactMessage, ContactMessageStatus } from '../../types';
import {
  Inbox,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Trash2,
  ArrowRightCircle,
  Save,
  AlertCircle,
  X,
  Archive,
  RotateCcw,
  Filter
} from 'lucide-react';

export const AdminContactMessages: React.FC = () => {
  const {
    contactMessages,
    updateContactMessage,
    deleteContactMessage,
    addEnquiry,
    services,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContactMessageStatus>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const newCount = contactMessages.filter((m) => (m.status || 'NEW') === 'NEW').length;
    const pendingCount = contactMessages.filter((m) => m.status === 'PENDING').length;
    const inProgressCount = contactMessages.filter((m) => m.status === 'IN_PROGRESS').length;
    const resolvedCount = contactMessages.filter((m) => m.status === 'RESOLVED').length;
    const archivedCount = contactMessages.filter((m) => m.status === 'ARCHIVED').length;
    return {
      total: contactMessages.length,
      newCount,
      pendingCount,
      inProgressCount,
      resolvedCount,
      archivedCount,
      openCount: newCount + pendingCount
    };
  }, [contactMessages]);

  const filteredMessages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return [...contactMessages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((msg) => {
        const msgStatus = msg.status || 'NEW';
        const matchesStatus = statusFilter === 'ALL' || msgStatus === statusFilter;
        const matchesQuery =
          !q ||
          msg.fullName.toLowerCase().includes(q) ||
          msg.email.toLowerCase().includes(q) ||
          msg.phone.toLowerCase().includes(q) ||
          msg.subject.toLowerCase().includes(q) ||
          msg.message.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      });
  }, [contactMessages, searchTerm, statusFilter]);

  const getStatusBadge = (status: ContactMessageStatus = 'NEW') => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getStatusLabel = (status: ContactMessageStatus = 'NEW') => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'RESOLVED':
        return 'Resolved';
      case 'ARCHIVED':
        return 'Archived';
    }
  };

  const handleOpenNotes = (msg: ContactMessage) => {
    setEditingNotesId(msg.id);
    setNotesDraft(msg.adminNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    updateContactMessage(id, { adminNotes: notesDraft.trim() });
    setEditingNotesId(null);
  };

  const handleConvertToEnquiry = (msg: ContactMessage) => {
    const defaultService = services.find((s) => s.isActive !== false) || services[0];
    const newEnqId = addEnquiry({
      fullName: msg.fullName,
      phone: msg.phone || 'Not provided',
      email: msg.email || '',
      serviceId: defaultService?.id || 'srv-1',
      cityArea: 'From Contact Us Form',
      preferredDate: new Date().toISOString().substring(0, 10),
      message: `[${msg.subject}] ${msg.message}`
    });

    updateContactMessage(msg.id, {
      status: 'RESOLVED',
      adminNotes: `${msg.adminNotes ? msg.adminNotes + '\n' : ''}Converted to Care Enquiry #${newEnqId}.`
    });
    addToast(
      'Converted to Care Enquiry',
      `Created enquiry #${newEnqId} for ${msg.fullName} and marked contact query Resolved.`,
      'success'
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageSeo
        title="Contact Enquiries - Nurse Care Admin"
        description="Review and resolve enquiries submitted via the public Contact Us form."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Contact Us Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct messages, clinical queries, billing requests, and partnership enquiries sent from the public Contact Us page.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl tabular-nums shrink-0">
          <Inbox className="w-4 h-4 text-[#0f8672] shrink-0" />
          <span>
            <strong className="text-slate-900">{counts.openCount}</strong> pending response
          </span>
        </div>
      </div>

      {/* KPI Summary Strip (clickable to quick-filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`text-left bg-white border rounded-2xl p-4 shadow-2xs transition-colors cursor-pointer ${
            statusFilter === 'ALL' ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">All Enquiries</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{counts.total}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('NEW')}
          className={`text-left bg-white border rounded-2xl p-4 shadow-2xs transition-colors cursor-pointer ${
            statusFilter === 'NEW' ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="text-xs font-semibold text-blue-700">New</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">{counts.newCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`text-left bg-white border rounded-2xl p-4 shadow-2xs transition-colors cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'border-orange-500 ring-1 ring-orange-500/20'
              : 'border-orange-200 hover:border-orange-300'
          }`}
        >
          <div className="text-xs font-semibold text-orange-700">Pending</div>
          <div className="text-2xl font-extrabold text-orange-700 mt-1 tabular-nums">{counts.pendingCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('RESOLVED')}
          className={`text-left bg-white border rounded-2xl p-4 shadow-2xs transition-colors cursor-pointer ${
            statusFilter === 'RESOLVED'
              ? 'border-emerald-500 ring-1 ring-emerald-500/20'
              : 'border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-xs font-semibold text-emerald-700">Resolved</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">{counts.resolvedCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('ARCHIVED')}
          className={`text-left bg-white border rounded-2xl p-4 shadow-2xs transition-colors cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === 'ARCHIVED'
              ? 'border-slate-500 ring-1 ring-slate-500/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-600">Archived</div>
          <div className="text-2xl font-extrabold text-slate-700 mt-1 tabular-nums">{counts.archivedCount}</div>
        </button>
      </div>

      {/* Search & Status Filter Dropdown Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by sender name, email, phone, subject, or message..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="contact-status-filter"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 whitespace-nowrap"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Status:</span>
          </label>
          <select
            id="contact-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ContactMessageStatus)}
            aria-label="Filter enquiries by status"
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus-visible:outline-teal-700 cursor-pointer min-w-[180px]"
          >
            <option value="ALL">All Statuses ({counts.total})</option>
            <option value="NEW">New ({counts.newCount})</option>
            <option value="PENDING">Pending ({counts.pendingCount})</option>
            <option value="IN_PROGRESS">In Progress ({counts.inProgressCount})</option>
            <option value="RESOLVED">Resolved ({counts.resolvedCount})</option>
            <option value="ARCHIVED">Archived ({counts.archivedCount})</option>
          </select>

          {(statusFilter !== 'ALL' || searchTerm.trim() !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Reset search and status filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-semibold text-slate-700">No Contact Us enquiries found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try clearing your search or selecting another status from the dropdown.'
                : 'Submissions from the public Contact Us page will appear here immediately.'}
            </p>
          </div>
          {(searchTerm || statusFilter !== 'ALL') && (
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
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const status = msg.status || 'NEW';
            const cleanDigits = (msg.phone || '').replace(/[^0-9]/g, '');
            const whatsappHref = cleanDigits
              ? `https://wa.me/${cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits}?text=${encodeURIComponent(
                  `Hello ${msg.fullName}, regarding your Contact Us message (${msg.subject}) on Nurse Care:`
                )}`
              : '';

            return (
              <div
                key={msg.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4"
              >
                {/* Top Row: Sender, Subject, Timestamp, Status */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{msg.fullName}</h2>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0 ${getStatusBadge(
                          status
                        )}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                      <span className="text-xs font-semibold text-[#0f8672]">
                        · {msg.subject}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 tabular-nums">
                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#0f8672] font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{msg.phone}</span>
                        </a>
                      )}
                      {msg.email && (
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject} - Nurse Care`)}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#0f8672] font-medium"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{msg.email}</span>
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {new Date(msg.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Status Selector & Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      value={status}
                      onChange={(e) =>
                        updateContactMessage(msg.id, { status: e.target.value as ContactMessageStatus })
                      }
                      aria-label={`Update status for ${msg.fullName}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus-visible:outline-teal-700 cursor-pointer"
                    >
                      <option value="NEW">New</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>

                    {whatsappHref && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleConvertToEnquiry(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0f8672] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      title="Convert this contact query into a structured patient care enquiry"
                    >
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                      <span>Convert to Enquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateContactMessage(msg.id, {
                          status: status === 'ARCHIVED' ? 'PENDING' : 'ARCHIVED'
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      title={status === 'ARCHIVED' ? 'Restore to Pending' : 'Archive message'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{status === 'ARCHIVED' ? 'Restore' : 'Archive'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(msg.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {msg.message}
                </div>

                {/* Internal Coordinator Notes */}
                <div className="pt-1">
                  {editingNotesId === msg.id ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Coordinator Notes / Follow-up Summary
                      </label>
                      <textarea
                        rows={2}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Record call summary, reply sent, or resolution notes..."
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(msg.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0f8672] hover:bg-[#0e6b5c] rounded-lg cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Notes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-slate-600">
                        {msg.adminNotes ? (
                          <span>
                            <strong className="text-slate-800">Coordinator Note:</strong> {msg.adminNotes}
                          </span>
                        ) : (
                          <span className="text-slate-400">No internal notes recorded yet.</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenNotes(msg)}
                        className="text-xs font-semibold text-[#0f8672] hover:underline self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {msg.adminNotes ? 'Edit Note' : '+ Add Coordinator Note'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Delete Contact Enquiry</span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs text-slate-600">
              <p>Are you sure you want to permanently remove this Contact Us message? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteContactMessage(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
