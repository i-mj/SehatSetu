import { CareBilling, Enquiry } from '../types';

export interface EnquiryBillingBadgeInfo {
  label: string;
  shortStatus: 'NOT_GENERATED' | 'PENDING_DRAFT' | 'ACTIVE' | 'COMPLETED' | 'REFUNDED' | 'CANCELLED';
  hasBilling: boolean;
  isPendingDraft: boolean;
  badgeClass: string;
  headerDarkBadgeClass: string;
}

export const isPendingDraftBilling = (b: CareBilling): boolean => {
  return b.status === 'ACTIVE' && (b.totalCharges || 0) === 0 && (b.dailyRate || 0) === 0;
};

export const getBillingsForEnquiry = (
  enquiry: Enquiry | null | undefined,
  billings: CareBilling[]
): CareBilling[] => {
  if (!enquiry || !billings || billings.length === 0) return [];

  const exactMatches = billings.filter((b) => b.enquiryId === enquiry.id);
  if (exactMatches.length > 0) return exactMatches;

  const cleanEnquiryPhone = enquiry.phone ? enquiry.phone.replace(/[^0-9]/g, '') : '';
  const enquiryNameLower = (enquiry.fullName || '').trim().toLowerCase();

  return billings.filter((b) => {
    // Do not cross-match a billing explicitly tied to another real enquiry ID
    if (b.enquiryId && b.enquiryId.startsWith('enq-') && !b.enquiryId.startsWith('enq-auto-') && b.enquiryId !== enquiry.id) {
      return false;
    }
    const cleanBillPhone = b.phone ? b.phone.replace(/[^0-9]/g, '') : '';
    const matchPhone =
      cleanEnquiryPhone.length >= 8 &&
      cleanBillPhone.length >= 8 &&
      (cleanEnquiryPhone.includes(cleanBillPhone) || cleanBillPhone.includes(cleanEnquiryPhone));
    const matchName =
      Boolean(enquiryNameLower) &&
      Boolean(b.patientName) &&
      b.patientName.trim().toLowerCase() === enquiryNameLower;
    return matchPhone || matchName;
  });
};

export const getEnquiryBillingBadge = (linkedBillings: CareBilling[]): EnquiryBillingBadgeInfo => {
  if (!linkedBillings || linkedBillings.length === 0) {
    return {
      label: 'Billing: Not Generated',
      shortStatus: 'NOT_GENERATED',
      hasBilling: false,
      isPendingDraft: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      headerDarkBadgeClass: 'bg-white/15 text-teal-50 border-white/25'
    };
  }

  const primary =
    linkedBillings.find((b) => b.status === 'ACTIVE') || linkedBillings[0];

  if (isPendingDraftBilling(primary)) {
    return {
      label: 'Billing: Pending',
      shortStatus: 'PENDING_DRAFT',
      hasBilling: true,
      isPendingDraft: true,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      headerDarkBadgeClass: 'bg-amber-400/25 text-amber-50 border-amber-300/50'
    };
  }

  switch (primary.status) {
    case 'ACTIVE':
      return {
        label: 'Billing: Active',
        shortStatus: 'ACTIVE',
        hasBilling: true,
        isPendingDraft: false,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        headerDarkBadgeClass: 'bg-emerald-400/25 text-emerald-50 border-emerald-300/50'
      };
    case 'COMPLETED':
      return {
        label: 'Billing: Completed',
        shortStatus: 'COMPLETED',
        hasBilling: true,
        isPendingDraft: false,
        badgeClass: 'bg-teal-50 text-[#0e6b5c] border-teal-200',
        headerDarkBadgeClass: 'bg-teal-300/25 text-white border-teal-200/50'
      };
    case 'REFUNDED':
      return {
        label: 'Billing: Refunded',
        shortStatus: 'REFUNDED',
        hasBilling: true,
        isPendingDraft: false,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        headerDarkBadgeClass: 'bg-rose-400/25 text-rose-50 border-rose-300/50'
      };
    case 'CANCELLED':
    default:
      return {
        label: 'Billing: Cancelled',
        shortStatus: 'CANCELLED',
        hasBilling: true,
        isPendingDraft: false,
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
        headerDarkBadgeClass: 'bg-white/15 text-slate-100 border-white/25'
      };
  }
};
