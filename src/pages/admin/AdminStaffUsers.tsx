/**
 * Nurse Care - Staff Records & Personnel Management
 * Route: /admin/staff
 * 
 * Access Policy:
 * - Strictly only two designated System Administrators have login access to the console.
 * - Staff data is maintained for internal operations, shift scheduling, contact records,
 *   qualifications, and healthcare registry management. Staff members do not have system access.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { StaffDepartment, StaffRecord, StaffShift, StaffStatus, Document, StaffLoginRole } from '../../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  UserCheck,
  Phone,
  Mail,
  Clock,
  Briefcase,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Filter,
  Trash2,
  Edit2,
  FileText,
  Lock,
  ExternalLink,
  Calendar,
  AlertOctagon,
  Key,
  Download,
  Upload,
  Paperclip,
  Eye,
  DollarSign
} from 'lucide-react';
import { DocumentViewerModal } from '../../components/common/DocumentViewerModal';

export const AdminStaffUsers: React.FC = () => {
  const {
    adminUsers,
    currentAdminUser,
    staffRecords,
    addStaffRecord,
    updateStaffRecord,
    deleteStaffRecord,
    addDocumentToStaff,
    deleteDocumentFromStaff,
    toggleStaffLogin,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [formEmpCode, setFormEmpCode] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formDepartment, setFormDepartment] = useState<StaffDepartment>('Nursing Care');
  const [formDesignation, setFormDesignation] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formShift, setFormShift] = useState<StaffShift>('Day Shift (8 AM - 8 PM)');
  const [formStatus, setFormStatus] = useState<StaffStatus>('ACTIVE');
  const [formQualification, setFormQualification] = useState('');
  const [formCouncilReg, setFormCouncilReg] = useState('');
  const [formEmergencyContact, setFormEmergencyContact] = useState('');
  const [formJoinDate, setFormJoinDate] = useState(new Date().toISOString().substring(0, 10));
  const [formNotes, setFormNotes] = useState('');
  const [formCanLogin, setFormCanLogin] = useState(false);
  const [formLoginRole, setFormLoginRole] = useState<StaffLoginRole>('STAFF');
  const [formPassword, setFormPassword] = useState('staff123');

  // Staff Dossier & Document Management State
  const [dossierStaffId, setDossierStaffId] = useState<string | null>(null);
  const [staffDocCategory, setStaffDocCategory] = useState<string>('Government Identity Proof');
  const [staffDocCustomName, setStaffDocCustomName] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const dossierStaff = staffRecords.find((s) => s.id === dossierStaffId);

  // Download document handler
  const handleDownloadDocument = (doc: Document) => {
    try {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name || `staff-doc-${doc.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Download Started', `Downloading ${doc.name}`, 'info');
    } catch (err) {
      console.error('Download error:', err);
      addToast('Download Failed', 'Could not download the file directly.', 'error');
    }
  };

  // Upload Staff Document
  const handleStaffDocUpload = (e: React.ChangeEvent<HTMLInputElement>, staffId: string) => {
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
      const cleanCategory = staffDocCategory.trim();
      const finalName = staffDocCustomName.trim()
        ? `${cleanCategory} - ${staffDocCustomName.trim()}`
        : `${cleanCategory} (${file.name})`;

      addDocumentToStaff(staffId, {
        ownerId: staffId,
        ownerType: 'staff',
        name: finalName,
        fileType: extension,
        fileSize: file.size,
        fileUrl: base64Url,
        uploadedBy: 'Clinical Administrator'
      });

      setStaffDocCustomName('');
      addToast('Document Added', `${cleanCategory} successfully attached to personnel record.`, 'success');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    const nextCode = `STF-${100 + staffRecords.length + 1}`;
    setFormEmpCode(nextCode);
    setFormFullName('');
    setFormDepartment('Nursing Care');
    setFormDesignation('Registered Staff Nurse');
    setFormPhone('');
    setFormEmail('');
    setFormShift('Day Shift (8 AM - 8 PM)');
    setFormStatus('ACTIVE');
    setFormQualification('B.Sc Nursing / GNM');
    setFormCouncilReg('');
    setFormEmergencyContact('');
    setFormJoinDate(new Date().toISOString().substring(0, 10));
    setFormNotes('');
    setFormCanLogin(false);
    setFormLoginRole('STAFF');
    setFormPassword('staff123');
    setIsAddModalOpen(true);
  };

  const openEditModal = (staff: StaffRecord) => {
    setEditingStaff(staff);
    setFormEmpCode(staff.employeeCode);
    setFormFullName(staff.fullName);
    setFormDepartment(staff.department);
    setFormDesignation(staff.designation);
    setFormPhone(staff.phone);
    setFormEmail(staff.email);
    setFormShift(staff.shift);
    setFormStatus(staff.status);
    setFormQualification(staff.qualification);
    setFormCouncilReg(staff.councilRegistrationNo || '');
    setFormEmergencyContact(staff.emergencyContact || '');
    setFormJoinDate(staff.joinDate || '');
    setFormNotes(staff.notes || '');
    setFormCanLogin(staff.canLogin || false);
    setFormLoginRole(
      staff.loginRole ||
      (staff.email?.toLowerCase().includes('finance') || staff.designation.toLowerCase().includes('finance')
        ? 'FINANCE'
        : 'STAFF')
    );
    setFormPassword(staff.password || (staff.loginRole === 'FINANCE' ? 'finance123' : 'staff123'));
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formPhone.trim()) {
      addToast('Validation Error', 'Full name and phone number are required.', 'error');
      return;
    }

    addStaffRecord({
      employeeCode: formEmpCode.trim() || `STF-${Date.now().toString().slice(-3)}`,
      fullName: formFullName.trim(),
      department: formDepartment,
      designation: formDesignation.trim() || 'Care Staff',
      phone: formPhone.trim(),
      email: formEmail.trim(),
      shift: formShift,
      status: formStatus,
      qualification: formQualification.trim(),
      councilRegistrationNo: formCouncilReg.trim() || undefined,
      emergencyContact: formEmergencyContact.trim() || undefined,
      joinDate: formJoinDate || new Date().toISOString().substring(0, 10),
      notes: formNotes.trim() || undefined,
      canLogin: formCanLogin,
      loginRole: formCanLogin ? formLoginRole : undefined,
      password: formCanLogin ? (formPassword.trim() || 'staff123') : undefined
    });

    setIsAddModalOpen(false);
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!formFullName.trim() || !formPhone.trim()) {
      addToast('Validation Error', 'Full name and phone number are required.', 'error');
      return;
    }

    updateStaffRecord(editingStaff.id, {
      employeeCode: formEmpCode.trim(),
      fullName: formFullName.trim(),
      department: formDepartment,
      designation: formDesignation.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      shift: formShift,
      status: formStatus,
      qualification: formQualification.trim(),
      councilRegistrationNo: formCouncilReg.trim() || undefined,
      emergencyContact: formEmergencyContact.trim() || undefined,
      joinDate: formJoinDate,
      notes: formNotes.trim() || undefined,
      canLogin: formCanLogin,
      loginRole: formCanLogin ? formLoginRole : undefined,
      password: formCanLogin ? (formPassword.trim() || 'staff123') : undefined
    });

    setEditingStaff(null);
  };

  // Filtered staff records
  const filteredStaff = staffRecords.filter((staff) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      staff.fullName.toLowerCase().includes(q) ||
      staff.employeeCode.toLowerCase().includes(q) ||
      staff.designation.toLowerCase().includes(q) ||
      staff.phone.includes(q) ||
      staff.email.toLowerCase().includes(q);

    const matchesDepartment = departmentFilter === 'ALL' || staff.department === departmentFilter;
    const matchesShift = shiftFilter === 'ALL' || staff.shift === shiftFilter;

    return matchesSearch && matchesDepartment && matchesShift;
  });

  const activeAdmins = adminUsers.slice(0, 2);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <PageSeo
        title="Staff Records & Access Governance - Nurse Care Admin"
        description="Internal staff directory, personnel management, and system administration access control."
      />

      {/* Page Title & System Policy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[#0f8672] text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Access Control & Personnel Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff Directory & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Maintain internal employee records, shift assignments, and credentials. Only the 2 designated Administrators have system access.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Record</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: STRICTLY 2 SYSTEM ADMINISTRATORS (CALLOUT & CREDENTIALS CARD) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Two Authorized System Administrators (2/2)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Privileged Console Access
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In accordance with clinical safety governance, <strong>only these 2 administrator accounts</strong> possess login credentials to access the admin console, manage bookings, and edit site settings. All staff records below are managed internally for operations and dispatch.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/admin/account"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Manage Admin Account</span>
            </Link>
          </div>
        </div>

        {/* 2 Admins Visual Roster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/70">
          {activeAdmins.map((admin, idx) => (
            <div
              key={admin.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#0f8672] text-white flex items-center justify-center font-bold text-base shadow-inner shrink-0">
                  {admin.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{admin.fullName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                      Admin 0{idx + 1}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{admin.designation || 'System Administrator'}</div>
                  <div className="text-[11px] text-teal-300/90 font-mono mt-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-teal-400 shrink-0" />
                    <span>{admin.email}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Authorized</span>
                </span>
                <div className="text-[10px] text-slate-400 mt-1">Full System Access</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: STAFF PERSONNEL RECORDS DIRECTORY */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Metric Summary Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Staff Records</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{staffRecords.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Internal personnel registry</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Active On Duty</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {staffRecords.filter((s) => s.status === 'ACTIVE').length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Assigned to field or desk</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">On Leave</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {staffRecords.filter((s) => s.status === 'ON_LEAVE').length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Scheduled time-off</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Login Privileges</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">0 <span className="text-xs font-normal text-slate-500">/ {staffRecords.length}</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Records only (no console access)</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by employee code, name, designation, or phone..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus-visible:outline-teal-700"
            >
              <option value="ALL">All Departments</option>
              <option value="Nursing Care">Nursing Care</option>
              <option value="Elderly Attendant">Elderly Attendant</option>
              <option value="Clinical Triage">Clinical Triage</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Administrative Desk">Administrative Desk</option>
            </select>

            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus-visible:outline-teal-700"
            >
              <option value="ALL">All Shifts</option>
              <option value="Day Shift (8 AM - 8 PM)">Day Shift</option>
              <option value="Night Shift (8 PM - 8 AM)">Night Shift</option>
              <option value="24h Live-in">24h Live-in</option>
              <option value="Rotational">Rotational</option>
              <option value="On-Call">On-Call</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Shift Schedule</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Login Access</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No staff personnel records found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add a new record.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-xs shrink-0">
                            {staff.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{staff.fullName}</div>
                            <div className="text-[11px] font-mono text-slate-500">{staff.employeeCode}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Designation */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{staff.designation}</div>
                        <div className="text-[11px] text-teal-800 font-medium inline-block mt-0.5 px-2 py-0.5 bg-teal-50 rounded-md">
                          {staff.department}
                        </div>
                      </td>

                      {/* Shift */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{staff.shift}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{staff.phone}</span>
                        </div>
                        {staff.email && (
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{staff.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Staff Login Access Status */}
                      <td className="py-3.5 px-4">
                        {staff.canLogin ? (
                          <div className="space-y-1">
                            {staff.loginRole === 'FINANCE' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <DollarSign className="w-3 h-3 text-amber-600" />
                                <span>Finance Staff</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                <Key className="w-3 h-3 text-purple-600" />
                                <span>Clinical Staff</span>
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400 font-medium">
                              {staff.loginRole === 'FINANCE' ? 'Finances & Billing' : 'Nurses & Enquiries'}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 bg-slate-100">
                            No Login
                          </span>
                        )}
                      </td>

                      {/* Staff Documents */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setDossierStaffId(staff.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0f8672] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                          title="Manage staff documents and credentials"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{staff.documents?.length || 0} Docs</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            staff.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : staff.status === 'ON_LEAVE'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {staff.status === 'ACTIVE' ? 'Active' : staff.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setDossierStaffId(staff.id)}
                            className="p-1.5 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Manage Staff Documents & Dossier"
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(staff)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Staff Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(staff.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Staff Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STAFF PERSONNEL RECORD */}
      {/* ========================================================================= */}
      {(isAddModalOpen || editingStaff) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingStaff ? 'Edit Staff Personnel Record' : 'Add New Staff Record'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Records are maintained for internal management and shift coordination only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStaff(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Employee Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formEmpCode}
                    onChange={(e) => setFormEmpCode(e.target.value)}
                    placeholder="e.g. STF-106"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="e.g. Sister Meera Nair"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value as StaffDepartment)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
                  >
                    <option value="Nursing Care">Nursing Care</option>
                    <option value="Elderly Attendant">Elderly Attendant</option>
                    <option value="Clinical Triage">Clinical Triage</option>
                    <option value="Field Operations">Field Operations</option>
                    <option value="Administrative Desk">Administrative Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Senior Critical Care Nurse"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="staff@nursecare.org"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Shift Timing <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value as StaffShift)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
                  >
                    <option value="Day Shift (8 AM - 8 PM)">Day Shift (8 AM - 8 PM)</option>
                    <option value="Night Shift (8 PM - 8 AM)">Night Shift (8 PM - 8 AM)</option>
                    <option value="24h Live-in">24h Live-in</option>
                    <option value="Rotational">Rotational</option>
                    <option value="On-Call">On-Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Employment Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StaffStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Qualifications & Diplomas
                  </label>
                  <input
                    type="text"
                    value={formQualification}
                    onChange={(e) => setFormQualification(e.target.value)}
                    placeholder="e.g. B.Sc Nursing, Critical Care Cert."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Council Registration No. (if nurse)
                  </label>
                  <input
                    type="text"
                    value={formCouncilReg}
                    onChange={(e) => setFormCouncilReg(e.target.value)}
                    placeholder="e.g. DNC-RN-48921"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formEmergencyContact}
                    onChange={(e) => setFormEmergencyContact(e.target.value)}
                    placeholder="e.g. +91 98765 00000 (Spouse)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Date Joined
                  </label>
                  <input
                    type="date"
                    value={formJoinDate}
                    onChange={(e) => setFormJoinDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Internal Operations Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Clinical competencies, verified ID status, preferred zones..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              {/* Staff Login Configuration (Clinical Desk vs Finance Desk) */}
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#0f8672]" />
                    <span className="font-bold text-slate-900 text-xs">
                      Console Login Access (Restricted Role)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formCanLogin}
                      onChange={(e) => setFormCanLogin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0f8672]"></div>
                  </label>
                </div>

                {formCanLogin ? (
                  <div className="space-y-3 pt-2 border-t border-teal-200/60">
                    {/* Role Desk Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Assigned Login Desk & Permission Scope <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            formLoginRole === 'STAFF'
                              ? 'bg-purple-50/80 border-purple-300 text-purple-950 ring-1 ring-purple-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="loginRole"
                            value="STAFF"
                            checked={formLoginRole === 'STAFF'}
                            onChange={() => setFormLoginRole('STAFF')}
                            className="mt-0.5 text-purple-600 focus:ring-purple-500"
                          />
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-purple-600" />
                              <span>Clinical Staff Desk</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                              Authorized for <strong>Patient Enquiries & Nurses</strong> management only.
                            </div>
                          </div>
                        </label>

                        <label
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            formLoginRole === 'FINANCE'
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="loginRole"
                            value="FINANCE"
                            checked={formLoginRole === 'FINANCE'}
                            onChange={() => setFormLoginRole('FINANCE')}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Finance & Billing Desk</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                              Authorized for <strong>Finances, Invoices, Fees & Refunds</strong> only.
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Login Password for {formEmail || 'Staff'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder={formLoginRole === 'FINANCE' ? 'e.g. finance123' : 'e.g. staff123'}
                        className="w-full px-3 py-2 bg-white border border-teal-300 rounded-xl font-mono text-xs text-slate-900 focus-visible:outline-teal-700 shadow-2xs"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Staff record is maintained for internal directory purposes. Enable the toggle above to allow console login.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingStaff ? 'Save Personnel Record' : 'Create Staff Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900">Delete Staff Record?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this staff personnel record from the directory?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaffRecord(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: STAFF DOSSIER & DOCUMENTS MANAGEMENT (REQUEST 5 & REQUEST 8) */}
      {/* ========================================================================= */}
      {dossierStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-[#0f8672] flex items-center justify-center font-bold text-sm shrink-0">
                  {dossierStaff.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{dossierStaff.fullName}</h3>
                    <span className="font-mono text-xs text-slate-400">({dossierStaff.employeeCode})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0f8672] border border-teal-200">
                      {dossierStaff.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dossierStaff.designation} · {dossierStaff.shift}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDossierStaffId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Login Credentials & Access Control */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Staff Console Access Permissions
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !dossierStaff.canLogin;
                    toggleStaffLogin(dossierStaff.id, nextState, dossierStaff.password || 'staff123');
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    dossierStaff.canLogin
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-2xs'
                  }`}
                >
                  {dossierStaff.canLogin ? 'Revoke Login Access' : 'Enable Staff Login'}
                </button>
              </div>

              {dossierStaff.canLogin ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-purple-200">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Authorized Login Email:</span>
                    <span className="font-semibold text-slate-800 font-mono break-all">{dossierStaff.email}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Current Password:</span>
                      <span className="font-mono font-bold text-purple-900">{dossierStaff.password || 'staff123'}</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">
                      Nurses & Enquiries Only
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-purple-900">
                  This staff member currently has <strong>no login credentials</strong>. Click "Enable Staff Login" above to grant them access to manage nurses and enquiries.
                </p>
              )}
            </div>

            {/* Section 2: Staff Documents & Records (Request 5) */}
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#0f8672]" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Staff Verification Documents ({dossierStaff.documents?.length || 0})
                  </h4>
                </div>
                <span className="text-[11px] text-teal-800 font-medium">PDF, JPG, PNG &le; 10MB</span>
              </div>

              {/* Upload Document Form */}
              <div className="p-3 bg-white rounded-xl border border-teal-200/90 shadow-2xs space-y-2.5">
                <div className="text-[11px] font-bold text-slate-700">Attach Document to Personnel Record:</div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-5">
                    <select
                      value={staffDocCategory}
                      onChange={(e) => setStaffDocCategory(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus-visible:outline-teal-700"
                    >
                      <option value="Government Identity Proof">Government Identity Proof (Aadhaar/PAN)</option>
                      <option value="Appointment Letter">Employment Appointment Letter</option>
                      <option value="Nursing / Healthcare Council Reg">Nursing / Healthcare Council Reg</option>
                      <option value="Degree / Diploma Certificate">Degree / Diploma Certificate</option>
                      <option value="Police Verification Clearance">Police Verification Clearance</option>
                      <option value="Experience & Relieving Certificate">Experience & Relieving Certificate</option>
                      <option value="Other Official Document">Other Official Document</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={staffDocCustomName}
                      onChange={(e) => setStaffDocCustomName(e.target.value)}
                      placeholder="Optional label (e.g. Aadhaar-Verified)"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus-visible:outline-teal-700"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="w-full py-2 px-3 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept=".pdf,image/jpeg,image/png,.doc,.docx"
                        onChange={(e) => handleStaffDocUpload(e, dossierStaff.id)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              {(!dossierStaff.documents || dossierStaff.documents.length === 0) ? (
                <div className="p-4 bg-white/70 border border-dashed border-teal-200 rounded-xl text-center text-xs text-slate-500">
                  No verification documents attached yet for {dossierStaff.fullName}. Upload appointment letter, ID proof, or educational certificate above.
                </div>
              ) : (
                <div className="space-y-2">
                  {dossierStaff.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-white border border-teal-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0f8672] border border-teal-200 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">
                            {doc.name}
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
                          onClick={() => deleteDocumentFromStaff(dossierStaff.id, doc.id)}
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

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDossierStaffId(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      <DocumentViewerModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        titlePrefix="Staff Personnel & Qualification Document"
      />
    </div>
  );
};
