import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Eye,
  Download,
  Activity,
  UserCheck,
  Receipt,
  FileCheck2,
  Building,
  HeartPulse,
  ExternalLink,
  Printer,
  CreditCard,
  Plus
} from 'lucide-react';
import { Enquiry, Nurse, ServiceItem, Document, CareBilling } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { InvoiceStatementModal } from './InvoiceStatementModal';
import { useApp } from '../../context/AppContext';

interface PatientProfileModalProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  nurses?: Nurse[];
  services?: ServiceItem[];
  billings?: CareBilling[];
  onSelectForBilling?: (enquiry: Enquiry) => void;
  isBillingContext?: boolean;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  enquiry,
  onClose,
  nurses = [],
  services = [],
  billings: propBillings,
  onSelectForBilling,
  isBillingContext = false
}) => {
  const { billings: contextBillings } = useApp();
  const allBillings = propBillings || contextBillings || [];

  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Document | null>(null);
  const [selectedBillingForInvoice, setSelectedBillingForInvoice] = useState<CareBilling | null>(null);

  // Match all invoices / bills belonging to this specific patient
  const patientBillings = useMemo(() => {
    if (!enquiry) return [];
    return allBillings.filter((b) => {
      const matchId = b.enquiryId === enquiry.id;
      const cleanEnquiryPhone = enquiry.phone ? enquiry.phone.replace(/[^0-9]/g, '') : '';
      const cleanBillPhone = b.phone ? b.phone.replace(/[^0-9]/g, '') : '';
      const matchPhone = cleanEnquiryPhone.length >= 8 && cleanBillPhone.length >= 8 && (
        cleanEnquiryPhone.includes(cleanBillPhone) || cleanBillPhone.includes(cleanEnquiryPhone)
      );
      const matchName = b.patientName && enquiry.fullName && b.patientName.trim().toLowerCase() === enquiry.fullName.trim().toLowerCase();
      return matchId || matchPhone || matchName;
    });
  }, [enquiry, allBillings]);

  const totalBilled = patientBillings.reduce((sum, b) => sum + (b.totalCharges || 0), 0);
  const totalPaid = patientBillings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  const totalDue = patientBillings.reduce((sum, b) => sum + (b.balanceDue || 0), 0);

  if (!enquiry) return null;

  const assignedNurse = enquiry.assignedNurseId
    ? nurses.find((n) => n.id === enquiry.assignedNurseId)
    : null;

  const matchedService = services.find((s) => s.id === enquiry.serviceId);
  const serviceName = matchedService ? matchedService.title : enquiry.serviceId || 'General Clinical Care';

  const handleDownloadDoc = (doc: Document) => {
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name || 'document.pdf';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-900 to-[#0f8672] text-white p-5 sm:p-6 shrink-0 relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-4 pr-10">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                  {enquiry.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {enquiry.fullName}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-white/20 text-white border-white/30`}
                    >
                      {enquiry.stage}
                    </span>
                  </div>
                  <p className="text-xs text-teal-100 flex items-center gap-2 mt-1">
                    <span>Enquiry ID: #{enquiry.id}</span>
                    <span>•</span>
                    <span>Registered {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </p>
                </div>
              </div>

              {/* Action: Select for bill */}
              {onSelectForBilling && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectForBilling(enquiry);
                    onClose();
                  }}
                  className="px-4 py-2 bg-white text-[#0f8672] hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-[#0f8672]" />
                  <span>{isBillingContext ? 'Use for Billing' : 'Create Bill for Patient'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Modal Body / Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
            {/* Quick Contact & Geographic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Primary Contact</p>
                  <p className="font-semibold text-slate-900 text-xs mt-0.5">{enquiry.phone}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="text-[11px] text-[#0f8672] hover:underline font-semibold"
                    >
                      Call Patient
                    </a>
                    <span className="text-slate-300">|</span>
                    <a
                      href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:underline font-semibold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-900 text-xs mt-0.5 truncate" title={enquiry.email}>
                    {enquiry.email || 'Not provided'}
                  </p>
                  {enquiry.email && (
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-[11px] text-[#0f8672] hover:underline font-semibold block mt-1.5"
                    >
                      Send Email
                    </a>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Service Location</p>
                  <p className="font-semibold text-slate-900 text-xs mt-0.5">{enquiry.cityArea}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${enquiry.cityArea}, Delhi NCR`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#0f8672] hover:underline font-semibold inline-flex items-center gap-1 mt-1.5"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Care Service & Schedule */}
            <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#0f8672]" />
                  <span className="font-bold text-slate-900 text-sm">Requested Care Service</span>
                </div>
                <span className="px-2.5 py-0.5 bg-white border border-teal-200 text-[#0e6b5c] rounded-full text-[11px] font-bold">
                  {serviceName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Preferred Start Date:{' '}
                    <strong className="text-slate-800">
                      {enquiry.preferredDate || 'Immediate'}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Current Stage:{' '}
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStageBadge(enquiry.stage)}`}>
                      {enquiry.stage}
                    </span>
                  </span>
                </div>
              </div>

              {/* Patient Message / Medical Description */}
              {enquiry.message && (
                <div className="pt-2 border-t border-teal-100/70">
                  <p className="text-[10px] uppercase font-bold text-teal-800 mb-1">
                    Clinical Condition / Patient Requirements:
                  </p>
                  <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-teal-100 leading-relaxed">
                    {enquiry.message}
                  </p>
                </div>
              )}
            </div>

            {/* Assigned Clinical Nurse */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#0f8672]" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Assigned Clinical Nurse
                  </span>
                </div>
                {assignedNurse ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                    Assigned & Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                    Pending Nurse Assignment
                  </span>
                )}
              </div>

              {assignedNurse ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center font-bold text-sm">
                      {assignedNurse.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{assignedNurse.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {assignedNurse.qualification} · {assignedNurse.yearsOfExperience} yrs exp · {assignedNurse.city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800">{assignedNurse.phone}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">{assignedNurse.status}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200">
                  No nurse currently assigned to this patient. You can assign an available verified nurse in the Patient & Enquiries view.
                </p>
              )}
            </div>

            {/* BILLING HISTORY & INVOICES SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#0f8672]" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Billing History & Invoices ({patientBillings.length})
                  </span>
                </div>
                {patientBillings.length > 0 && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Total Invoiced: ₹{totalBilled.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {patientBillings.length > 0 ? (
                <div className="space-y-3">
                  {/* Financial KPI Banner for this patient */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl">
                      <span className="text-[10px] text-teal-800 uppercase font-bold block">Total Invoiced</span>
                      <span className="font-extrabold text-[#0e6b5c] text-sm">₹{totalBilled.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Paid</span>
                      <span className="font-extrabold text-emerald-700 text-sm">₹{totalPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">Balance Due</span>
                      <span className={`font-extrabold text-sm ${totalDue > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        ₹{totalDue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Invoices List */}
                  <div className="space-y-2.5">
                    {patientBillings.map((bill) => {
                      const billPercentPaid =
                        bill.totalCharges > 0
                          ? Math.min(100, Math.round((bill.amountPaid / bill.totalCharges) * 100))
                          : 100;

                      return (
                        <div
                          key={bill.id}
                          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-800">
                                #{bill.id}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                  bill.status === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : bill.status === 'REFUNDED'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : bill.status === 'CANCELLED'
                                    ? 'bg-slate-100 text-slate-600 border-slate-300'
                                    : 'bg-teal-50 text-[#0e6b5c] border-teal-200'
                                }`}
                              >
                                {bill.status === 'COMPLETED'
                                  ? 'Paid in Full'
                                  : bill.balanceDue > 0
                                  ? `Due: ₹${bill.balanceDue.toLocaleString('en-IN')}`
                                  : bill.status}
                              </span>
                            </div>

                            {/* View & Print Action Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedBillingForInvoice(bill)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-[11px] font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                              title="View and print official tax invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View & Print Invoice</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                            <div>
                              <p className="font-semibold text-slate-900">{bill.serviceName}</p>
                              <p className="text-slate-500">
                                {bill.startDate} → {bill.endDate} ({bill.totalDays} Days · {bill.shiftType})
                              </p>
                            </div>
                            <div className="sm:text-right">
                              <p className="font-bold text-slate-900">
                                Total: ₹{bill.totalCharges.toLocaleString('en-IN')}
                              </p>
                              <p className="text-slate-500">
                                Paid: <span className="text-emerald-700 font-semibold">₹{bill.amountPaid.toLocaleString('en-IN')}</span> ({billPercentPaid}%)
                                {bill.balanceDue > 0 && (
                                  <span className="text-amber-700 font-semibold"> · Due: ₹{bill.balanceDue.toLocaleString('en-IN')}</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Payment Records Count */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-slate-400" />
                              <span>{bill.payments?.length || 0} payment receipt(s) logged</span>
                            </span>
                            {bill.totalRefunded > 0 && (
                              <span className="text-rose-600 font-semibold">
                                Refunded: ₹{bill.totalRefunded.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    No billing accounts or invoices have been created for this patient yet.
                  </p>
                  {onSelectForBilling && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectForBilling(enquiry);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Create First Bill for Patient</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Clinical Documents & Prescriptions with In-App View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0f8672]" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Prescriptions & Clinical Documents ({enquiry.documents?.length || 0})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">PDF & Verification Records</span>
              </div>

              {enquiry.documents && enquiry.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enquiry.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0 border border-teal-100">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-xs truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {doc.fileType.toUpperCase()} · {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="flex-1 py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-[#0e6b5c] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF / Doc</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(doc)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No prescription documents uploaded yet for this booking.
                </div>
              )}
            </div>

            {/* Internal Notes */}
            {enquiry.notes && (
              <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800">
                  Coordinator & Administrative Notes:
                </span>
                <p className="text-xs text-slate-700">{enquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-500">
              Showing official patient records for Care Services
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Close Profile
              </button>

              {onSelectForBilling && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectForBilling(enquiry);
                    onClose();
                  }}
                  className="px-5 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Select for Billing</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Document Viewer Modal when viewing a PDF/document */}
      {selectedDocForPreview && (
        <DocumentViewerModal
          document={selectedDocForPreview}
          onClose={() => setSelectedDocForPreview(null)}
          titlePrefix={`Patient: ${enquiry.fullName}`}
        />
      )}

      {/* Invoice Statement Preview & Print Modal */}
      {selectedBillingForInvoice && (
        <InvoiceStatementModal
          billing={selectedBillingForInvoice}
          onClose={() => setSelectedBillingForInvoice(null)}
        />
      )}
    </>
  );
};
