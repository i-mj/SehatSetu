/**
 * Nurse Care - Core TypeScript Domain Models
 * Contains data structures for Enquiries, Nurses, Reviews, Documents, and Settings.
 */

export type EnquiryStage = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface StageHistoryEntry {
  stage: EnquiryStage;
  timestamp: string;
  note?: string;
}

export interface Document {
  id: string;
  enquiryId?: string;
  ownerId?: string;
  ownerType?: 'enquiry' | 'nurse' | 'staff';
  name: string;
  fileType: 'pdf' | 'jpg' | 'png' | string;
  fileSize: number; // In bytes
  fileUrl: string; // Base64 or object URL
  uploadedAt: string;
  uploadedBy?: string;
  category?: string;
}

export interface FormFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  isDefault?: boolean;
  options?: string[]; // for select dropdowns
  helpText?: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  cityArea: string;
  preferredDate: string;
  message: string;
  stage: EnquiryStage;
  assignedNurseId?: string;
  notes?: string;
  customFields?: Record<string, string>;
  stageHistory: StageHistoryEntry[];
  documents: Document[];
  createdAt: string;
}

export type NurseStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';
export type NurseIdType = 'Aadhaar' | 'PAN' | 'Voter ID' | 'Passport' | 'Other';

export interface Nurse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  qualification: string;
  yearsOfExperience: number;
  idType: NurseIdType;
  idNumber: string;
  status: NurseStatus;
  createdAt: string;
  bio?: string;
  notes?: string;
  documents?: Document[];
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReviewMediaType = 'text' | 'photo' | 'video';

export interface Review {
  id: string;
  reviewerName: string;
  rating: number; // 1 to 5
  message: string;
  serviceName?: string;
  mediaType: ReviewMediaType;
  photoUrl?: string;
  videoUrl?: string;
  status: ReviewStatus;
  createdAt: string;
  adminNote?: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

export interface ServiceLocation {
  id: string;
  name: string; // e.g. "South Delhi"
  city: string; // e.g. "New Delhi"
  popularAreas: string[]; // e.g. ["Vasant Vihar", "Hauz Khas", "Saket", "Greater Kailash"]
  responseEta: string; // e.g. "2 to 3 hours"
  isActive: boolean;
  notes?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  bulletPoints: string[];
  faqs: ServiceFAQ[];
  locations?: string[]; // IDs of ServiceLocations where available. If empty or undefined, available in all active locations
  pricingNote?: string;
  isActive?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type AdminUserRole = 'SUPER_ADMIN' | 'CLINICAL_ADMIN' | 'COORDINATOR' | 'STAFF' | 'FINANCE';
export type AdminUserStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  password?: string; // stored for demo simulation
  role: AdminUserRole;
  status: AdminUserStatus;
  phone?: string;
  designation?: string;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type StaffDepartment = 'Nursing Care' | 'Elderly Attendant' | 'Clinical Triage' | 'Field Operations' | 'Administrative Desk';
export type StaffShift = 'Day Shift (8 AM - 8 PM)' | 'Night Shift (8 PM - 8 AM)' | '24h Live-in' | 'Rotational' | 'On-Call';
export type StaffStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
export type StaffLoginRole = 'STAFF' | 'FINANCE';

export interface StaffRecord {
  id: string;
  employeeCode: string;
  fullName: string;
  department: StaffDepartment;
  designation: string;
  phone: string;
  email: string;
  shift: StaffShift;
  status: StaffStatus;
  qualification: string;
  councilRegistrationNo?: string;
  emergencyContact?: string;
  joinDate: string;
  notes?: string;
  createdAt: string;
  canLogin?: boolean;
  loginRole?: StaffLoginRole; // STAFF (Enquiries & Nurses only) vs FINANCE (Finances only)
  password?: string;
  documents?: Document[];
}

// ==========================================
// FINANCES & PATIENT BILLING MANAGEMENT
// ==========================================
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit/Debit Card' | 'Cheque';
export type BillingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  paidAt: string;
  receivedBy: string;
  receiptNumber: string;
  notes?: string;
}

export interface RefundRecord {
  id: string;
  amount: number;
  reason: string;
  refundMode: 'UPI' | 'Bank Transfer' | 'Cash';
  transactionRef?: string;
  refundedAt: string;
  processedBy: string;
  status: 'PROCESSED' | 'PENDING';
}

export interface DurationExtension {
  id: string;
  extendedDays: number;
  previousEndDate: string;
  newEndDate: string;
  additionalCharges: number;
  reason: string;
  extendedAt: string;
  authorizedBy: string;
}

export interface CareBilling {
  id: string;
  enquiryId: string;
  patientName: string;
  phone: string;
  serviceName: string;
  
  // Duration tracking
  startDate: string;
  endDate: string;
  totalDays: number;
  shiftType: string; // e.g. "12h Day Shift", "24h Live-in", "Per-Visit"

  // Charges
  dailyRate: number; // in INR
  baseCareCharges: number;
  consumablesCharges: number;
  taxes: number; // GST
  totalCharges: number; // net total payable
  
  // Money & Payments
  amountPaid: number;
  balanceDue: number;
  payments: PaymentRecord[];
  
  // Refunds
  refunds: RefundRecord[];
  totalRefunded: number;
  
  // Extensions
  extensions: DurationExtension[];
  
  status: BillingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}


