/**
 * Nurse Care - Admin Finances & Patient Billing Console
 * Comprehensive management of patient care durations, service charges,
 * payments collection (+ Add Money), duration modifications, duration extensions,
 * refunds, and audit statements.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { CareBilling, PaymentMode, BillingStatus, Enquiry } from '../../types';
import { PatientProfileModal } from '../../components/admin/PatientProfileModal';
import { InvoiceStatementModal } from '../../components/admin/InvoiceStatementModal';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CreditCard,
  RotateCcw,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
  User,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Download,
  X,
  Edit3,
  Eye,
  Check,
  ExternalLink,
  UserCheck,
  BarChart3,
  PieChart as PieChartIcon,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminFinances: React.FC = () => {
  const {
    billings,
    enquiries,
    nurses,
    services,
    addBilling,
    updateBilling,
    addPaymentToBilling,
    editBillingDuration,
    extendBillingDuration,
    processRefund,
    currentAdminUser
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BillingStatus>('ALL');

  // View Mode: 'both' (Charts + Invoices), 'charts' (Only Visuals), 'table' (Only Invoices)
  const [viewMode, setViewMode] = useState<'both' | 'charts' | 'table'>('both');
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');

  // Patient Search & Profile modal states
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Enquiry | null>(null);

  // Modal states
  const [isAddBillingOpen, setIsAddBillingOpen] = useState(false);
  const [selectedBillingForPayment, setSelectedBillingForPayment] = useState<CareBilling | null>(null);
  const [selectedBillingForEditDuration, setSelectedBillingForEditDuration] = useState<CareBilling | null>(null);
  const [selectedBillingForExtend, setSelectedBillingForExtend] = useState<CareBilling | null>(null);
  const [selectedBillingForRefund, setSelectedBillingForRefund] = useState<CareBilling | null>(null);
  const [selectedBillingForStatement, setSelectedBillingForStatement] = useState<CareBilling | null>(null);

  // Form State: Add New Billing
  const [newEnquiryId, setNewEnquiryId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newServiceName, setNewServiceName] = useState('Elderly Care at Home');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [newTotalDays, setNewTotalDays] = useState(14);
  const [newDailyRate, setNewDailyRate] = useState(1800);
  const [newShiftType, setNewShiftType] = useState('12h Day Shift (8 AM - 8 PM)');
  const [newConsumables, setNewConsumables] = useState(0);
  const [newAdvancePayment, setNewAdvancePayment] = useState(0);
  const [newPaymentMode, setNewPaymentMode] = useState<PaymentMode>('UPI');
  const [newTxnRef, setNewTxnRef] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Form State: Add Money / Payment
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<PaymentMode>('UPI');
  const [payTxnRef, setPayTxnRef] = useState('');
  const [payReceivedBy, setPayReceivedBy] = useState(currentAdminUser?.fullName || 'Duty Coordinator');
  const [payNotes, setPayNotes] = useState('');

  // Form State: Edit Duration
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDays, setEditDays] = useState(14);
  const [editDailyRate, setEditDailyRate] = useState(1800);
  const [editShiftType, setEditShiftType] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Form State: Extend Duration
  const [extendDays, setExtendDays] = useState(7);
  const [extendCharges, setExtendCharges] = useState(12600);
  const [extendReason, setExtendReason] = useState('Patient recovery extended on physician recommendation.');
  const [extendAuthorizedBy, setExtendAuthorizedBy] = useState(currentAdminUser?.fullName || 'Supervisory Nurse');

  // Form State: Refund
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMode, setRefundMode] = useState<'UPI' | 'Bank Transfer' | 'Cash'>('UPI');
  const [refundReason, setRefundReason] = useState('Early hospital discharge / clinical goal completed.');
  const [refundTxnRef, setRefundTxnRef] = useState('');
  const [refundProcessedBy, setRefundProcessedBy] = useState(currentAdminUser?.fullName || 'Admin Desk');

  // Filtered billings
  const filteredBillings = useMemo(() => {
    return billings.filter((b) => {
      const matchesSearch =
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [billings, searchQuery, statusFilter]);

  // Financial KPI calculations
  const totalBilled = billings.reduce((sum, b) => sum + (b.totalCharges || 0), 0);
  const totalCollected = billings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  const totalBalanceDue = billings.reduce((sum, b) => sum + (b.balanceDue || 0), 0);
  const totalRefunded = billings.reduce((sum, b) => sum + (b.totalRefunded || 0), 0);

  const collectionRate = totalBilled > 0 ? Math.min(100, Math.round((totalCollected / totalBilled) * 100)) : 100;
  const avgInvoiceAmount = billings.length > 0 ? Math.round(totalBilled / billings.length) : 0;
  const activeCasesCount = billings.filter((b) => b.status === 'ACTIVE').length;

  // Monthly Revenue & Collections Aggregation for Recharts Bar Chart
  const monthlyRevenueData = useMemo(() => {
    const monthsCount = timeRange === '12m' ? 12 : 6;
    const now = new Date();
    const map: Record<string, { month: string; rawMonth: string; invoiced: number; collected: number; balanceDue: number; count: number }> = {};

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { month: 'short' });
      map[key] = {
        month: label,
        rawMonth: key,
        invoiced: 0,
        collected: 0,
        balanceDue: 0,
        count: 0
      };
    }

    billings.forEach((b) => {
      const dateStr = b.startDate || b.createdAt || new Date().toISOString();
      const key = dateStr.substring(0, 7);
      if (map[key]) {
        map[key].invoiced += b.totalCharges || 0;
        map[key].collected += b.amountPaid || 0;
        map[key].balanceDue += b.balanceDue || 0;
        map[key].count += 1;
      }
    });

    return Object.values(map);
  }, [billings, timeRange]);

  // Invoice Status Distribution Data for Recharts Donut Pie Chart
  const statusDistributionData = useMemo(() => {
    const stats: Record<BillingStatus, { count: number; totalAmount: number; color: string; label: string }> = {
      ACTIVE: { count: 0, totalAmount: 0, color: '#0f8672', label: 'Active Care' },
      COMPLETED: { count: 0, totalAmount: 0, color: '#2563eb', label: 'Completed' },
      REFUNDED: { count: 0, totalAmount: 0, color: '#d97706', label: 'Refunded' },
      CANCELLED: { count: 0, totalAmount: 0, color: '#94a3b8', label: 'Cancelled' }
    };

    billings.forEach((b) => {
      const s = b.status || 'ACTIVE';
      if (stats[s]) {
        stats[s].count += 1;
        stats[s].totalAmount += b.totalCharges || 0;
      }
    });

    return (Object.keys(stats) as BillingStatus[])
      .map((k) => ({
        name: stats[k].label,
        status: k,
        value: stats[k].count,
        totalAmount: stats[k].totalAmount,
        color: stats[k].color
      }))
      .filter((item) => item.value > 0);
  }, [billings]);

  // Pre-fill patient details when selecting an enquiry
  const handleSelectEnquiry = (enqId: string) => {
    setNewEnquiryId(enqId);
    const enq = enquiries.find((e) => e.id === enqId);
    if (enq) {
      setNewPatientName(enq.fullName);
      setNewPhone(enq.phone);
      const svc = services.find((s) => s.id === enq.serviceId);
      if (svc) setNewServiceName(svc.title);
      if (enq.preferredDate) {
        setNewStartDate(enq.preferredDate);
        const end = new Date(new Date(enq.preferredDate).getTime() + newTotalDays * 86400000);
        setNewEndDate(end.toISOString().split('T')[0]);
      }
    }
  };

  // Filtered patients for search in bill creation modal
  const matchingPatients = useMemo(() => {
    if (!patientSearchTerm.trim()) {
      return enquiries.slice(0, 5);
    }
    const term = patientSearchTerm.toLowerCase();
    return enquiries.filter((e) =>
      e.fullName.toLowerCase().includes(term) ||
      e.phone.includes(term) ||
      e.id.toLowerCase().includes(term) ||
      e.cityArea.toLowerCase().includes(term) ||
      e.serviceId.toLowerCase().includes(term) ||
      e.stage.toLowerCase().includes(term)
    );
  }, [enquiries, patientSearchTerm]);

  // Currently selected enquiry object if linked
  const selectedEnquiryObj = useMemo(() => {
    if (!newEnquiryId) return null;
    return enquiries.find((e) => e.id === newEnquiryId) || null;
  }, [enquiries, newEnquiryId]);

  // Match billing to enquiry for profile review
  const getEnquiryForBilling = (billing: CareBilling): Enquiry | undefined => {
    if (billing.enquiryId && billing.enquiryId.startsWith('enq-')) {
      const found = enquiries.find((e) => e.id === billing.enquiryId);
      if (found) return found;
    }
    return enquiries.find(
      (e) =>
        e.phone === billing.phone ||
        e.fullName.toLowerCase() === billing.patientName.toLowerCase()
    );
  };

  // Recalculate days when dates change in Add Modal
  const handleDateRangeChange = (start: string, end: string) => {
    setNewStartDate(start);
    setNewEndDate(end);
    if (start && end) {
      const d1 = new Date(start).getTime();
      const d2 = new Date(end).getTime();
      const diff = Math.max(1, Math.round((d2 - d1) / 86400000));
      setNewTotalDays(diff);
    }
  };

  const handleCreateBilling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPhone.trim()) return;

    const baseCareCharges = newTotalDays * newDailyRate;
    const totalCharges = baseCareCharges + newConsumables;
    const initialPaid = Math.min(newAdvancePayment, totalCharges);
    const balanceDue = Math.max(0, totalCharges - initialPaid);

    const initialPayments = initialPaid > 0 ? [
      {
        id: 'pay-' + Date.now(),
        amount: initialPaid,
        paymentMode: newPaymentMode,
        transactionRef: newTxnRef.trim() || undefined,
        paidAt: new Date().toISOString(),
        receivedBy: currentAdminUser?.fullName || 'Care Coordinator',
        receiptNumber: 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        notes: 'Initial care duration deposit'
      }
    ] : [];

    addBilling({
      enquiryId: newEnquiryId || ('enq-auto-' + Date.now()),
      patientName: newPatientName.trim(),
      phone: newPhone.trim(),
      serviceName: newServiceName,
      startDate: newStartDate,
      endDate: newEndDate,
      totalDays: newTotalDays,
      shiftType: newShiftType,
      dailyRate: newDailyRate,
      baseCareCharges,
      consumablesCharges: newConsumables,
      taxes: 0,
      totalCharges,
      amountPaid: initialPaid,
      balanceDue,
      payments: initialPayments,
      refunds: [],
      totalRefunded: 0,
      extensions: [],
      status: balanceDue === 0 ? 'COMPLETED' : 'ACTIVE',
      notes: newNotes.trim() || undefined
    });

    setIsAddBillingOpen(false);
    // Reset form
    setNewPatientName('');
    setNewPhone('');
    setNewAdvancePayment(0);
    setNewTxnRef('');
    setNewNotes('');
  };

  // Open Edit Duration
  const openEditDuration = (b: CareBilling) => {
    setSelectedBillingForEditDuration(b);
    setEditStartDate(b.startDate);
    setEditEndDate(b.endDate);
    setEditDays(b.totalDays);
    setEditDailyRate(b.dailyRate);
    setEditShiftType(b.shiftType);
    setEditNotes(b.notes || '');
  };

  const handleSaveEditDuration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillingForEditDuration) return;

    editBillingDuration(selectedBillingForEditDuration.id, {
      startDate: editStartDate,
      endDate: editEndDate,
      totalDays: editDays,
      dailyRate: editDailyRate,
      shiftType: editShiftType,
      notes: editNotes
    });
    setSelectedBillingForEditDuration(null);
  };

  // Open Extend Duration
  const openExtend = (b: CareBilling) => {
    setSelectedBillingForExtend(b);
    setExtendDays(7);
    setExtendCharges(7 * b.dailyRate);
    setExtendReason('Patient recovery extended on family request.');
  };

  const handleSaveExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillingForExtend) return;

    extendBillingDuration(selectedBillingForExtend.id, {
      extendedDays: extendDays,
      additionalCharges: extendCharges,
      reason: extendReason,
      authorizedBy: extendAuthorizedBy
    });
    setSelectedBillingForExtend(null);
  };

  // Open Add Money
  const openAddMoney = (b: CareBilling) => {
    setSelectedBillingForPayment(b);
    setPayAmount(b.balanceDue > 0 ? b.balanceDue : 0);
    setPayReceivedBy(currentAdminUser?.fullName || 'Duty Coordinator');
    setPayMode('UPI');
    setPayTxnRef('');
    setPayNotes('');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillingForPayment || payAmount <= 0) return;

    addPaymentToBilling(selectedBillingForPayment.id, {
      amount: payAmount,
      paymentMode: payMode,
      transactionRef: payTxnRef.trim() || undefined,
      receivedBy: payReceivedBy,
      notes: payNotes.trim() || undefined
    });
    setSelectedBillingForPayment(null);
  };

  // Open Refund
  const openRefund = (b: CareBilling) => {
    setSelectedBillingForRefund(b);
    const maxRefundable = Math.max(0, (b.amountPaid || 0) - (b.totalRefunded || 0));
    setRefundAmount(maxRefundable);
    setRefundMode('UPI');
    setRefundReason('Early discharge & adjustment of unused shift days.');
    setRefundTxnRef('');
  };

  const handleSaveRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillingForRefund || refundAmount <= 0) return;

    processRefund(selectedBillingForRefund.id, {
      amount: refundAmount,
      reason: refundReason,
      refundMode: refundMode,
      transactionRef: refundTxnRef.trim() || undefined,
      processedBy: refundProcessedBy,
      status: 'PROCESSED'
    });
    setSelectedBillingForRefund(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <PageSeo
        title="Admin - Patient Finances & Billing Management"
        description="Comprehensive finances console for patient care durations, charges, payments collection, extensions, and refunds."
      />

      {/* Header & New Billing Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Patient Accounts & Care Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Finances & Care Billing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage durations, daily shift charges, advance receipts, extensions, and patient refunds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddBillingOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Care Billing</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Care Charges</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">
            Across {billings.length} registered patient care regimens
          </p>
        </div>

        {/* Total Collected / Money Added */}
        <div className="p-5 bg-white border border-emerald-200/80 rounded-2xl shadow-2xs space-y-2 bg-emerald-50/20">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span>Money Collected</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600/80">
            Verified advance & running receipts
          </p>
        </div>

        {/* Outstanding Balance Due */}
        <div className="p-5 bg-white border border-amber-200/80 rounded-2xl shadow-2xs space-y-2 bg-amber-50/20">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wider">
            <span>Balance Due</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">
            ₹{totalBalanceDue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-600/80">
            Pending reconciliation / shift completion
          </p>
        </div>

        {/* Total Refunded */}
        <div className="p-5 bg-white border border-rose-200/80 rounded-2xl shadow-2xs space-y-2 bg-rose-50/20">
          <div className="flex items-center justify-between text-xs font-bold text-rose-800 uppercase tracking-wider">
            <span>Refunds Issued</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700">
            ₹{totalRefunded.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-rose-600/80">
            For early discharge / unused shifts
          </p>
        </div>
      </div>

      {/* View Mode & Analytics Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Financial Intelligence & Viewport
            </h2>
            <p className="text-[11px] text-slate-500">
              Interactive revenue analytics and patient account ledger
            </p>
          </div>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'both'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Overview (All)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('charts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'charts'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Charts Only</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-teal-600" />
            <span>Invoices Table</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECHARTS ANALYTICS VIEW: MONTHLY REVENUE & INVOICE STATUS DISTRIBUTION */}
      {/* ========================================================================= */}
      {viewMode !== 'table' && (
        <div className="space-y-4">
          {/* Analytics KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Collection Efficiency
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {collectionRate}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Of total billed care charges realized
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Average Billing Value
                </span>
                <span className="text-lg font-extrabold text-indigo-700">
                  ₹{avgInvoiceAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Per patient care agreement
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Care Regimens
                </span>
                <span className="text-lg font-extrabold text-teal-700">
                  {activeCasesCount} Accounts
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Currently receiving home nursing
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Two-Column Recharts Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart 1: Monthly Revenue & Collections Bar Chart */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <BarChart3 className="w-4 h-4 text-[#0f8672]" />
                      <span>Monthly Revenue & Cash Collections Trend</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Comparison of total care charges billed vs cash collected
                    </p>
                  </div>

                  {/* Time Range Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTimeRange('6m')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                        timeRange === '6m' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeRange('12m')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                        timeRange === '12m' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      12 Months
                    </button>
                  </div>
                </div>

                {/* Recharts Bar Chart */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenueData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                      />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          `₹${Number(value || 0).toLocaleString('en-IN')}`,
                          name === 'invoiced'
                            ? 'Billed Charges'
                            : name === 'collected'
                            ? 'Collected'
                            : 'Balance Due'
                        ]}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '11px'
                        }}
                      />
                      <Bar
                        dataKey="invoiced"
                        name="invoiced"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="collected"
                        name="collected"
                        fill="#0f8672"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="balanceDue"
                        name="balanceDue"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#6366f1]" />
                  <span>Total Invoiced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0f8672]" />
                  <span>Collected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
                  <span>Balance Due</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Invoice Status Distribution Donut Pie Chart */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    <PieChartIcon className="w-4 h-4 text-[#0f8672]" />
                    <span>Invoice Status Distribution</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Breakdown of patient billing volume by clinical lifecycle status
                  </p>
                </div>

                {/* Donut Chart with Center Summary */}
                <div className="relative h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value: any, name: any, item: any) => [
                          `${value} Cases · ₹${Number(item?.payload?.totalAmount || 0).toLocaleString('en-IN')}`,
                          name
                        ]}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px'
                        }}
                      />
                      <Pie
                        data={statusDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-xl font-extrabold text-slate-900 leading-none">
                      {billings.length}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Invoices</span>
                  </div>
                </div>
              </div>

              {/* Status Breakdown Legend & Amounts */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                {statusDistributionData.map((item) => {
                  const percent = billings.length > 0 ? Math.round((item.value / billings.length) * 100) : 0;
                  return (
                    <div
                      key={item.status}
                      className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-800 text-[11px]">{item.name}</span>
                        <span className="text-[10px] text-slate-400">({item.value})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-[11px]">
                          ₹{item.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                          {percent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BILLING TABLE & RECORDS LEDGER */}
      {/* ========================================================================= */}
      {viewMode !== 'charts' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search patient, phone, service, or billing ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus-visible:outline-teal-700 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REFUNDED'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-[#0f8672] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Billings Table / Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredBillings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Billing Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No patient care billing matches the current filters. Create a new billing account to manage charges and collections.
            </p>
            <button
              type="button"
              onClick={() => setIsAddBillingOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] text-white text-xs font-semibold rounded-xl mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Billing</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Patient & Service</th>
                  <th className="py-3 px-4">Duration & Shifts</th>
                  <th className="py-3 px-4">Total Charges</th>
                  <th className="py-3 px-4">Collected / Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBillings.map((bill) => {
                  const percentPaid = bill.totalCharges > 0
                    ? Math.min(100, Math.round((bill.amountPaid / bill.totalCharges) * 100))
                    : 100;

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Patient & Service */}
                      <td className="py-4 px-4 align-top">
                        {(() => {
                          const matchedEnq = getEnquiryForBilling(bill);
                          return (
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm">{bill.patientName}</span>
                                {matchedEnq && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPatientForProfile(matchedEnq)}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-[#0f8672] text-[10px] font-semibold border border-teal-200 transition-colors cursor-pointer"
                                    title="View full patient clinical profile & attached prescriptions"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Profile</span>
                                  </button>
                                )}
                              </div>
                              <a
                                href={`tel:${bill.phone}`}
                                className="text-slate-500 hover:text-[#0f8672] flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{bill.phone}</span>
                              </a>
                              <div className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-[#0e6b5c] rounded text-[10px] font-semibold border border-teal-100">
                                {bill.serviceName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{bill.id}</div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Duration & Shifts */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#0f8672]" />
                          <span>{bill.startDate} → {bill.endDate}</span>
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          <strong>{bill.totalDays} Days</strong> · {bill.shiftType}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Daily Rate: ₹{bill.dailyRate.toLocaleString('en-IN')}/day
                        </div>
                        {bill.extensions && bill.extensions.length > 0 && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            <span>Extended +{bill.extensions.reduce((acc, x) => acc + x.extendedDays, 0)} days</span>
                          </div>
                        )}
                      </td>

                      {/* Total Charges */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="text-sm font-extrabold text-slate-900">
                          ₹{bill.totalCharges.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Base: ₹{bill.baseCareCharges.toLocaleString('en-IN')}
                        </div>
                        {bill.consumablesCharges > 0 && (
                          <div className="text-[10px] text-slate-400">
                            Consumables: ₹{bill.consumablesCharges.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Collected / Due */}
                      <td className="py-4 px-4 align-top space-y-1.5 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-700">
                            Paid: ₹{bill.amountPaid.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">{percentPaid}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              bill.balanceDue === 0 ? 'bg-emerald-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${percentPaid}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Due:</span>
                          <span
                            className={`font-bold ${
                              bill.balanceDue > 0 ? 'text-amber-700' : 'text-slate-400'
                            }`}
                          >
                            ₹{bill.balanceDue.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {bill.totalRefunded > 0 && (
                          <div className="text-[10px] text-rose-600 font-semibold">
                            Refunded: ₹{bill.totalRefunded.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            bill.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : bill.status === 'REFUNDED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : bill.status === 'CANCELLED'
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : 'bg-teal-50 text-[#0e6b5c] border-teal-200'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>

                      {/* Action Buttons Toolbar */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {/* Add Money Button */}
                          <button
                            type="button"
                            onClick={() => openAddMoney(bill)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Collect payment / Add money"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Money</span>
                          </button>

                          {/* Edit Duration Button */}
                          <button
                            type="button"
                            onClick={() => openEditDuration(bill)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Edit care duration dates & rates"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Edit Duration</span>
                          </button>

                          {/* Extend Duration Button */}
                          <button
                            type="button"
                            onClick={() => openExtend(bill)}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0e6b5c] font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Extend care duration"
                          >
                            <Calendar className="w-3 h-3 text-[#0f8672]" />
                            <span>Extend Duration</span>
                          </button>

                          {/* Refund Button */}
                          <button
                            type="button"
                            onClick={() => openRefund(bill)}
                            className="px-2 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Issue partial or full refund"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Refund</span>
                          </button>

                          {/* View Statement Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedBillingForStatement(bill)}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View detailed billing statement & receipts"
                          >
                            <Receipt className="w-4 h-4" />
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
    </div>
  )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW BILLING ACCOUNT */}
      {/* ========================================================================= */}
      {isAddBillingOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Open Patient Care Billing Account</h3>
                  <p className="text-xs text-slate-500">Search patient records, view clinical profiles, and configure billing duration.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBillingOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBilling} className="space-y-4 text-xs">
              {/* PATIENT SEARCH & PROFILE PREVIEW SELECTOR */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#0f8672]" />
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                      Patient Search & Clinical Record
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {enquiries.length} Registered Patients
                  </span>
                </div>

                {/* If a patient has been chosen */}
                {selectedEnquiryObj ? (
                  <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#0f8672] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {selectedEnquiryObj.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm truncate">{selectedEnquiryObj.fullName}</p>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#0f8672] border border-teal-200 shrink-0">
                            #{selectedEnquiryObj.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                          {selectedEnquiryObj.phone} · {selectedEnquiryObj.cityArea}
                          {selectedEnquiryObj.documents && selectedEnquiryObj.documents.length > 0 && (
                            <span className="text-[#0e6b5c] font-semibold"> · 📄 {selectedEnquiryObj.documents.length} Prescription(s)</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPatientForProfile(selectedEnquiryObj)}
                        className="px-3 py-1.5 bg-white hover:bg-teal-100 text-[#0f8672] font-bold text-xs rounded-lg border border-teal-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="View complete clinical profile and prescription documents"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewEnquiryId('');
                          setPatientSearchTerm('');
                        }}
                        className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Search for a different patient"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Live Search Bar */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patient by name, phone (e.g. 9811...), booking ID, or locality..."
                        value={patientSearchTerm}
                        onChange={(e) => setPatientSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f8672]"
                      />
                      {patientSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setPatientSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Matching Patients Results List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5 divide-y divide-slate-100">
                      {matchingPatients.length > 0 ? (
                        matchingPatients.map((p) => {
                          const svc = services.find((s) => s.id === p.serviceId);
                          return (
                            <div
                              key={p.id}
                              className="pt-1.5 first:pt-0 p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center justify-between gap-2.5"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center font-bold text-xs shrink-0">
                                  {p.fullName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 truncate">{p.fullName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">#{p.id}</span>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                                      {p.stage}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {p.phone} · {p.cityArea} · <span className="text-[#0f8672]">{svc?.title || p.serviceId}</span>
                                    {p.documents && p.documents.length > 0 && (
                                      <span className="text-teal-700 font-semibold"> · 📄 {p.documents.length} doc(s)</span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPatientForProfile(p)}
                                  className="p-1.5 text-slate-500 hover:text-[#0f8672] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                                  title="View full patient dossier, condition notes, and prescriptions"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectEnquiry(p.id)}
                                  className="px-2.5 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Select</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center text-[11px] text-slate-500">
                          No matching patients found for "{patientSearchTerm}". You can type patient details manually below.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Patient Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9811223344"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Service</label>
                <select
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration & Shift */}
              <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl space-y-3">
                <span className="font-bold text-[#0e6b5c] block uppercase tracking-wider text-[11px]">
                  Duration & Shift Details
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newStartDate}
                      onChange={(e) => handleDateRangeChange(e.target.value, newEndDate)}
                      className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={newEndDate}
                      onChange={(e) => handleDateRangeChange(newStartDate, e.target.value)}
                      className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Days</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="1"
                      value={newTotalDays === 0 ? '' : newTotalDays}
                      onFocus={(e) => {
                        if (e.target.value === '0') e.target.value = '';
                        else e.target.select();
                      }}
                      onChange={(e) => setNewTotalDays(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Daily Rate (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={newDailyRate === 0 ? '' : newDailyRate}
                      onFocus={(e) => {
                        if (e.target.value === '0') e.target.value = '';
                        else e.target.select();
                      }}
                      onChange={(e) => setNewDailyRate(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Consumables (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={newConsumables === 0 ? '' : newConsumables}
                      onFocus={(e) => {
                        if (e.target.value === '0') e.target.value = '';
                        else e.target.select();
                      }}
                      onChange={(e) => setNewConsumables(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Shift Type</label>
                  <select
                    value={newShiftType}
                    onChange={(e) => setNewShiftType(e.target.value)}
                    className="w-full p-2 bg-white border border-teal-200 rounded-lg"
                  >
                    <option value="12h Day Shift (8 AM - 8 PM)">12h Day Shift (8 AM - 8 PM)</option>
                    <option value="12h Night Shift (8 PM - 8 AM)">12h Night Shift (8 PM - 8 AM)</option>
                    <option value="24h Live-in Care">24h Live-in Care</option>
                    <option value="Short Visit (1-2 Hours Procedure)">Short Visit (1-2 Hours Procedure)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-teal-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Calculated Net Total Charges:</span>
                  <span className="font-extrabold text-[#0e6b5c] text-sm">
                    ₹{(newTotalDays * newDailyRate + newConsumables).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Initial Advance Payment */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <span className="font-bold text-emerald-900 block uppercase tracking-wider text-[11px]">
                  Advance Payment / Deposit (Optional)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Amount Paid Now (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={newAdvancePayment === 0 ? '' : newAdvancePayment}
                      onFocus={(e) => {
                        if (e.target.value === '0') e.target.value = '';
                        else e.target.select();
                      }}
                      onChange={(e) => setNewAdvancePayment(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Payment Mode</label>
                    <select
                      value={newPaymentMode}
                      onChange={(e) => setNewPaymentMode(e.target.value as PaymentMode)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                    >
                      <option value="UPI">UPI / QR Code</option>
                      <option value="Cash">Cash Receipt</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Credit/Debit Card">Credit/Debit Card</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {newAdvancePayment > 0 && (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Transaction Ref / UTR</label>
                    <input
                      type="text"
                      placeholder="e.g. UPI-99882211 or Cash receipt memo"
                      value={newTxnRef}
                      onChange={(e) => setNewTxnRef(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Care & Billing Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Family requested weekend dressing check, advance paid for first fortnight..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBillingOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold rounded-xl shadow-xs"
                >
                  Create Billing Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD MONEY / COLLECT PAYMENT */}
      {/* ========================================================================= */}
      {selectedBillingForPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Add Money / Record Payment</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedBillingForPayment.patientName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBillingForPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Balance Due:</span>
              <span className="font-extrabold text-amber-700 text-sm">
                ₹{selectedBillingForPayment.balanceDue.toLocaleString('en-IN')}
              </span>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Amount (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="0"
                  value={payAmount === 0 ? '' : payAmount}
                  onFocus={(e) => {
                    if (e.target.value === '0') e.target.value = '';
                    else e.target.select();
                  }}
                  onChange={(e) => setPayAmount(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as PaymentMode)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="UPI">UPI / QR Payment</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / UTR / Note</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-99881122 or Cash Slip #22"
                  value={payTxnRef}
                  onChange={(e) => setPayTxnRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Received By</label>
                <input
                  type="text"
                  value={payReceivedBy}
                  onChange={(e) => setPayReceivedBy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBillingForPayment(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Record & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT DURATION */}
      {/* ========================================================================= */}
      {selectedBillingForEditDuration && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Edit Care Duration & Rates</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedBillingForEditDuration.patientName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBillingForEditDuration(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDuration} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Days</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={editDays === 0 ? '' : editDays}
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                      else e.target.select();
                    }}
                    onChange={(e) => setEditDays(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={editDailyRate === 0 ? '' : editDailyRate}
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                      else e.target.select();
                    }}
                    onChange={(e) => setEditDailyRate(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Type</label>
                <input
                  type="text"
                  value={editShiftType}
                  onChange={(e) => setEditShiftType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Reason for Adjustment</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between text-xs font-semibold text-teal-900">
                <span>New Recalculated Charges:</span>
                <span className="font-bold text-sm">₹{(editDays * editDailyRate).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBillingForEditDuration(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold rounded-xl shadow-xs"
                >
                  Save Duration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EXTEND DURATION */}
      {/* ========================================================================= */}
      {selectedBillingForExtend && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Extend Care Duration</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedBillingForExtend.patientName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBillingForExtend(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Current End Date:</span>
                <span className="font-bold text-slate-900">{selectedBillingForExtend.endDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Current Total Days:</span>
                <span className="font-bold text-slate-900">{selectedBillingForExtend.totalDays} Days</span>
              </div>
            </div>

            <form onSubmit={handleSaveExtend} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Add Extra Days <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="1"
                    value={extendDays === 0 ? '' : extendDays}
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                      else e.target.select();
                    }}
                    onChange={(e) => {
                      const days = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                      setExtendDays(days);
                      setExtendCharges(days * selectedBillingForExtend.dailyRate);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Additional Charges (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    placeholder="0"
                    value={extendCharges === 0 ? '' : extendCharges}
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                      else e.target.select();
                    }}
                    onChange={(e) => setExtendCharges(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Extension Reason</label>
                <input
                  type="text"
                  required
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Authorized By</label>
                <input
                  type="text"
                  required
                  value={extendAuthorizedBy}
                  onChange={(e) => setExtendAuthorizedBy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBillingForExtend(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold rounded-xl shadow-xs"
                >
                  Confirm Extension (+{extendDays} Days)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REFUND */}
      {/* ========================================================================= */}
      {selectedBillingForRefund && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Issue Patient Refund</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedBillingForRefund.patientName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBillingForRefund(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-slate-900">
                  ₹{selectedBillingForRefund.amountPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Already Refunded:</span>
                <span className="font-bold text-rose-700">
                  ₹{(selectedBillingForRefund.totalRefunded || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveRefund} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Refund Amount (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="0"
                  value={refundAmount === 0 ? '' : refundAmount}
                  onFocus={(e) => {
                    if (e.target.value === '0') e.target.value = '';
                    else e.target.select();
                  }}
                  onChange={(e) => setRefundAmount(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-rose-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Refund Channel / Mode</label>
                <select
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="UPI">UPI Refund</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cash">Cash Handover</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Refund</label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank UTR / Transaction Ref</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-REF-99210"
                  value={refundTxnRef}
                  onChange={(e) => setRefundTxnRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Processed By</label>
                <input
                  type="text"
                  value={refundProcessedBy}
                  onChange={(e) => setRefundProcessedBy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBillingForRefund(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DETAILED STATEMENT / INVOICE PREVIEW & PRINT */}
      {/* ========================================================================= */}
      {selectedBillingForStatement && (
        <InvoiceStatementModal
          billing={selectedBillingForStatement}
          onClose={() => setSelectedBillingForStatement(null)}
          onAddPayment={(b) => {
            setSelectedBillingForStatement(null);
            openAddMoney(b);
          }}
        />
      )}

      {/* PATIENT PROFILE DOSSIER MODAL */}
      {selectedPatientForProfile && (
        <PatientProfileModal
          enquiry={selectedPatientForProfile}
          onClose={() => setSelectedPatientForProfile(null)}
          nurses={nurses}
          services={services}
          onSelectForBilling={(enq) => {
            handleSelectEnquiry(enq.id);
            setSelectedPatientForProfile(null);
          }}
          isBillingContext={isAddBillingOpen}
        />
      )}
    </div>
  );
};
