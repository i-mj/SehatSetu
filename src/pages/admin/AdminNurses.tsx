/**
 * Nurse Care - Admin Nurses Management
 * Complete CRUD operations, status filtering (PENDING, ACTIVE, INACTIVE), search,
 * masked government ID display in list, full ID on detail view, and status updates.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { Nurse, NurseStatus, NurseIdType, Document } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2,
  HeartPulse,
  Calendar,
  FileText,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  ShieldAlert,
  Syringe,
  Activity,
  Stethoscope,
  Upload,
  Download,
  Paperclip,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';
import { exportToCSV } from '../../utils/exportUtils';

export const AdminNurses: React.FC = () => {
  const {
    nurses,
    addNurse,
    updateNurse,
    updateNurseStatus,
    deleteNurse,
    addDocumentToNurse,
    deleteDocumentFromNurse,
    addToast,
    enquiries,
    services,
    assignNurseToEnquiry,
    updateEnquiryStage
  } = useApp();
  const [searchParams] = useSearchParams();

  // Search & Status filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [datePreset, setDatePreset] = useState<'all' | '30days' | '90days' | 'this_year'>('all');

  const applyDatePreset = (preset: 'all' | '30days' | '90days' | 'this_year') => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
    } else if (preset === '30days') {
      const d = new Date(Date.now() - 30 * 86400000);
      setDateFrom(d.toISOString().split('T')[0]);
      setDateTo(todayStr);
    } else if (preset === '90days') {
      const d = new Date(Date.now() - 90 * 86400000);
      setDateFrom(d.toISOString().split('T')[0]);
      setDateTo(todayStr);
    } else if (preset === 'this_year') {
      const firstDay = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      setDateFrom(firstDay);
      setDateTo(todayStr);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setServiceFilter('ALL');
    setDateFrom('');
    setDateTo('');
    setDatePreset('all');
  };

  const isAnyFilterActive =
    searchTerm.trim() !== '' ||
    statusFilter !== 'ALL' ||
    serviceFilter !== 'ALL' ||
    dateFrom !== '' ||
    dateTo !== '';

  // Modals state
  const [detailNurse, setDetailNurse] = useState<Nurse | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state for Add/Edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formQualification, setFormQualification] = useState('');
  const [formExperience, setFormExperience] = useState<number>(3);
  const [formIdType, setFormIdType] = useState<NurseIdType>('Aadhaar');
  const [formIdNumber, setFormIdNumber] = useState('');
  const [formStatus, setFormStatus] = useState<NurseStatus>('ACTIVE');
  const [formBio, setFormBio] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Quick assignment & past cases state
  const [quickAssignEnquiryId, setQuickAssignEnquiryId] = useState('');
  const [showCompletedCases, setShowCompletedCases] = useState(false);

  // Nurse Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Nurse Document Upload Form State (Detail View)
  const [docCategory, setDocCategory] = useState<string>('Nursing Registration Certificate');
  const [docCustomName, setDocCustomName] = useState<string>('');

  // Onboarding documents attached directly in Add Nurse modal
  const [formDocuments, setFormDocuments] = useState<Document[]>([]);
  const [addDocCategory, setAddDocCategory] = useState<string>('Nursing Registration Certificate');
  const [addDocCustomName, setAddDocCustomName] = useState<string>('');

  const handleOnboardingDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast('File too large', 'Please select a document under 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const cleanCategory = addDocCategory.trim();
      const finalName = addDocCustomName.trim()
        ? `${cleanCategory} - ${addDocCustomName.trim()}`
        : `${cleanCategory} (${file.name})`;

      const newDoc: Document = {
        id: 'doc-nurse-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: finalName,
        category: cleanCategory,
        ownerType: 'nurse',
        fileType: extension,
        fileSize: file.size,
        fileUrl: base64Url,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Clinical Administrator'
      };

      setFormDocuments((prev) => [...prev, newDoc]);
      setAddDocCustomName('');
      addToast('Document Attached', `${finalName} attached to nurse credentials.`, 'success');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFormDoc = (docId: string) => {
    setFormDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Download document handler
  const handleDownloadDocument = (doc: Document) => {
    try {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name || `nurse-doc-${doc.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Download Started', `Downloading ${doc.name}`, 'info');
    } catch (err) {
      console.error('Download error:', err);
      addToast('Download Failed', 'Could not download the file directly.', 'error');
    }
  };

  // Upload Nurse Document
  const handleNurseDocUpload = (e: React.ChangeEvent<HTMLInputElement>, nurseId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast('File too large', 'Please select a document under 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const cleanCategory = docCategory.trim();
      const finalName = docCustomName.trim()
        ? `${cleanCategory} - ${docCustomName.trim()}`
        : `${cleanCategory} (${file.name})`;

      addDocumentToNurse(nurseId, {
        ownerId: nurseId,
        ownerType: 'nurse',
        name: finalName,
        fileType: extension,
        fileSize: file.size,
        fileUrl: base64Url,
        uploadedBy: 'Clinical Administrator'
      });

      setDocCustomName('');
      addToast('Document Added', `${cleanCategory} successfully attached to nurse credentials.`, 'success');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  // Handle URL status parameter or direct view parameter (?view=nurse-1 or ?nurse=nurse-1)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
    const viewParam = searchParams.get('view') || searchParams.get('nurse');
    if (viewParam) {
      const match = nurses.find((n) => n.id === viewParam);
      if (match) {
        setDetailNurse(match);
      }
    }
  }, [searchParams, nurses]);

  const openAddModal = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormCity('New Delhi');
    setFormQualification('');
    setFormExperience(3);
    setFormIdType('Aadhaar');
    setFormIdNumber('');
    setFormStatus('ACTIVE');
    setFormBio('');
    setFormNotes('');
    setFormDocuments([]);
    setAddDocCustomName('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setFormName(nurse.fullName);
    setFormPhone(nurse.phone);
    setFormEmail(nurse.email);
    setFormCity(nurse.city);
    setFormQualification(nurse.qualification);
    setFormExperience(nurse.yearsOfExperience);
    setFormIdType(nurse.idType);
    setFormIdNumber(nurse.idNumber);
    setFormStatus(nurse.status);
    setFormBio(nurse.bio || '');
    setFormNotes(nurse.notes || '');
  };

  const handleSaveNurse = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNurse) {
      updateNurse(editingNurse.id, {
        fullName: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        city: formCity.trim(),
        qualification: formQualification.trim(),
        yearsOfExperience: Number(formExperience) || 0,
        idType: formIdType,
        idNumber: formIdNumber.trim(),
        status: formStatus,
        bio: formBio.trim(),
        notes: formNotes.trim()
      });
      setEditingNurse(null);
    } else {
      addNurse({
        fullName: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        city: formCity.trim(),
        qualification: formQualification.trim(),
        yearsOfExperience: Number(formExperience) || 0,
        idType: formIdType,
        idNumber: formIdNumber.trim(),
        status: formStatus,
        bio: formBio.trim(),
        notes: formNotes.trim(),
        documents: formDocuments
      });
      setIsAddModalOpen(false);
      setFormDocuments([]);
    }
  };

  // Mask ID Number (Show only last 4 digits)
  const maskIdNumber = (idStr: string): string => {
    if (!idStr) return '••••';
    const trimmed = idStr.trim();
    if (trimmed.length <= 4) return trimmed;
    const last4 = trimmed.slice(-4);
    return `•••• •••• ${last4}`;
  };

  // Filter Nurses by Status, Service Specialty, Date Range & Keyword
  const filteredNurses = nurses.filter((n) => {
    if (statusFilter !== 'ALL' && n.status !== statusFilter) {
      return false;
    }

    // Service / Clinical Specialty Filter
    if (serviceFilter !== 'ALL') {
      const sTerm = serviceFilter.toLowerCase();
      const qualLower = (n.qualification || '').toLowerCase();
      const bioLower = (n.bio || '').toLowerCase();
      const notesLower = (n.notes || '').toLowerCase();

      // Also check if currently assigned to a patient case with this service
      const hasAssignedService = enquiries.some((e) => {
        if (e.assignedNurseId !== n.id) return false;
        if (e.serviceId === serviceFilter) return true;
        const matchedService = services.find((s) => s.id === e.serviceId);
        return matchedService ? matchedService.title.toLowerCase().includes(sTerm) : false;
      });

      // Matches specialty or qualification
      const matchesSpec =
        qualLower.includes(sTerm) ||
        bioLower.includes(sTerm) ||
        notesLower.includes(sTerm) ||
        hasAssignedService;

      if (!matchesSpec) {
        return false;
      }
    }

    // Date Range Filter
    const nurseDate = n.createdAt ? n.createdAt.substring(0, 10) : '';
    if (dateFrom && nurseDate && nurseDate < dateFrom) {
      return false;
    }
    if (dateTo && nurseDate && nurseDate > dateTo) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const qDigits = q.replace(/\D/g, '');
      const phoneDigits = n.phone.replace(/\D/g, '');
      const matchName = n.fullName.toLowerCase().includes(q);
      const matchCity = n.city.toLowerCase().includes(q);
      const matchQual = n.qualification.toLowerCase().includes(q);
      const matchPhone = n.phone.includes(q) || (qDigits.length > 0 && phoneDigits.includes(qDigits));
      const matchId = n.idNumber?.toLowerCase().includes(q) || false;

      if (!matchName && !matchCity && !matchQual && !matchPhone && !matchId) {
        return false;
      }
    }
    return true;
  });

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Export Nurse Application and Roster Data to CSV / Excel
  const handleExportNurses = (onlyFiltered: boolean) => {
    const dataset = onlyFiltered ? filteredNurses : nurses;
    if (dataset.length === 0) {
      addToast('No Data to Export', 'There are no nurse records to export.', 'warning');
      return;
    }

    const headers = [
      'Nurse ID',
      'Registration Date',
      'Full Name',
      'Phone Number',
      'Email Address',
      'City / Region',
      'Availability Status',
      'Clinical Qualification & Diplomas',
      'Years of Experience',
      'Government ID Type',
      'Masked ID Number',
      'Active Patient Cases Assigned',
      'Professional Bio',
      'Internal Supervisory Notes',
      'Verified Documents Count'
    ];

    const rows = dataset.map((n) => {
      const activeAssignedCount = enquiries.filter(
        (e) => e.assignedNurseId === n.id && e.stage !== 'CANCELLED' && e.stage !== 'COMPLETED'
      ).length;

      return [
        n.id,
        n.createdAt,
        n.fullName,
        n.phone,
        n.email || 'N/A',
        n.city,
        n.status,
        n.qualification,
        n.yearsOfExperience,
        n.idType,
        n.idNumber,
        activeAssignedCount,
        n.bio || '',
        n.notes || '',
        n.documents?.length || 0
      ];
    });

    const nowStr = new Date().toISOString().substring(0, 10);
    const filename = `nurse-roster-export-${onlyFiltered ? 'filtered' : 'all'}-${nowStr}.csv`;
    exportToCSV(filename, headers, rows);
    addToast('Export Generated', `Successfully downloaded ${dataset.length} nurse records to ${filename}.`, 'success');
    setIsExportDropdownOpen(false);
  };

  const getStatusBadge = (status: NurseStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <UserCheck className="w-3 h-3 text-[#0f8672]" />
            <span>ACTIVE</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>PENDING</span>
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <UserX className="w-3 h-3 text-slate-500" />
            <span>INACTIVE</span>
          </span>
        );
    }
  };

  const getServiceIcon = (name?: string) => {
    switch (name) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-[#0f8672]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-[#0f8672]" />;
      case 'Syringe':
        return <Syringe className="w-4 h-4 text-[#0f8672]" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-[#0f8672]" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-[#0f8672]" />;
      default:
        return <Stethoscope className="w-4 h-4 text-[#0f8672]" />;
    }
  };

  const getEnquiryStageBadge = (stage: string) => {
    switch (stage) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f8672] animate-pulse" />
            <span>CONFIRMED · ON DUTY</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>CONTACTED</span>
          </span>
        );
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>NEW ENQUIRY</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{stage}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageSeo
        title="Admin - Nurse Roster"
        description="Roster management, clinical verification, background auditing, and nurse availability."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Registered Nurse Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {nurses.length} nurses · {nurses.filter((n) => n.status === 'ACTIVE').length} active for immediate deployment
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Export to Excel / CSV Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export nurse applications and roster to Excel or CSV"
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
                    Export Nurse Data
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportNurses(true)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Export Filtered Nurses</div>
                      <div className="text-[10px] text-slate-400">Current matches ({filteredNurses.length})</div>
                    </div>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportNurses(false)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Export All Nurses</div>
                      <div className="text-[10px] text-slate-400">Entire database ({nurses.length})</div>
                    </div>
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Nurse</span>
          </button>
        </div>
      </div>

      {/* Controls: Multi-Criteria Search, Specialty, Status & Date Range */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        {/* Row 1: Search, Service / Clinical Specialty, Status */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Real-time Search by Name, City, Qual, Phone, ID */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search nurse by name, city, specialty, ID..."
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

          {/* Service Specialty Filter */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                aria-label="Filter by clinical specialty"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full py-1 bg-transparent text-xs font-semibold focus-visible:outline-hidden cursor-pointer truncate"
              >
                <option value="ALL">All Clinical Specialties</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.title}
                  </option>
                ))}
                <option value="icu">ICU / Critical Care</option>
                <option value="elderly">Elderly Geriatric Care</option>
                <option value="palliative">Palliative & Oncology</option>
                <option value="baby">Neonatal / Baby Care</option>
                <option value="post-op">Post-Operative Recovery</option>
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                aria-label="Filter by nurse status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1 bg-transparent text-xs font-semibold focus-visible:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses ({nurses.length})</option>
                <option value="ACTIVE">ACTIVE ({nurses.filter((n) => n.status === 'ACTIVE').length})</option>
                <option value="PENDING">PENDING ({nurses.filter((n) => n.status === 'PENDING').length})</option>
                <option value="INACTIVE">INACTIVE ({nurses.filter((n) => n.status === 'INACTIVE').length})</option>
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
              <span>Registered Date:</span>
            </span>
            {[
              { id: 'all', label: 'All Time' },
              { id: '30days', label: 'Last 30 Days' },
              { id: '90days', label: 'Last 90 Days' },
              { id: 'this_year', label: 'This Year' }
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
            <span className="w-2 h-2 rounded-full bg-[#0f8672] animate-pulse" />
            <span>Active Filters ({filteredNurses.length} matching):</span>
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
              <span>Specialty: {services.find((s) => s.id === serviceFilter)?.title || serviceFilter}</span>
              <button
                type="button"
                onClick={() => setServiceFilter('ALL')}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>Status: {statusFilter}</span>
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(dateFrom || dateTo) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[11px] font-medium border border-teal-200 shadow-2xs">
              <span>
                Joined: {dateFrom || 'Any'} to {dateTo || 'Present'}
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

      {/* Nurses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredNurses.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No nurse records found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nurse Profile</th>
                  <th className="py-3.5 px-4">City / Region</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Currently Assigned</th>
                  <th className="py-3.5 px-4">Masked ID Number</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNurses.map((nurse) => {
                  const activeAssignedPatients = enquiries.filter(
                    (e) => e.assignedNurseId === nurse.id && e.stage !== 'CANCELLED' && e.stage !== 'COMPLETED'
                  );

                  return (
                    <tr
                      key={nurse.id}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => setDetailNurse(nurse)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{nurse.fullName}</div>
                        <div className="text-[11px] text-slate-500">{nurse.qualification}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {nurse.city}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {nurse.yearsOfExperience} yrs
                      </td>
                      <td className="py-3.5 px-4">
                        {activeAssignedPatients.length > 0 ? (
                          <div className="space-y-1.5">
                            {activeAssignedPatients.map((p) => {
                              const srv = services.find((s) => s.id === p.serviceId);
                              return (
                                <div
                                  key={p.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 text-[11px] font-semibold border border-teal-200/90 shadow-2xs"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#0f8672] animate-pulse" />
                                  <span>{p.fullName}</span>
                                  <span className="text-[10px] text-teal-700 font-normal">
                                    · {srv ? srv.title : 'Care'}
                                  </span>
                                  <span className="text-[10px] text-teal-600 font-mono">
                                    [{p.stage}]
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Available (Unassigned)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <span className="text-[10px] text-slate-400 block">{nurse.idType}</span>
                        <span>{maskIdNumber(nurse.idNumber)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(nurse.status)}
                      </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailNurse(nurse)}
                          className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                          title="View Full Profile (Unmasked ID)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(nurse)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Nurse"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(nurse.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Nurse"
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

      {/* NURSE DETAIL MODAL (SHOWS FULL UNMASKED ID & CURRENTLY ASSIGNED SECTION) */}
      {(() => {
        if (!detailNurse) return null;
        const activeDetailNurse =
          nurses.find((n) => n.id === detailNurse.id) || detailNurse;

        const assignedAll = enquiries.filter(
          (e) => e.assignedNurseId === activeDetailNurse.id
        );
        const currentlyAssignedPatients = assignedAll.filter(
          (e) => e.stage !== 'CANCELLED' && e.stage !== 'COMPLETED'
        );
        const completedPatients = assignedAll.filter(
          (e) => e.stage === 'COMPLETED'
        );

        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto border border-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0f8672] border border-teal-200 flex items-center justify-center font-bold text-xl shadow-xs">
                    {activeDetailNurse.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {activeDetailNurse.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {getStatusBadge(activeDetailNurse.status)}
                      <span className="text-xs text-slate-400">· {activeDetailNurse.qualification}</span>
                      <span className="text-xs text-slate-400">· {activeDetailNurse.city}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailNurse(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Status Toggles */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Roster Availability Status:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateNurseStatus(activeDetailNurse.id, 'ACTIVE');
                      setDetailNurse({ ...activeDetailNurse, status: 'ACTIVE' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeDetailNurse.status === 'ACTIVE'
                        ? 'bg-[#0f8672] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Active (Deployable)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateNurseStatus(activeDetailNurse.id, 'PENDING');
                      setDetailNurse({ ...activeDetailNurse, status: 'PENDING' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeDetailNurse.status === 'PENDING'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Pending Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateNurseStatus(activeDetailNurse.id, 'INACTIVE');
                      setDetailNurse({ ...activeDetailNurse, status: 'INACTIVE' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeDetailNurse.status === 'INACTIVE'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Inactive / On Leave
                  </button>
                </div>
              </div>

              {/* Contact & Professional Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 text-[11px]">Primary Phone</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#0f8672]" />
                    <span>{activeDetailNurse.phone}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 text-[11px]">Email Address</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 break-all">
                    <Mail className="w-3.5 h-3.5 text-[#0f8672]" />
                    <span>{activeDetailNurse.email}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 text-[11px]">Qualifications</span>
                  <span className="font-semibold text-slate-900">{activeDetailNurse.qualification}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 text-[11px]">Clinical Experience</span>
                  <span className="font-semibold text-slate-900">
                    {activeDetailNurse.yearsOfExperience} Years Certified Clinical Care
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-400 block mb-0.5 text-[11px]">Base Operational City</span>
                    <span className="font-semibold text-slate-900">{activeDetailNurse.city}</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeDetailNurse.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#0f8672] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shrink-0"
                    title={`View ${activeDetailNurse.city} on Google Maps`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                {/* CRITICAL: Full Unmasked Government ID Document */}
                <div className="sm:col-span-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Full Government Identity Document (Unmasked for Verification)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium">{activeDetailNurse.idType}:</span>
                    <span className="font-mono text-sm font-bold text-emerald-950 tracking-wider">
                      {activeDetailNurse.idNumber}
                    </span>
                  </div>
                </div>

                {/* NURSE OFFICIAL CREDENTIALS & VERIFIED DOCUMENTS */}
                <div className="sm:col-span-2 p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-[#0f8672]" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Nurse Verification Documents ({activeDetailNurse.documents?.length || 0})
                      </h4>
                    </div>
                    <span className="text-[11px] text-teal-800 font-medium">
                      PDF, JPG, PNG &le; 10MB
                    </span>
                  </div>

                  {/* Add Document Upload Form */}
                  <div className="p-3 bg-white rounded-xl border border-teal-200/80 shadow-2xs space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-700">Attach Document to Nurse Roster:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <div className="sm:col-span-5">
                        <select
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus-visible:outline-teal-700"
                        >
                          <option value="Nursing Registration Certificate">Nursing Registration Certificate</option>
                          <option value="Government ID Proof (Aadhaar/Passport)">Government ID Proof (Aadhaar/Passport)</option>
                          <option value="Degree / Diploma Certificate (B.Sc / GNM)">Degree / Diploma Certificate (B.Sc / GNM)</option>
                          <option value="Police Clearance Certificate">Police Clearance Certificate</option>
                          <option value="Medical Fitness & Immunization">Medical Fitness & Immunization</option>
                          <option value="Resume / Curriculum Vitae">Resume / Curriculum Vitae</option>
                          <option value="Other Clinical Certificate">Other Clinical Certificate</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={docCustomName}
                          onChange={(e) => setDocCustomName(e.target.value)}
                          placeholder="Optional label (e.g. DMC-2024-Verified)"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus-visible:outline-teal-700"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="w-full py-2 px-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Select & Upload</span>
                          <input
                            type="file"
                            accept=".pdf,image/jpeg,image/png,.doc,.docx"
                            onChange={(e) => handleNurseDocUpload(e, activeDetailNurse.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  {(!activeDetailNurse.documents || activeDetailNurse.documents.length === 0) ? (
                    <div className="p-3 bg-white/70 border border-dashed border-teal-200 rounded-xl text-center text-xs text-slate-500">
                      No documents attached yet for {activeDetailNurse.fullName}. Use the form above to upload council registration, diploma, or ID proof.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeDetailNurse.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2.5 bg-white border border-teal-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-teal-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0f8672] border border-teal-200 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                                <span>{doc.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {(doc.fileSize / 1024).toFixed(0)} KB · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(doc)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Download document to device"
                            >
                              <Download className="w-3 h-3 text-[#0f8672]" />
                              <span>Download</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteDocumentFromNurse(activeDetailNurse.id, doc.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
              </div>

              {/* ========================================================= */}
              {/* CURRENTLY ASSIGNED SECTION - DETAILED PATIENT & ENQUIRY VIEW */}
              {/* ========================================================= */}
              <div className="space-y-4 pt-2">
                {/* Section Header Banner */}
                <div className="p-4 bg-gradient-to-r from-teal-50/90 via-emerald-50/50 to-teal-50/80 border border-teal-200 rounded-2xl shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0f8672] text-white flex items-center justify-center shadow-xs shrink-0">
                        <HeartPulse className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                            Currently Assigned
                          </h4>
                          {currentlyAssignedPatients.length > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0f8672] text-white shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                              <span>Actively Handling ({currentlyAssignedPatients.length})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Available · No Active Patient</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Specific patient and clinical enquiry details that {activeDetailNurse.fullName} is currently actively handling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* When NO Patient is Currently Assigned */}
                {currentlyAssignedPatients.length === 0 ? (
                  <div className="p-5 bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          No Patient Currently Assigned
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeDetailNurse.fullName} has no active patient cases at this moment and is ready to be assigned an incoming enquiry.
                        </p>
                      </div>
                    </div>

                    {/* Quick Assign Dropdown for Active Nurse */}
                    {activeDetailNurse.status === 'ACTIVE' ? (
                      <div className="pt-3 border-t border-slate-200/80">
                        <label className="block text-xs font-bold text-teal-950 mb-1.5">
                          Assign an Open Patient Booking to {activeDetailNurse.fullName}:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={quickAssignEnquiryId}
                            onChange={(e) => setQuickAssignEnquiryId(e.target.value)}
                            className="flex-1 p-2.5 bg-white border border-teal-300 rounded-xl text-xs font-medium text-slate-800 focus-visible:outline-teal-700 shadow-2xs"
                          >
                            <option value="">
                              -- Select an unassigned patient booking ({enquiries.filter((e) => !e.assignedNurseId && e.stage !== 'COMPLETED' && e.stage !== 'CANCELLED').length} available) --
                            </option>
                            {enquiries
                              .filter((e) => !e.assignedNurseId && e.stage !== 'COMPLETED' && e.stage !== 'CANCELLED')
                              .map((e) => {
                                const srv = services.find((s) => s.id === e.serviceId);
                                return (
                                  <option key={e.id} value={e.id}>
                                    #{e.id} {e.fullName} · {srv?.title || 'Care'} · {e.cityArea}
                                  </option>
                                );
                              })}
                          </select>
                          <button
                            type="button"
                            disabled={!quickAssignEnquiryId}
                            onClick={() => {
                              if (quickAssignEnquiryId) {
                                assignNurseToEnquiry(quickAssignEnquiryId, activeDetailNurse.id);
                                setQuickAssignEnquiryId('');
                              }
                            }}
                            className="px-4 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
                          >
                            Assign to Nurse
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        Nurse status is currently <strong>{activeDetailNurse.status}</strong>. Activate this nurse to assign active patient bookings.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Cards for Each Currently Assigned Patient */
                  <div className="space-y-4">
                    {currentlyAssignedPatients.map((patient) => {
                      const srv = services.find((s) => s.id === patient.serviceId);
                      const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
                      const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                        patient.fullName
                      )},%20this%20is%20Nurse%20Care%20regarding%20your%20home%20nursing%20care%20with%20${encodeURIComponent(
                        activeDetailNurse.fullName
                      )}.`;

                      return (
                        <div
                          key={patient.id}
                          className="bg-white border-2 border-teal-300/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 hover:border-teal-400 transition-colors"
                        >
                          {/* Patient Header Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f8672] border border-teal-200 flex items-center justify-center font-bold text-sm shrink-0">
                                {patient.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-sm text-slate-900">
                                    {patient.fullName}
                                  </h5>
                                  <span className="font-mono text-xs text-slate-400">
                                    #{patient.id}
                                  </span>
                                  {getEnquiryStageBadge(patient.stage)}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Booking Date: {new Date(patient.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </div>
                              </div>
                            </div>

                            <Link
                              to={`/admin/enquiries?view=${patient.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0f8672] hover:text-[#0e6b5c] bg-teal-50/80 hover:bg-teal-100/80 rounded-xl border border-teal-200 transition-colors self-start sm:self-auto"
                            >
                              <span>View Patient Dossier</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Clinical Specs Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                            {/* Service */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Clinical Service
                              </span>
                              <div className="flex items-center gap-2 font-semibold text-slate-900">
                                {getServiceIcon(srv?.iconName)}
                                <span className="truncate">{srv?.title || 'Clinical Care'}</span>
                              </div>
                              {srv?.pricingNote && (
                                <span className="text-[10px] text-teal-700 block mt-0.5 font-medium truncate">
                                  {srv.pricingNote}
                                </span>
                              )}
                            </div>

                            {/* Location */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                  Patient Area / Address
                                </span>
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">{patient.cityArea}</span>
                                </div>
                              </div>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(patient.cityArea)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#0f8672] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shrink-0"
                                title="Open patient location on Google Maps"
                              >
                                <MapPin className="w-3 h-3" />
                                <span>Map</span>
                              </a>
                            </div>

                            {/* Schedule */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Care Schedule
                              </span>
                              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{patient.preferredDate || 'Immediate Clinical Need'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Direct Patient & Family Contacts */}
                          <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Phone className="w-3.5 h-3.5 text-[#0f8672]" />
                                <span className="font-mono font-semibold">{patient.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Mail className="w-3.5 h-3.5 text-[#0f8672]" />
                                <span className="font-medium">{patient.email}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${patient.phone}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                              >
                                <Phone className="w-3 h-3 text-[#0f8672]" />
                                <span>Call Patient</span>
                              </a>
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 shadow-2xs transition-colors"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Patient Medical Condition & Requirements */}
                          {patient.message && (
                            <div className="p-3.5 bg-slate-50/90 border border-slate-200/90 rounded-xl space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                <FileText className="w-3.5 h-3.5 text-[#0f8672]" />
                                <span>Patient Medical Condition & Specific Requirements</span>
                              </div>
                              <p className="text-xs text-slate-800 leading-relaxed italic">
                                "{patient.message}"
                              </p>
                            </div>
                          )}

                          {/* Coordinator Clinical & Supervisory Notes */}
                          {patient.notes && (
                            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                                <Award className="w-3.5 h-3.5 text-amber-700" />
                                <span>Supervisory Clinical & Shift Notes</span>
                              </div>
                              <p className="text-xs text-amber-950 leading-relaxed">
                                {patient.notes}
                              </p>
                            </div>
                          )}

                          {/* Uploaded Prescriptions & Documents */}
                          {patient.documents && patient.documents.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Uploaded Prescriptions & Clinical Records ({patient.documents.length}):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {patient.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#0f8672] shrink-0" />
                                    <span className="font-medium max-w-[180px] truncate">{doc.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ({(doc.fileSize / 1024).toFixed(0)} KB)
                                    </span>
                                    <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewDoc(doc)}
                                        className="p-1 text-teal-700 hover:text-teal-900 hover:bg-teal-100/60 rounded transition-colors cursor-pointer"
                                        title="Preview document"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadDocument(doc)}
                                        className="p-1 text-slate-600 hover:text-[#0f8672] hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                                        title="Download document to device"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Care Actions Toolbar */}
                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-400 text-[11px] font-semibold">Stage Action:</span>
                              {patient.stage !== 'COMPLETED' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateEnquiryStage(
                                      patient.id,
                                      'COMPLETED',
                                      `Care treatment completed by nurse ${activeDetailNurse.fullName}.`
                                    )
                                  }
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Mark Care Completed</span>
                                </button>
                              )}
                              {patient.stage !== 'CONFIRMED' && (
                                <button
                                  type="button"
                                  onClick={() => updateEnquiryStage(patient.id, 'CONFIRMED')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg transition-colors"
                                >
                                  Set to Confirmed
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => assignNurseToEnquiry(patient.id, null)}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 flex items-center gap-1"
                                title="Unassign patient and release nurse from duty"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Release from Duty</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Assign Additional Patient dropdown */}
                    {activeDetailNurse.status === 'ACTIVE' && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Assign Additional Patient to {activeDetailNurse.fullName}:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={quickAssignEnquiryId}
                            onChange={(e) => setQuickAssignEnquiryId(e.target.value)}
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                          >
                            <option value="">-- Select another open booking --</option>
                            {enquiries
                              .filter((e) => !e.assignedNurseId && e.stage !== 'COMPLETED' && e.stage !== 'CANCELLED')
                              .map((e) => {
                                const srv = services.find((s) => s.id === e.serviceId);
                                return (
                                  <option key={e.id} value={e.id}>
                                    #{e.id} {e.fullName} · {srv?.title || 'Care'} · {e.cityArea}
                                  </option>
                                );
                              })}
                          </select>
                          <button
                            type="button"
                            disabled={!quickAssignEnquiryId}
                            onClick={() => {
                              if (quickAssignEnquiryId) {
                                assignNurseToEnquiry(quickAssignEnquiryId, activeDetailNurse.id);
                                setQuickAssignEnquiryId('');
                              }
                            }}
                            className="px-3 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-2xs whitespace-nowrap"
                          >
                            Assign Additional
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Past Completed Assignments History */}
                {completedPatients.length > 0 && (
                  <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowCompletedCases((prev) => !prev)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Past Completed Patient Cases ({completedPatients.length})</span>
                      </div>
                      {showCompletedCases ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {showCompletedCases && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        {completedPatients.map((past) => {
                          const srv = services.find((s) => s.id === past.serviceId);
                          return (
                            <div
                              key={past.id}
                              className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600"
                            >
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {past.fullName} <span className="font-mono text-[10px] text-slate-400">#{past.id}</span>
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {srv?.title || 'Care'} · {past.cityArea}
                                </div>
                              </div>
                              <Link
                                to={`/admin/enquiries?view=${past.id}`}
                                className="text-xs font-semibold text-[#0f8672] hover:underline"
                              >
                                View Record →
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {activeDetailNurse.bio && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-400 block mb-0.5 text-[11px] font-semibold uppercase tracking-wider">
                    Clinical Biography
                  </span>
                  <p className="text-slate-700 leading-relaxed">{activeDetailNurse.bio}</p>
                </div>
              )}

              {activeDetailNurse.notes && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-amber-900 text-xs">
                  <span className="font-bold block mb-0.5 text-[11px] uppercase tracking-wider">
                    Admin Supervisory Notes
                  </span>
                  <p>{activeDetailNurse.notes}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    openEditModal(activeDetailNurse);
                    setDetailNurse(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-800 transition-colors"
                >
                  Edit Nurse Profile
                </button>
                <button
                  type="button"
                  onClick={() => setDetailNurse(null)}
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ADD / EDIT NURSE MODAL */}
      {(isAddModalOpen || editingNurse) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingNurse ? `Edit Nurse: ${editingNurse.fullName}` : 'Add New Nurse to Roster'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingNurse(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNurse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years Experience</label>
                  <input
                    type="number"
                    min={0}
                    value={formExperience}
                    onChange={(e) => setFormExperience(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualification *</label>
                <input
                  type="text"
                  required
                  value={formQualification}
                  onChange={(e) => setFormQualification(e.target.value)}
                  placeholder="e.g. B.Sc Nursing, Critical Care Certified"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Document Type</label>
                  <select
                    value={formIdType}
                    onChange={(e) => setFormIdType(e.target.value as NurseIdType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Number *</label>
                  <input
                    type="text"
                    required
                    value={formIdNumber}
                    onChange={(e) => setFormIdNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roster Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as NurseStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="ACTIVE">ACTIVE (Eligible for assignment)</option>
                  <option value="PENDING">PENDING (Awaiting background check)</option>
                  <option value="INACTIVE">INACTIVE (On leave / Sabbatical)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Biography</label>
                <textarea
                  rows={2}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Onboarding Documents Upload (For New Nurse Registration) */}
              {!editingNurse && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#0f8672]" />
                      <span>Nurse Onboarding Documents (Optional)</span>
                    </span>
                    {formDocuments.length > 0 && (
                      <span className="px-2 py-0.5 bg-teal-100 text-[#0f8672] text-[10px] font-bold rounded-full">
                        {formDocuments.length} added
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Upload degrees, nursing council certificates, IDs, or police verification documents.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Category</label>
                      <select
                        value={addDocCategory}
                        onChange={(e) => setAddDocCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Nursing Registration Certificate">Registration Certificate</option>
                        <option value="Degree / Diploma Certificate">Degree / Diploma</option>
                        <option value="Government Photo ID">Govt Photo ID</option>
                        <option value="Police Verification Certificate">Police Verification</option>
                        <option value="Experience Certificate">Experience Certificate</option>
                        <option value="BLS / ACLS Certification">BLS / ACLS Certification</option>
                        <option value="Other Clinical Certificate">Other Certificate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Custom Label (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Council Renewal 2026"
                        value={addDocCustomName}
                        onChange={(e) => setAddDocCustomName(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/30 rounded-xl transition-colors text-xs font-semibold text-[#0f8672]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Attach Credential File</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleOnboardingDocUpload}
                      className="hidden"
                    />
                  </label>

                  {formDocuments.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {formDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-3.5 h-3.5 text-[#0f8672] shrink-0" />
                            <span className="truncate font-medium text-slate-800">{doc.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFormDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingNurse(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Nurse Profile
                </button>
              </div>
            </form>
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
              <h3 className="text-base font-bold text-slate-900">Remove Nurse from Roster?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this nurse record? They will no longer be available for patient assignment.
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
                  deleteNurse(confirmDeleteId);
                  if (detailNurse?.id === confirmDeleteId) setDetailNurse(null);
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
      {/* DOCUMENT PREVIEW MODAL */}
      <DocumentViewerModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        titlePrefix="Nurse Credential & Registration Document"
      />
    </div>
  );
};
