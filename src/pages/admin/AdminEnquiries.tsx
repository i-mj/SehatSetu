/**
 * Nurse Care - Admin Enquiries Management
 * Search (name, phone), filter by stage, sort, detail view with private clinical notes,
 * stage history timeline, stage transition selector, active-only nurse assignment,
 * edit/delete with confirm dialogs, and document prescription uploads for CONFIRMED/COMPLETED.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { Enquiry, EnquiryStage, Document } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  UserCheck,
  UserX,
  FileText,
  Upload,
  Trash2,
  Edit,
  Clock,
  ShieldCheck,
  AlertTriangle,
  X,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Eye,
  FileSpreadsheet,
  ArrowRight,
  Download,
  RotateCcw,
  Check,
  CheckSquare,
  Square,
  MinusSquare,
  ChevronDown
} from 'lucide-react';
import { GoogleSheetsSyncModal } from '../../components/admin/GoogleSheetsSyncModal';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { exportToCSV } from '../../utils/exportUtils';

export const AdminEnquiries: React.FC = () => {
  const {
    enquiries,
    nurses,
    services,
    updateEnquiry,
    updateEnquiryStage,
    assignNurseToEnquiry,
    updateEnquiryNotes,
    deleteEnquiry,
    bulkDeleteEnquiries,
    bulkUpdateEnquiriesStage,
    addDocumentToEnquiry,
    deleteDocumentFromEnquiry,
    addToast
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | '30days' | 'this_month'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const applyDatePreset = (preset: 'all' | 'today' | '7days' | '30days' | 'this_month') => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
    } else if (preset === 'today') {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (preset === '7days') {
      const d = new Date(Date.now() - 7 * 86400000);
      setDateFrom(d.toISOString().split('T')[0]);
      setDateTo(todayStr);
    } else if (preset === '30days') {
      const d = new Date(Date.now() - 30 * 86400000);
      setDateFrom(d.toISOString().split('T')[0]);
      setDateTo(todayStr);
    } else if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setDateFrom(firstDay);
      setDateTo(todayStr);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedStage('ALL');
    setServiceFilter('ALL');
    setDateFrom('');
    setDateTo('');
    setDatePreset('all');
    setSortBy('newest');
  };

  const isAnyFilterActive =
    searchTerm.trim() !== '' ||
    selectedStage !== 'ALL' ||
    serviceFilter !== 'ALL' ||
    dateFrom !== '' ||
    dateTo !== '';

  // Google Sheets Sync Modal state
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Detail View Drawer / Modal state
  const [viewEnquiryId, setViewEnquiryId] = useState<string | null>(null);

  // Edit Enquiry Modal state
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);

  // Confirm Delete Dialog state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Document Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Active note editing
  const [currentNote, setCurrentNote] = useState('');

  // Handle URL query parameters (e.g. ?view=enq-101 or ?stage=NEW)
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && enquiries.some((e) => e.id === viewParam)) {
      setViewEnquiryId(viewParam);
    }
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      setSelectedStage(stageParam);
    }
  }, [searchParams, enquiries]);

  const activeEnquiry = enquiries.find((e) => e.id === viewEnquiryId);

  // Sync active enquiry notes when selection changes
  useEffect(() => {
    if (activeEnquiry) {
      setCurrentNote(activeEnquiry.notes || '');
    }
  }, [activeEnquiry]);

  // Filter ONLY ACTIVE nurses for assignment
  const activeNurses = nurses.filter((n) => n.status === 'ACTIVE');

  // Nurse Search within Patient/Enquiry View Page
  const [nurseSearchQuery, setNurseSearchQuery] = useState('');

  // Filter nurses matching nurseSearchQuery
  const filteredActiveNurses = activeNurses.filter((nurse) => {
    const q = nurseSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      nurse.fullName.toLowerCase().includes(q) ||
      nurse.qualification.toLowerCase().includes(q) ||
      nurse.city.toLowerCase().includes(q) ||
      nurse.phone.includes(q) ||
      nurse.idNumber.toLowerCase().includes(q) ||
      (nurse.bio && nurse.bio.toLowerCase().includes(q))
    );
  });

  // Download document handler
  const handleDownloadDocument = (doc: Document) => {
    try {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name || `prescription-${doc.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Download Started', `Downloading ${doc.name}`, 'info');
    } catch (err) {
      console.error('Download error:', err);
      addToast('Download Failed', 'Could not download the file directly.', 'error');
    }
  };

  // Helper to highlight matching text in real-time as user types
  const highlightMatch = (text: string, query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return text;

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    if (parts.length === 1) return text;

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmed.toLowerCase() ? (
            <mark
              key={i}
              className="bg-teal-100 text-[#0e6b5c] font-bold rounded-xs px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Real-time Filter & Sort Enquiries by Status, Service, Date Range & Customer Details
  const filteredEnquiries = enquiries
    .filter((enq) => {
      // Stage / Status filter
      if (selectedStage !== 'ALL' && enq.stage !== selectedStage) {
        return false;
      }

      // Service type filter
      if (serviceFilter !== 'ALL' && enq.serviceId !== serviceFilter) {
        return false;
      }

      // Date range filter (using enq.createdAt or enq.preferredDate)
      const enqDate = enq.createdAt ? enq.createdAt.substring(0, 10) : '';
      if (dateFrom && enqDate && enqDate < dateFrom) {
        return false;
      }
      if (dateTo && enqDate && enqDate > dateTo) {
        return false;
      }

      // Real-time search filter: Customer Name, Phone, City, Email, ID
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const queryDigits = query.replace(/\D/g, '');
        const phoneDigits = enq.phone.replace(/\D/g, '');

        const matchName = enq.fullName.toLowerCase().includes(query);
        const matchPhone =
          enq.phone.toLowerCase().includes(query) ||
          (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
        const matchCity = enq.cityArea?.toLowerCase().includes(query) || false;
        const matchEmail = enq.email?.toLowerCase().includes(query) || false;
        const matchId = enq.id?.toLowerCase().includes(query) || false;

        if (!matchName && !matchPhone && !matchCity && !matchEmail && !matchId) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const toggleSelectAll = () => {
    if (filteredEnquiries.length === 0) return;
    const allFilteredIds = filteredEnquiries.map((e) => e.id);
    const areAllFilteredSelected = allFilteredIds.every((id) => selectedIds.includes(id));
    if (areAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isAllSelected =
    filteredEnquiries.length > 0 &&
    filteredEnquiries.every((e) => selectedIds.includes(e.id));

  const isSomeSelected =
    filteredEnquiries.some((e) => selectedIds.includes(e.id)) && !isAllSelected;

  const handleBulkStageChange = (newStage: EnquiryStage) => {
    if (selectedIds.length === 0) return;
    bulkUpdateEnquiriesStage(selectedIds, newStage);
    clearSelection();
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteEnquiries(selectedIds);
    clearSelection();
    setIsBulkDeleteModalOpen(false);
  };

  // Export Enquiries to Excel / CSV format
  const handleExportEnquiries = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredEnquiries : enquiries;
    if (dataset.length === 0) {
      addToast('No Data to Export', 'There are no enquiries to export.', 'warning');
      return;
    }

    const headers = [
      'Booking Ref ID',
      'Created Date & Time',
      'Patient Full Name',
      'Phone Number',
      'Email',
      'Required Service',
      'Current Stage',
      'City / Area Locality',
      'Preferred Start Date',
      'Patient Medical Condition / Message',
      'Assigned Nurse ID',
      'Assigned Nurse Name',
      'Internal Clinical Notes',
      'Documents Count'
    ];

    const rows = dataset.map((e) => {
      const srv = services.find((s) => s.id === e.serviceId);
      const nurse = nurses.find((n) => n.id === e.assignedNurseId);
      return [
        e.id,
        e.createdAt,
        e.fullName,
        e.phone,
        e.email || 'N/A',
        srv ? srv.title : e.serviceId,
        e.stage,
        e.cityArea,
        e.preferredDate || 'Immediate',
        e.message || '',
        e.assignedNurseId || 'Unassigned',
        nurse ? nurse.fullName : 'Unassigned',
        e.notes || '',
        e.documents?.length || 0
      ];
    });

    const nowStr = new Date().toISOString().substring(0, 10);
    const filename = `patient-enquiries-${onlyFiltered ? 'filtered' : 'all'}-${nowStr}.csv`;
    exportToCSV(filename, headers, rows);
    addToast('Export Generated', `Successfully downloaded ${dataset.length} enquiries to ${filename}.`, 'success');
    setIsExportDropdownOpen(false);
  };

  const getStageBadgeClass = (stage: EnquiryStage) => {
    switch (stage) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMED':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Document Upload Handler (Validated max 10MB, PDF, JPG, PNG)
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeEnquiry) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Check allowed extensions
    const validExtensions = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validExtensions.includes(file.type)) {
      addToast(
        'Invalid File Type',
        'Only PDF, JPG, or PNG files are permitted for prescription verification.',
        'error'
      );
      return;
    }

    // Check max size: 10 MB = 10 * 1024 * 1024 bytes
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      addToast(
        'File Exceeds 10 MB Limit',
        `Selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed is 10 MB.`,
        'error'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileUrl = reader.result as string;
      const fileType = file.type.includes('pdf') ? 'pdf' : file.type.includes('png') ? 'png' : 'jpg';

      addDocumentToEnquiry(activeEnquiry.id, {
        name: file.name,
        fileType,
        fileSize: file.size,
        fileUrl,
        uploadedBy: 'Admin Supervisor'
      });
    };
    reader.readAsDataURL(file);

    // Reset file input target
    e.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <PageSeo
        title="Admin - Enquiries Roster"
        description="Filter, review, assign nurses, and manage clinical prescription records for home care bookings."
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Patient Care Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {enquiries.length} bookings · Showing {filteredEnquiries.length} matches
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export to Excel / CSV Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export enquiries to Excel or CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-[#0f8672]" />
              <span>Export Excel / CSV</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isExportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsExportDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Export Enquiries Format
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportEnquiries(true)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Export Filtered Data</div>
                      <div className="text-[10px] text-slate-400">Current matches ({filteredEnquiries.length})</div>
                    </div>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportEnquiries(false)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Export All Records</div>
                      <div className="text-[10px] text-slate-400">Entire database ({enquiries.length})</div>
                    </div>
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsSheetsModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Sync to Google Sheets</span>
          </button>
        </div>
      </div>

      {/* Multi-Criteria Search & Filtering Interface */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        {/* Row 1: Search, Service Type, Stage, Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Real-time Search by Name, Phone, City, ID */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              aria-label="Search enquiries"
              placeholder="Search by patient name, phone, city, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Type Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                aria-label="Filter by clinical service"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full py-1 bg-transparent text-xs font-semibold focus-visible:outline-hidden cursor-pointer truncate"
              >
                <option value="ALL">All Care Services ({services.length})</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage / Status Filter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                aria-label="Filter by stage status"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full py-1 bg-transparent text-xs font-semibold focus-visible:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses ({enquiries.length})</option>
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                aria-label="Sort enquiries"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-1 bg-transparent text-xs font-semibold focus-visible:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Patient Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Date Range Filter & Quick Presets */}
        <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Date Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'this_month', label: 'This Month' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyDatePreset(preset.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  datePreset === preset.id && !dateFrom && !dateTo && preset.id === 'all'
                    ? 'bg-[#0f8672] text-white shadow-2xs'
                    : datePreset === preset.id && (dateFrom || dateTo)
                    ? 'bg-[#0f8672] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-slate-600">
              <span className="text-[10px] text-slate-400 font-semibold">From:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setDatePreset('all');
                }}
                className="bg-transparent text-xs text-slate-700 font-medium focus-visible:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-slate-600">
              <span className="text-[10px] text-slate-400 font-semibold">To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setDatePreset('all');
                }}
                className="bg-transparent text-xs text-slate-700 font-medium focus-visible:outline-hidden"
              />
            </div>

            {isAnyFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                title="Reset all search queries and active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-2 bg-[#effaf8] border border-teal-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-teal-900 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0f8672] shrink-0" />
            <span>Active Filters ({filteredEnquiries.length} matching):</span>
          </div>

          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>Keyword: "{searchTerm}"</span>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {serviceFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>Service: {services.find((s) => s.id === serviceFilter)?.title || serviceFilter}</span>
              <button
                type="button"
                onClick={() => setServiceFilter('ALL')}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStage !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>Stage: {selectedStage}</span>
              <button
                type="button"
                onClick={() => setSelectedStage('ALL')}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(dateFrom || dateTo) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>
                Date: {dateFrom || 'Any'} to {dateTo || 'Present'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setDatePreset('all');
                }}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="ml-auto text-xs font-semibold text-[#0f8672] hover:text-[#0e6b5c] underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Bulk Actions Floating Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#0f8672] text-white text-xs font-bold shadow-xs">
              {selectedIds.length}
            </span>
            <div>
              <span className="text-xs font-bold text-white block">
                {selectedIds.length} {selectedIds.length === 1 ? 'Enquiry' : 'Enquiries'} Selected
              </span>
              <span className="text-[11px] text-slate-400">
                Choose a workflow action to apply to all selected records
              </span>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 ml-2 cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkStageChange('CONTACTED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Mark all selected as Contacted"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Mark as Contacted</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStageChange('CONFIRMED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-teal-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Mark all selected as Confirmed"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Mark as Confirmed</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStageChange('COMPLETED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Mark all selected as Completed"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark as Completed</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-100 text-xs font-semibold rounded-xl border border-rose-800 transition-colors cursor-pointer"
              title="Delete all selected enquiries"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Enquiries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <div className="py-7 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                No matching enquiries found
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {searchTerm
                  ? `No customer records found matching name or phone "${searchTerm}".`
                  : 'No enquiries match the selected stage filter.'}
              </p>
            </div>
            {(searchTerm || selectedStage !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStage('ALL');
                }}
                className="px-4 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all visible enquiries"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-[#0f8672] focus:ring-[#0f8672] border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Patient / Contact</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">City / Area</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Assigned Nurse</th>
                  <th className="py-3.5 px-4">Docs</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => {
                  const srv = services.find((s) => s.id === enq.serviceId);
                  const assignedNurse = nurses.find((n) => n.id === enq.assignedNurseId);
                  const isRowSelected = selectedIds.includes(enq.id);

                  return (
                    <tr
                      key={enq.id}
                      className={`transition-colors cursor-pointer ${
                        isRowSelected
                          ? 'bg-teal-50/70 border-l-3 border-l-[#0f8672]'
                          : 'hover:bg-slate-50/60'
                      }`}
                      onClick={() => setViewEnquiryId(enq.id)}
                    >
                      <td
                        className="py-3.5 px-3 w-10 text-center"
                        onClick={(e) => toggleSelectOne(enq.id, e)}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select enquiry ${enq.id}`}
                          checked={isRowSelected}
                          onChange={(e) => toggleSelectOne(enq.id, e as any)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded text-[#0f8672] focus:ring-[#0f8672] border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                        #{enq.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {highlightMatch(enq.fullName, searchTerm)}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {highlightMatch(enq.phone, searchTerm)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">
                          {srv ? srv.title : 'Home Care'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {enq.cityArea}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeClass(
                            enq.stage
                          )}`}
                        >
                          {enq.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {assignedNurse ? (
                          <Link
                            to={`/admin/nurses?view=${assignedNurse.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 hover:text-teal-950 px-2 py-0.5 rounded transition-colors"
                            title="View Nurse Profile & Currently Assigned Cases"
                          >
                            <UserCheck className="w-3 h-3 text-[#0f8672]" />
                            <span>{assignedNurse.fullName}</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {enq.documents && enq.documents.length > 0 ? (
                          <span className="text-[11px] text-slate-600 font-medium">
                            {enq.documents.length} file{enq.documents.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewEnquiryId(enq.id)}
                            className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                            title="View Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEnquiry(enq)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(enq.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL VIEW DRAWER / MODAL */}
      {activeEnquiry && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{activeEnquiry.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeClass(
                      activeEnquiry.stage
                    )}`}
                  >
                    {activeEnquiry.stage}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeEnquiry.fullName}
                </h2>
              </div>
              <button
                onClick={() => setViewEnquiryId(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-8 flex-1">
              {/* Stage Selector */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Lifecycle Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as EnquiryStage[]).map(
                    (stg) => (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => updateEnquiryStage(activeEnquiry.id, stg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeEnquiry.stage === stg
                            ? 'bg-[#0f8672] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {stg}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Assign Nurse (with Real-time Search by Name, Qualification, City, Phone) */}
              <div className="p-4 bg-teal-50/70 border-2 border-teal-200/90 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0f8672]" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Assign Registered Nurse
                    </span>
                  </div>
                  {activeEnquiry.assignedNurseId && (
                    <button
                      type="button"
                      onClick={() => assignNurseToEnquiry(activeEnquiry.id, null)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Remove Assigned Nurse</span>
                    </button>
                  )}
                </div>

                {/* Currently Assigned Nurse Card */}
                {activeEnquiry.assignedNurseId ? (() => {
                  const assignedNurse = nurses.find((n) => n.id === activeEnquiry.assignedNurseId);
                  return (
                    <div className="p-3 bg-white border border-teal-300 rounded-xl shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-xs">
                            {assignedNurse?.fullName.charAt(0) || 'N'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>{assignedNurse?.fullName || 'Assigned Nurse'}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                                Assigned
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {assignedNurse?.qualification} · {assignedNurse?.city} · {assignedNurse?.yearsOfExperience} yrs exp.
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/admin/nurses?view=${activeEnquiry.assignedNurseId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f8672] hover:underline shrink-0"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })() : (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Search and select an active registered nurse to handle this patient. Assigning an active nurse advances stage to <strong>CONFIRMED</strong>.
                  </p>
                )}

                {/* Nurse Search Input in Enquiry View */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nurseSearchQuery}
                      onChange={(e) => setNurseSearchQuery(e.target.value)}
                      placeholder="Search nurse by name, qualification, city, phone..."
                      className="w-full pl-8.5 pr-8 py-2 bg-white border border-teal-300/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus-visible:outline-teal-700 shadow-2xs"
                    />
                    {nurseSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setNurseSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filtered Nurses Results List */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-teal-100 bg-white rounded-xl border border-teal-200/80 shadow-2xs">
                    {filteredActiveNurses.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500">
                        {activeNurses.length === 0
                          ? 'No active nurses currently on roster. Activate nurses in Nurses tab.'
                          : `No active nurses matched "${nurseSearchQuery}".`}
                      </div>
                    ) : (
                      filteredActiveNurses.map((nurse) => {
                        const isAssigned = activeEnquiry.assignedNurseId === nurse.id;
                        return (
                          <div
                            key={nurse.id}
                            className={`p-2.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                              isAssigned ? 'bg-teal-50/80' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                                <span>{nurse.fullName}</span>
                                <span className="text-[10px] text-teal-700 font-medium bg-teal-50 px-1.5 rounded">
                                  {nurse.city}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {nurse.qualification} · {nurse.yearsOfExperience} yrs exp · {nurse.phone}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                assignNurseToEnquiry(activeEnquiry.id, isAssigned ? null : nurse.id);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                                isAssigned
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                  : 'bg-[#0f8672] text-white hover:bg-[#0e6b5c] shadow-2xs'
                              }`}
                            >
                              {isAssigned ? 'Unassign' : 'Assign Nurse'}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Fields Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Telephone</span>
                  <a
                    href={`tel:${activeEnquiry.phone}`}
                    className="font-bold text-teal-800 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-teal-600" />
                    <span>{activeEnquiry.phone}</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="font-semibold text-slate-800 break-all">
                    {activeEnquiry.email || 'None provided'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Care Service</span>
                  <span className="font-semibold text-slate-800">
                    {services.find((s) => s.id === activeEnquiry.serviceId)?.title ||
                      activeEnquiry.serviceId}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Preferred Date</span>
                  <span className="font-semibold text-slate-800">
                    {activeEnquiry.preferredDate}
                  </span>
                </div>

                {/* Coverage City / Locality with Clickable Google Maps Button */}
                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Coverage City / Locality</span>
                    <span className="font-semibold text-slate-800">
                      {activeEnquiry.cityArea}
                    </span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeEnquiry.cityArea)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0f8672] hover:text-[#0e6b5c] bg-white hover:bg-teal-50 border border-teal-200 rounded-lg shadow-2xs transition-colors shrink-0"
                    title={`Open ${activeEnquiry.cityArea} on Google Maps`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#0f8672]" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">
                    Medical Condition & Patient Needs
                  </span>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {activeEnquiry.message || 'No additional notes provided.'}
                  </p>
                </div>

                {/* Dynamic / Custom Form Fields (configured in Form Builder) */}
                {activeEnquiry.customFields && Object.keys(activeEnquiry.customFields).length > 0 && (
                  <div className="col-span-2 p-3.5 bg-purple-50/60 border border-purple-200/80 rounded-xl space-y-2">
                    <span className="text-purple-900 font-bold block uppercase tracking-wider text-[11px]">
                      Additional Enquiry Form Questions (Custom Fields)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeEnquiry.customFields).map(([key, val]) => (
                        <div key={key} className="p-2 bg-white rounded-lg border border-purple-100">
                          <span className="text-slate-400 block text-[10px] capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-semibold text-slate-800 break-words">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Private Clinical Notes (Internal Only)
                  </label>
                  <button
                    type="button"
                    onClick={() => updateEnquiryNotes(activeEnquiry.id, currentNote)}
                    className="text-xs font-bold text-[#0f8672] hover:underline"
                  >
                    Save Note
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Record doctor contact details, family instructions, or equipment specifications..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              {/* DOCUMENTS SECTION (Restricted to CONFIRMED or COMPLETED) */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0f8672]" />
                      <span>Prescription & Medical Verification Documents</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Private medical files strictly for verifying doctor prescriptions (Max 10 MB).
                    </p>
                  </div>
                </div>

                {activeEnquiry.stage !== 'CONFIRMED' && activeEnquiry.stage !== 'COMPLETED' ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Document upload locked</span>
                      <span>
                        Documents can only be uploaded and managed once an enquiry advances to{' '}
                        <strong>CONFIRMED</strong> or <strong>COMPLETED</strong>.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Upload button */}
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-teal-50 hover:text-[#0f8672] border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Prescription (PDF, JPG, PNG &le; 10MB)</span>
                        <input
                          type="file"
                          accept=".pdf,image/jpeg,image/png"
                          onChange={handleDocumentUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Document list */}
                    {(!activeEnquiry.documents || activeEnquiry.documents.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No prescription documents uploaded yet for this confirmed enquiry.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {activeEnquiry.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:bg-slate-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileSpreadsheet className="w-4 h-4 text-[#0f8672] shrink-0" />
                              <div className="truncate">
                                <div className="font-semibold text-slate-900 truncate">
                                  {doc.name}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {formatFileSize(doc.fileSize)} · Uploaded{' '}
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors cursor-pointer"
                              >
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocument(doc)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                                title="Download document to device"
                              >
                                <Download className="w-3 h-3 text-[#0f8672]" />
                                <span>Download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  deleteDocumentFromEnquiry(activeEnquiry.id, doc.id)
                                }
                                className="p-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Delete document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage History Timeline */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Stage History Timeline</span>
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeEnquiry.stageHistory.map((hist, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#0f8672] ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{hist.stage}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(hist.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {hist.note && (
                        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                          {hist.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(activeEnquiry)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(activeEnquiry.id)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ENQUIRY MODAL */}
      {editingEnquiry && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Enquiry #{editingEnquiry.id}
              </h3>
              <button
                onClick={() => setEditingEnquiry(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={editingEnquiry.fullName}
                  onChange={(e) =>
                    setEditingEnquiry({ ...editingEnquiry, fullName: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editingEnquiry.phone}
                  onChange={(e) =>
                    setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Area</label>
                <input
                  type="text"
                  value={editingEnquiry.cityArea}
                  onChange={(e) =>
                    setEditingEnquiry({ ...editingEnquiry, cityArea: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={editingEnquiry.preferredDate}
                  onChange={(e) =>
                    setEditingEnquiry({ ...editingEnquiry, preferredDate: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message / Clinical Notes</label>
                <textarea
                  rows={3}
                  value={editingEnquiry.message}
                  onChange={(e) =>
                    setEditingEnquiry({ ...editingEnquiry, message: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingEnquiry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEnquiry(editingEnquiry.id, editingEnquiry);
                  setEditingEnquiry(null);
                }}
                className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Enquiry Record?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete enquiry #{confirmDeleteId}? This will also delete any attached clinical documents and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEnquiry(confirmDeleteId);
                  if (viewEnquiryId === confirmDeleteId) setViewEnquiryId(null);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRM MODAL */}
      {isBulkDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete {selectedIds.length} Selected Enquiries?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                You are about to permanently delete <strong>{selectedIds.length} enquiries</strong> along with any linked prescriptions and document uploads. This action cannot be reversed.
              </p>
            </div>

            {/* Selected names preview */}
            <div className="max-h-36 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
              {enquiries
                .filter((e) => selectedIds.includes(e.id))
                .slice(0, 10)
                .map((e) => (
                  <div key={e.id} className="text-[11px] text-slate-700 flex items-center justify-between">
                    <span className="font-semibold">{e.fullName}</span>
                    <span className="text-slate-400 font-mono">#{e.id}</span>
                  </div>
                ))}
              {selectedIds.length > 10 && (
                <div className="text-[10px] text-slate-400 text-center pt-1 italic">
                  + {selectedIds.length - 10} more enquiries
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                Delete {selectedIds.length} Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      <DocumentViewerModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        titlePrefix="Patient Prescription & Clinical Document"
      />

      {/* Google Sheets Sync Modal */}
      <GoogleSheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
};
