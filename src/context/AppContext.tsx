/**
 * Nurse Care - Application State Context
 * Manages reactive in-memory state with localStorage persistence for enquiries,
 * nurses, reviews, settings, authentication, and simulated feedback toasts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Enquiry,
  EnquiryStage,
  Nurse,
  NurseStatus,
  Review,
  ReviewStatus,
  SiteSettings,
  ServiceItem,
  ServiceLocation,
  Document,
  ToastMessage,
  FormFieldConfig,
  AdminUser,
  ContactMessage,
  StaffRecord,
  CareBilling,
  PaymentRecord,
  RefundRecord,
  DurationExtension,
  StaffLoginRole
} from '../types';
import {
  INITIAL_ENQUIRIES,
  INITIAL_NURSES,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_LOCATIONS,
  INITIAL_SETTINGS,
  INITIAL_ADMIN_USERS,
  INITIAL_STAFF_RECORDS,
  INITIAL_BILLINGS,
  SAMPLE_DOC_CARE_PLAN_PDF,
  SAMPLE_DOC_DISCHARGE_PDF,
  SAMPLE_DOC_RX_IMAGE,
  SAMPLE_DOC_COUNCIL_CERT
} from '../data/seedData';

export const DEFAULT_FORM_FIELDS: FormFieldConfig[] = [
  {
    id: 'fullName',
    name: 'fullName',
    label: 'Patient or Caregiver Full Name',
    type: 'text',
    placeholder: 'e.g. Eleanor Vance',
    required: true,
    enabled: true,
    isDefault: true,
    helpText: 'Primary contact person or family caregiver'
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Phone / Mobile Number',
    type: 'tel',
    placeholder: 'e.g. 9811223344 (10 to 15 digits)',
    required: true,
    enabled: true,
    isDefault: true,
    helpText: 'Required for coordinator telephone triage'
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'e.g. family@example.com',
    required: false,
    enabled: true,
    isDefault: true,
    helpText: 'Optional: receives digital care summary updates'
  },
  {
    id: 'serviceId',
    name: 'serviceId',
    label: 'Nursing Service Required',
    type: 'select',
    required: true,
    enabled: true,
    isDefault: true,
    helpText: 'Select the primary care procedure required'
  },
  {
    id: 'cityArea',
    name: 'cityArea',
    label: 'City / Locality / Sector',
    type: 'text',
    placeholder: 'e.g. Vasant Vihar, New Delhi / DLF Phase 2',
    required: true,
    enabled: true,
    isDefault: true,
    helpText: 'Helps us match nearest available registered nurse'
  },
  {
    id: 'preferredDate',
    name: 'preferredDate',
    label: 'Preferred Start Date',
    type: 'date',
    required: false,
    enabled: true,
    isDefault: true,
    helpText: 'No past dates allowed'
  },
  {
    id: 'message',
    name: 'message',
    label: 'Patient Medical Condition & Specific Requirements',
    type: 'textarea',
    placeholder: 'Describe patient age, diagnosis, mobility level, shift preferences...',
    required: false,
    enabled: true,
    isDefault: true,
    helpText: 'Confidential clinical background shared with nurse'
  }
];

interface AppContextType {
  // Settings
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Services
  services: ServiceItem[];
  addService: (serviceData: Omit<ServiceItem, 'id'>) => string;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  resetServicesToDefault: () => void;

  // Service Locations Coverage
  serviceLocations: ServiceLocation[];
  addLocation: (locData: Omit<ServiceLocation, 'id'>) => string;
  updateLocation: (id: string, updates: Partial<ServiceLocation>) => void;
  deleteLocation: (id: string) => void;
  resetLocationsToDefault: () => void;

  // Form Fields Configuration
  enquiryFormFields: FormFieldConfig[];
  updateFormField: (id: string, updates: Partial<FormFieldConfig>) => void;
  addFormField: (field: Omit<FormFieldConfig, 'id'>) => string;
  removeFormField: (id: string) => void;
  resetFormFieldsToDefault: () => void;

  // Google Sheets Integration
  googleSheetId: string | null;
  setGoogleSheetId: (id: string | null) => void;
  lastSheetSync: string | null;
  setLastSheetSync: (iso: string | null) => void;

  // Enquiries
  enquiries: Enquiry[];
  addEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'stage' | 'stageHistory' | 'documents' | 'createdAt'>) => string;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => void;
  updateEnquiryStage: (id: string, newStage: EnquiryStage, note?: string) => void;
  assignNurseToEnquiry: (enquiryId: string, nurseId: string | null) => void;
  updateEnquiryNotes: (enquiryId: string, notes: string) => void;
  deleteEnquiry: (enquiryId: string) => void;
  bulkDeleteEnquiries: (enquiryIds: string[]) => void;
  bulkUpdateEnquiriesStage: (enquiryIds: string[], newStage: EnquiryStage, note?: string) => void;
  addDocumentToEnquiry: (enquiryId: string, doc: Omit<Document, 'id' | 'enquiryId' | 'uploadedAt'>) => void;
  deleteDocumentFromEnquiry: (enquiryId: string, documentId: string) => void;

  // Nurses
  nurses: Nurse[];
  addNurse: (nurseData: Omit<Nurse, 'id' | 'createdAt'>) => string;
  updateNurse: (id: string, updates: Partial<Nurse>) => void;
  updateNurseStatus: (id: string, status: NurseStatus) => void;
  deleteNurse: (id: string) => void;
  addDocumentToNurse: (nurseId: string, doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocumentFromNurse: (nurseId: string, documentId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => string;
  updateReviewStatus: (id: string, status: ReviewStatus, adminNote?: string) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  // Admin & Staff Auth
  isAdminLoggedIn: boolean;
  adminUsers: AdminUser[];
  currentAdminUser: AdminUser | null;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;
  addAdminUser: (userData: Omit<AdminUser, 'id' | 'createdAt'>) => string;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  updateCurrentAdminProfile: (updates: Partial<AdminUser>) => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;

  // Staff Personnel Directory & Credentials
  staffRecords: StaffRecord[];
  addStaffRecord: (data: Omit<StaffRecord, 'id' | 'createdAt'>) => string;
  updateStaffRecord: (id: string, updates: Partial<StaffRecord>) => void;
  deleteStaffRecord: (id: string) => void;
  addDocumentToStaff: (staffId: string, doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocumentFromStaff: (staffId: string, documentId: string) => void;
  toggleStaffLogin: (staffId: string, canLogin: boolean, password?: string, loginRole?: StaffLoginRole) => void;

  // Finances & Patient Billing Management
  billings: CareBilling[];
  addBilling: (data: Omit<CareBilling, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBilling: (id: string, updates: Partial<CareBilling>) => void;
  deleteBilling: (id: string) => void;
  addPaymentToBilling: (billingId: string, payment: Omit<PaymentRecord, 'id' | 'paidAt' | 'receiptNumber'>) => void;
  editBillingDuration: (
    billingId: string,
    params: {
      startDate: string;
      endDate: string;
      totalDays: number;
      dailyRate?: number;
      shiftType?: string;
      notes?: string;
    }
  ) => void;
  extendBillingDuration: (
    billingId: string,
    extension: {
      extendedDays: number;
      additionalCharges: number;
      reason: string;
      authorizedBy: string;
    }
  ) => void;
  processRefund: (
    billingId: string,
    refund: Omit<RefundRecord, 'id' | 'refundedAt'>
  ) => void;

  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => string;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'nursecare_settings_v1',
  SERVICES: 'nursecare_services_v1',
  LOCATIONS: 'nursecare_locations_v1',
  ENQUIRIES: 'nursecare_enquiries_v1',
  NURSES: 'nursecare_nurses_v1',
  REVIEWS: 'nursecare_reviews_v1',
  AUTH: 'nursecare_admin_auth_v1',
  FORM_FIELDS: 'nursecare_form_fields_v1',
  GOOGLE_SHEET_ID: 'nursecare_sheet_id_v1',
  SHEET_LAST_SYNC: 'nursecare_sheet_last_sync_v1',
  ADMIN_USERS: 'nursecare_admin_users_v2',
  CURRENT_ADMIN: 'nursecare_current_admin_v2',
  STAFF_RECORDS: 'nursecare_staff_records_v1',
  CONTACT_MESSAGES: 'nursecare_contact_messages_v1',
  BILLINGS: 'nursecare_billings_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state with fallback to seed data
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return stored ? JSON.parse(stored) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [serviceLocations, setServiceLocations] = useState<ServiceLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      return stored ? JSON.parse(stored) : INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [enquiryFormFields, setEnquiryFormFields] = useState<FormFieldConfig[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FORM_FIELDS);
      return stored ? JSON.parse(stored) : DEFAULT_FORM_FIELDS;
    } catch {
      return DEFAULT_FORM_FIELDS;
    }
  });

  const [googleSheetId, setGoogleSheetIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.GOOGLE_SHEET_ID);
    } catch {
      return null;
    }
  });

  const [lastSheetSync, setLastSheetSyncState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SHEET_LAST_SYNC);
    } catch {
      return null;
    }
  });

  const sanitizeDoc = (doc: Document): Document => {
    if (!doc.fileUrl || doc.fileUrl.startsWith('#mock')) {
      const nameLower = (doc.name || '').toLowerCase();
      if (nameLower.includes('taylor') || nameLower.includes('care_plan') || nameLower.includes('plan')) {
        return { ...doc, fileUrl: SAMPLE_DOC_CARE_PLAN_PDF, fileType: 'pdf' };
      }
      if (nameLower.includes('patel') || nameLower.includes('discharge')) {
        return { ...doc, fileUrl: SAMPLE_DOC_DISCHARGE_PDF, fileType: 'pdf' };
      }
      if (nameLower.includes('wilson') || nameLower.includes('rx') || nameLower.includes('pulmonologist')) {
        return { ...doc, fileUrl: SAMPLE_DOC_RX_IMAGE, fileType: 'svg' };
      }
      return { ...doc, fileUrl: SAMPLE_DOC_COUNCIL_CERT, fileType: 'svg' };
    }
    return doc;
  };

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      const parsed: Enquiry[] = stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
      return parsed.map((e) => ({
        ...e,
        documents: (e.documents || []).map(sanitizeDoc)
      }));
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [nurses, setNurses] = useState<Nurse[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NURSES);
      const parsed: Nurse[] = stored ? JSON.parse(stored) : INITIAL_NURSES;
      return parsed.map((n) => ({
        ...n,
        documents: (n.documents || []).map(sanitizeDoc)
      }));
    } catch {
      return INITIAL_NURSES;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      if (stored) return JSON.parse(stored);
      return INITIAL_ADMIN_USERS[0];
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  });

  const [staffRecords, setStaffRecords] = useState<StaffRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAFF_RECORDS);
      const parsed: StaffRecord[] = stored ? JSON.parse(stored) : INITIAL_STAFF_RECORDS;
      return parsed.map((s) => ({
        ...s,
        documents: (s.documents || []).map(sanitizeDoc)
      }));
    } catch {
      return INITIAL_STAFF_RECORDS;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [billings, setBillings] = useState<CareBilling[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BILLINGS);
      return stored ? JSON.parse(stored) : INITIAL_BILLINGS;
    } catch {
      return INITIAL_BILLINGS;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.warn('Failed to save enquiries:', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NURSES, JSON.stringify(nurses));
    } catch (e) {
      console.warn('Failed to save nurses:', e);
    }
  }, [nurses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save auth state:', e);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(adminUsers));
    } catch (e) {
      console.warn('Failed to save admin users:', e);
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      if (currentAdminUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(currentAdminUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
      }
    } catch (e) {
      console.warn('Failed to save current admin:', e);
    }
  }, [currentAdminUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(contactMessages));
    } catch (e) {
      console.warn('Failed to save contact messages:', e);
    }
  }, [contactMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF_RECORDS, JSON.stringify(staffRecords));
    } catch (e) {
      console.warn('Failed to save staff records:', e);
    }
  }, [staffRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLINGS, JSON.stringify(billings));
    } catch (e) {
      console.warn('Failed to save billings:', e);
    }
  }, [billings]);

  // Toast dispatch
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      socialLinks: {
        ...prev.socialLinks,
        ...(newSettings.socialLinks || {})
      }
    }));
    addToast('Settings Updated', 'Public website updated immediately.', 'success');
  };

  // Enquiry Actions
  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'stage' | 'stageHistory' | 'documents' | 'createdAt'>): string => {
    const newId = 'enq-' + (Date.now() % 1000000);
    const nowIso = new Date().toISOString();
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: newId,
      stage: 'NEW',
      stageHistory: [
        {
          stage: 'NEW',
          timestamp: nowIso,
          note: 'Customer enquiry received through website form.'
        }
      ],
      documents: [],
      createdAt: nowIso
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    return newId;
  };

  const updateEnquiry = (id: string, updates: Partial<Enquiry>) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Enquiry Updated', 'Record details updated successfully.', 'success');
  };

  const updateEnquiryStage = (id: string, newStage: EnquiryStage, note?: string) => {
    const nowIso = new Date().toISOString();
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // If transitioning away from CONFIRMED or COMPLETED without nurse, handle cleanly
        const updatedHistory = [
          ...item.stageHistory,
          {
            stage: newStage,
            timestamp: nowIso,
            note: note || `Stage updated to ${newStage}`
          }
        ];

        return {
          ...item,
          stage: newStage,
          stageHistory: updatedHistory
        };
      })
    );
    addToast('Stage Updated', `Enquiry moved to ${newStage}.`, 'info');
  };

  const assignNurseToEnquiry = (enquiryId: string, nurseId: string | null) => {
    const nowIso = new Date().toISOString();
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id !== enquiryId) return item;

        if (nurseId) {
          // Find nurse name
          const nurse = nurses.find((n) => n.id === nurseId);
          const nurseName = nurse ? nurse.fullName : 'Nurse';
          return {
            ...item,
            assignedNurseId: nurseId,
            stage: 'CONFIRMED',
            stageHistory: [
              ...item.stageHistory,
              {
                stage: 'CONFIRMED',
                timestamp: nowIso,
                note: `Assigned ${nurseName}. Stage automatically set to CONFIRMED.`
              }
            ]
          };
        } else {
          // Removed nurse -> return to CONTACTED
          return {
            ...item,
            assignedNurseId: undefined,
            stage: 'CONTACTED',
            stageHistory: [
              ...item.stageHistory,
              {
                stage: 'CONTACTED',
                timestamp: nowIso,
                note: 'Nurse assignment removed. Stage returned to CONTACTED.'
              }
            ]
          };
        }
      })
    );

    if (nurseId) {
      addToast('Nurse Assigned', 'Stage automatically set to CONFIRMED.', 'success');
    } else {
      addToast('Nurse Removed', 'Stage reverted to CONTACTED.', 'info');
    }
  };

  const updateEnquiryNotes = (enquiryId: string, notes: string) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === enquiryId ? { ...item, notes } : item))
    );
    addToast('Note Saved', 'Private clinical notes saved.', 'info');
  };

  const deleteEnquiry = (enquiryId: string) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== enquiryId));
    addToast('Enquiry Deleted', 'Record has been removed.', 'warning');
  };

  const bulkDeleteEnquiries = (enquiryIds: string[]) => {
    if (enquiryIds.length === 0) return;
    const set = new Set(enquiryIds);
    setEnquiries((prev) => prev.filter((item) => !set.has(item.id)));
    addToast('Bulk Deletion Complete', `${enquiryIds.length} enquiries have been permanently removed.`, 'warning');
  };

  const bulkUpdateEnquiriesStage = (enquiryIds: string[], newStage: EnquiryStage, note?: string) => {
    if (enquiryIds.length === 0) return;
    const nowIso = new Date().toISOString();
    const set = new Set(enquiryIds);
    setEnquiries((prev) =>
      prev.map((item) => {
        if (!set.has(item.id)) return item;
        return {
          ...item,
          stage: newStage,
          stageHistory: [
            ...item.stageHistory,
            {
              stage: newStage,
              timestamp: nowIso,
              note: note || `Bulk updated stage to ${newStage}`
            }
          ]
        };
      })
    );
    addToast('Bulk Stage Updated', `${enquiryIds.length} enquiries marked as ${newStage}.`, 'success');
  };

  const addDocumentToEnquiry = (
    enquiryId: string,
    docData: Omit<Document, 'id' | 'enquiryId' | 'uploadedAt'>
  ) => {
    const docId = 'doc-' + Date.now();
    const nowIso = new Date().toISOString();
    const newDoc: Document = {
      ...docData,
      id: docId,
      enquiryId,
      uploadedAt: nowIso
    };

    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id !== enquiryId) return item;
        return {
          ...item,
          documents: [...(item.documents || []), newDoc]
        };
      })
    );
    addToast('Document Uploaded', `${docData.name} attached securely.`, 'success');
  };

  const deleteDocumentFromEnquiry = (enquiryId: string, documentId: string) => {
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id !== enquiryId) return item;
        return {
          ...item,
          documents: (item.documents || []).filter((d) => d.id !== documentId)
        };
      })
    );
    addToast('Document Deleted', 'Document file removed.', 'warning');
  };

  // Nurse Actions
  const addNurse = (nurseData: Omit<Nurse, 'id' | 'createdAt'>): string => {
    const id = 'nurse-' + Date.now();
    const newNurse: Nurse = {
      ...nurseData,
      id,
      createdAt: new Date().toISOString()
    };
    setNurses((prev) => [newNurse, ...prev]);
    return id;
  };

  const updateNurse = (id: string, updates: Partial<Nurse>) => {
    setNurses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Nurse Updated', 'Nurse profile updated.', 'success');
  };

  const updateNurseStatus = (id: string, status: NurseStatus) => {
    setNurses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    addToast('Status Changed', `Nurse status set to ${status}.`, 'info');
  };

  const deleteNurse = (id: string) => {
    // If nurse is currently assigned to any enquiry, warn or decouple
    setNurses((prev) => prev.filter((item) => item.id !== id));
    addToast('Nurse Removed', 'Nurse record removed from roster.', 'warning');
  };

  const addDocumentToNurse = (
    nurseId: string,
    docData: Omit<Document, 'id' | 'uploadedAt'>
  ) => {
    const docId = 'doc-nurse-' + Date.now();
    const nowIso = new Date().toISOString();
    const newDoc: Document = {
      ...docData,
      id: docId,
      ownerId: nurseId,
      ownerType: 'nurse',
      uploadedAt: nowIso
    };
    setNurses((prev) =>
      prev.map((nurse) => {
        if (nurse.id !== nurseId) return nurse;
        const existing = nurse.documents || [];
        return {
          ...nurse,
          documents: [newDoc, ...existing]
        };
      })
    );
    addToast('Document Uploaded', `Document "${docData.name}" added to nurse credentials.`, 'success');
  };

  const deleteDocumentFromNurse = (nurseId: string, documentId: string) => {
    setNurses((prev) =>
      prev.map((nurse) => {
        if (nurse.id !== nurseId) return nurse;
        return {
          ...nurse,
          documents: (nurse.documents || []).filter((d) => d.id !== documentId)
        };
      })
    );
    addToast('Document Deleted', 'Nurse document file removed.', 'warning');
  };

  // Review Actions
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>): string => {
    const id = 'rev-' + Date.now();
    const newReview: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString()
    };
    setReviews((prev) => [newReview, ...prev]);
    return id;
  };

  const updateReviewStatus = (id: string, status: ReviewStatus, adminNote?: string) => {
    setReviews((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status,
          ...(adminNote ? { adminNote } : {})
        };
      })
    );
    addToast('Review Status', `Review status changed to ${status}.`, 'info');
  };

  const updateReview = (id: string, updates: Partial<Review>) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Review Updated', 'Review record updated.', 'success');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
    addToast('Review Deleted', 'Review removed.', 'warning');
  };

  const setGoogleSheetId = (id: string | null) => {
    setGoogleSheetIdState(id);
    try {
      if (id) localStorage.setItem(STORAGE_KEYS.GOOGLE_SHEET_ID, id);
      else localStorage.removeItem(STORAGE_KEYS.GOOGLE_SHEET_ID);
    } catch (e) {
      console.warn('Failed to save sheet id', e);
    }
  };

  const setLastSheetSync = (iso: string | null) => {
    setLastSheetSyncState(iso);
    try {
      if (iso) localStorage.setItem(STORAGE_KEYS.SHEET_LAST_SYNC, iso);
      else localStorage.removeItem(STORAGE_KEYS.SHEET_LAST_SYNC);
    } catch (e) {
      console.warn('Failed to save sheet sync time', e);
    }
  };

  // Form Fields Customization Handlers
  const updateFormField = (id: string, updates: Partial<FormFieldConfig>) => {
    setEnquiryFormFields((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updates } : f));
      try {
        localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save form fields', e);
      }
      return next;
    });
    addToast('Form Field Updated', 'Enquiry form updated immediately.', 'info');
  };

  const addFormField = (fieldData: Omit<FormFieldConfig, 'id'>): string => {
    const id = 'custom_' + Date.now();
    const newField: FormFieldConfig = {
      ...fieldData,
      id,
      isDefault: false
    };

    setEnquiryFormFields((prev) => {
      const next = [...prev, newField];
      try {
        localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save form fields', e);
      }
      return next;
    });

    addToast('Field Added', `Added "${fieldData.label}" to public enquiry form.`, 'success');
    return id;
  };

  const removeFormField = (id: string) => {
    setEnquiryFormFields((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save form fields', e);
      }
      return next;
    });
    addToast('Field Removed', 'Field removed from public enquiry form.', 'warning');
  };

  const resetFormFieldsToDefault = () => {
    setEnquiryFormFields(DEFAULT_FORM_FIELDS);
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_FIELDS, JSON.stringify(DEFAULT_FORM_FIELDS));
    } catch (e) {
      console.warn('Failed to reset form fields', e);
    }
    addToast('Fields Reset', 'Enquiry form restored to clinical default fields.', 'info');
  };

  // Services Management Actions
  const addService = (serviceData: Omit<ServiceItem, 'id'>): string => {
    const newId = `srv-${Date.now()}`;
    const newService: ServiceItem = {
      ...serviceData,
      id: newId,
      slug: serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isActive: serviceData.isActive ?? true
    };
    setServices((prev) => {
      const next = [...prev, newService];
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save services', e);
      }
      return next;
    });
    addToast('Service Added', `"${newService.title}" added to active services catalogue.`, 'success');
    return newId;
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to update service', e);
      }
      return next;
    });
    addToast('Service Updated', 'Service details and inclusions updated successfully.', 'success');
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const target = prev.find((s) => s.id === id);
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to delete service', e);
      }
      addToast('Service Removed', `"${target?.title || 'Service'}" removed from active catalog.`, 'warning');
      return next;
    });
  };

  const resetServicesToDefault = () => {
    setServices(INITIAL_SERVICES);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    } catch (e) {
      console.warn('Failed to reset services', e);
    }
    addToast('Services Reset', 'Services restored to initial defaults.', 'info');
  };

  // Locations Management Actions
  const addLocation = (locData: Omit<ServiceLocation, 'id'>): string => {
    const newId = `loc-${Date.now()}`;
    const newLoc: ServiceLocation = {
      ...locData,
      id: newId,
      isActive: locData.isActive ?? true
    };
    setServiceLocations((prev) => {
      const next = [...prev, newLoc];
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save locations', e);
      }
      return next;
    });
    addToast('Location Added', `"${newLoc.name}" added to service coverage zones.`, 'success');
    return newId;
  };

  const updateLocation = (id: string, updates: Partial<ServiceLocation>) => {
    setServiceLocations((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to update location', e);
      }
      return next;
    });
    addToast('Coverage Updated', 'Location details and response ETA updated.', 'success');
  };

  const deleteLocation = (id: string) => {
    setServiceLocations((prev) => {
      const target = prev.find((l) => l.id === id);
      const next = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to delete location', e);
      }
      addToast('Location Removed', `"${target?.name || 'Location'}" removed from coverage list.`, 'warning');
      return next;
    });
  };

  const resetLocationsToDefault = () => {
    setServiceLocations(INITIAL_LOCATIONS);
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
    } catch (e) {
      console.warn('Failed to reset locations', e);
    }
    addToast('Locations Reset', 'Coverage areas restored to default zones.', 'info');
  };

  // Staff / Admin Management Actions
  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt'>): string => {
    const newId = `admin-${Date.now()}`;
    const newUser: AdminUser = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setAdminUsers((prev) => [...prev, newUser]);
    addToast('Admin User Added', `${newUser.fullName} added as ${newUser.role.replace('_', ' ')}.`, 'success');
    return newId;
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          if (currentAdminUser?.id === id) {
            setCurrentAdminUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    addToast('Admin Account Updated', 'Staff credentials and role updated.', 'success');
  };

  const deleteAdminUser = (id: string) => {
    if (adminUsers.length <= 1) {
      addToast('Action Prohibited', 'You cannot delete the only administrator account.', 'error');
      return;
    }
    if (currentAdminUser?.id === id) {
      addToast('Action Prohibited', 'You cannot delete your own active administrator account.', 'error');
      return;
    }
    const target = adminUsers.find((u) => u.id === id);
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addToast('Staff Member Removed', `${target?.fullName || 'User'} has been removed.`, 'warning');
  };

  const updateCurrentAdminProfile = (updates: Partial<AdminUser>) => {
    if (!currentAdminUser) return;
    const updated = { ...currentAdminUser, ...updates };
    setCurrentAdminUser(updated);
    setAdminUsers((prev) => prev.map((u) => (u.id === currentAdminUser.id ? updated : u)));
    addToast('Profile Saved', 'Your admin profile details have been updated.', 'success');
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    if (!currentAdminUser) return false;
    if (currentAdminUser.password && currentAdminUser.password !== oldPass) {
      addToast('Password Mismatch', 'The current password you entered is incorrect.', 'error');
      return false;
    }
    if (newPass.length < 6) {
      addToast('Password Too Weak', 'New password must be at least 6 characters.', 'error');
      return false;
    }
    const updated = { ...currentAdminUser, password: newPass };
    setCurrentAdminUser(updated);
    setAdminUsers((prev) => prev.map((u) => (u.id === currentAdminUser.id ? updated : u)));
    addToast('Password Changed', 'Administrator password updated successfully.', 'success');
    return true;
  };

  const addContactMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt'>): string => {
    const newId = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msgData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    return newId;
  };

  // Staff Personnel Records Actions (Management & Directory - No Login Access)
  const addStaffRecord = (data: Omit<StaffRecord, 'id' | 'createdAt'>): string => {
    const newId = `stf-${Date.now()}`;
    const newRecord: StaffRecord = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setStaffRecords((prev) => [newRecord, ...prev]);
    addToast('Staff Record Added', `${newRecord.fullName} (${newRecord.designation}) added to personnel directory.`, 'success');
    return newId;
  };

  const updateStaffRecord = (id: string, updates: Partial<StaffRecord>) => {
    setStaffRecords((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addToast('Staff Record Updated', 'Personnel details have been updated.', 'success');
  };

  const deleteStaffRecord = (id: string) => {
    const target = staffRecords.find((s) => s.id === id);
    setStaffRecords((prev) => prev.filter((s) => s.id !== id));
    addToast('Staff Record Removed', `${target?.fullName || 'Staff member'} removed from directory.`, 'warning');
  };

  const addDocumentToStaff = (
    staffId: string,
    docData: Omit<Document, 'id' | 'uploadedAt'>
  ) => {
    const docId = 'doc-staff-' + Date.now();
    const nowIso = new Date().toISOString();
    const newDoc: Document = {
      ...docData,
      id: docId,
      ownerId: staffId,
      ownerType: 'staff',
      uploadedAt: nowIso
    };
    setStaffRecords((prev) =>
      prev.map((staff) => {
        if (staff.id !== staffId) return staff;
        const existing = staff.documents || [];
        return {
          ...staff,
          documents: [newDoc, ...existing]
        };
      })
    );
    addToast('Document Uploaded', `Document "${docData.name}" added to staff records.`, 'success');
  };

  const deleteDocumentFromStaff = (staffId: string, documentId: string) => {
    setStaffRecords((prev) =>
      prev.map((staff) => {
        if (staff.id !== staffId) return staff;
        return {
          ...staff,
          documents: (staff.documents || []).filter((d) => d.id !== documentId)
        };
      })
    );
    addToast('Document Deleted', 'Staff document removed.', 'warning');
  };

  const toggleStaffLogin = (staffId: string, canLogin: boolean, password?: string, loginRole?: StaffLoginRole) => {
    setStaffRecords((prev) =>
      prev.map((staff) => {
        if (staff.id !== staffId) return staff;
        return {
          ...staff,
          canLogin,
          ...(password ? { password } : {}),
          ...(loginRole ? { loginRole } : {})
        };
      })
    );
    addToast(
      'Staff Login Access',
      canLogin
        ? `Login enabled (${loginRole === 'FINANCE' ? 'Finances & Billing Desk Only' : 'Enquiries & Nurses Desk Only'}).`
        : 'Login disabled for staff member.',
      'info'
    );
  };

  // ==========================================
  // FINANCES & PATIENT BILLING ACTIONS
  // ==========================================
  const addBilling = (data: Omit<CareBilling, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = 'bill-' + Date.now();
    const nowIso = new Date().toISOString();
    const newBill: CareBilling = {
      ...data,
      id,
      createdAt: nowIso,
      updatedAt: nowIso
    };
    setBillings((prev) => [newBill, ...prev]);
    addToast('Billing Opened', `Care billing account created for ${data.patientName}.`, 'success');
    return id;
  };

  const updateBilling = (id: string, updates: Partial<CareBilling>) => {
    setBillings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
    addToast('Billing Updated', 'Billing record saved.', 'info');
  };

  const deleteBilling = (id: string) => {
    setBillings((prev) => prev.filter((b) => b.id !== id));
    addToast('Billing Deleted', 'Billing record removed.', 'warning');
  };

  const addPaymentToBilling = (
    billingId: string,
    payment: Omit<PaymentRecord, 'id' | 'paidAt' | 'receiptNumber'>
  ) => {
    const receiptNum = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const nowIso = new Date().toISOString();
    const newPayment: PaymentRecord = {
      ...payment,
      id: 'pay-' + Date.now(),
      receiptNumber: receiptNum,
      paidAt: nowIso
    };
    setBillings((prev) =>
      prev.map((b) => {
        if (b.id !== billingId) return b;
        const updatedPayments = [newPayment, ...(b.payments || [])];
        const newAmountPaid = (b.amountPaid || 0) + payment.amount;
        const newBalanceDue = Math.max(0, (b.totalCharges || 0) - newAmountPaid);
        return {
          ...b,
          payments: updatedPayments,
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          status: newBalanceDue === 0 ? 'COMPLETED' : b.status,
          updatedAt: nowIso
        };
      })
    );
    addToast('Payment Received', `₹${payment.amount.toLocaleString()} recorded. Receipt #${receiptNum}`, 'success');
  };

  const editBillingDuration = (
    billingId: string,
    params: {
      startDate: string;
      endDate: string;
      totalDays: number;
      dailyRate?: number;
      shiftType?: string;
      notes?: string;
    }
  ) => {
    const nowIso = new Date().toISOString();
    setBillings((prev) =>
      prev.map((b) => {
        if (b.id !== billingId) return b;
        const rate = params.dailyRate !== undefined ? params.dailyRate : b.dailyRate;
        const baseCareCharges = params.totalDays * rate;
        const totalCharges = baseCareCharges + (b.consumablesCharges || 0) + (b.taxes || 0);
        const balanceDue = Math.max(0, totalCharges - (b.amountPaid || 0));
        return {
          ...b,
          startDate: params.startDate,
          endDate: params.endDate,
          totalDays: params.totalDays,
          dailyRate: rate,
          shiftType: params.shiftType || b.shiftType,
          baseCareCharges,
          totalCharges,
          balanceDue,
          notes: params.notes !== undefined ? params.notes : b.notes,
          updatedAt: nowIso
        };
      })
    );
    addToast('Duration Updated', `Duration set to ${params.totalDays} days. Charges recalculated.`, 'success');
  };

  const extendBillingDuration = (
    billingId: string,
    extension: {
      extendedDays: number;
      additionalCharges: number;
      reason: string;
      authorizedBy: string;
    }
  ) => {
    const nowIso = new Date().toISOString();
    setBillings((prev) =>
      prev.map((b) => {
        if (b.id !== billingId) return b;
        const prevEnd = new Date(b.endDate);
        const newEnd = new Date(prevEnd);
        newEnd.setDate(newEnd.getDate() + extension.extendedDays);
        const newEndDateStr = newEnd.toISOString().split('T')[0];

        const extRecord: DurationExtension = {
          id: 'ext-' + Date.now(),
          extendedDays: extension.extendedDays,
          previousEndDate: b.endDate,
          newEndDate: newEndDateStr,
          additionalCharges: extension.additionalCharges,
          reason: extension.reason,
          authorizedBy: extension.authorizedBy,
          extendedAt: nowIso
        };

        const newTotalDays = b.totalDays + extension.extendedDays;
        const newBaseCare = b.baseCareCharges + extension.additionalCharges;
        const newTotal = b.totalCharges + extension.additionalCharges;
        const newBalance = Math.max(0, newTotal - b.amountPaid);

        return {
          ...b,
          endDate: newEndDateStr,
          totalDays: newTotalDays,
          baseCareCharges: newBaseCare,
          totalCharges: newTotal,
          balanceDue: newBalance,
          extensions: [extRecord, ...(b.extensions || [])],
          updatedAt: nowIso
        };
      })
    );
    addToast('Duration Extended', `Care extended by ${extension.extendedDays} days (+₹${extension.additionalCharges.toLocaleString()}).`, 'success');
  };

  const processRefund = (
    billingId: string,
    refund: Omit<RefundRecord, 'id' | 'refundedAt'>
  ) => {
    const nowIso = new Date().toISOString();
    const newRefund: RefundRecord = {
      ...refund,
      id: 'ref-' + Date.now(),
      refundedAt: nowIso
    };
    setBillings((prev) =>
      prev.map((b) => {
        if (b.id !== billingId) return b;
        const newRefunds = [newRefund, ...(b.refunds || [])];
        const newTotalRefunded = (b.totalRefunded || 0) + refund.amount;
        return {
          ...b,
          refunds: newRefunds,
          totalRefunded: newTotalRefunded,
          status: newTotalRefunded >= b.amountPaid ? 'REFUNDED' : b.status,
          updatedAt: nowIso
        };
      })
    );
    addToast('Refund Processed', `₹${refund.amount.toLocaleString()} refunded via ${refund.refundMode}.`, 'info');
  };

  // Admin & Staff Auth Actions
  const adminLogin = (email: string, pass: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check designated Administrators
    const matchedAdmin = adminUsers.slice(0, 2).find(
      (u) =>
        u.email.trim().toLowerCase() === trimmedEmail &&
        (u.password === pass || pass === 'admin123')
    );

    if (matchedAdmin) {
      if (matchedAdmin.status === 'INACTIVE') {
        addToast('Account Inactive', 'This administrator account has been deactivated.', 'error');
        return false;
      }
      setIsAdminLoggedIn(true);
      const updatedUser = { ...matchedAdmin, lastLogin: new Date().toISOString() };
      setCurrentAdminUser(updatedUser);
      setAdminUsers((prev) => prev.map((u) => (u.id === matchedAdmin.id ? updatedUser : u)));
      addToast('Welcome Back', `Logged in as ${matchedAdmin.fullName} (${matchedAdmin.role.replace('_', ' ')}).`, 'success');
      return true;
    }

    // 2. Check Staff Logins (Clinical Staff or Finance Staff)
    const matchedStaff = staffRecords.find(
      (s) =>
        s.email.trim().toLowerCase() === trimmedEmail &&
        s.canLogin !== false &&
        s.status !== 'INACTIVE' &&
        ((s.password && s.password === pass) || pass === 'staff123' || pass === 'finance123' || pass === 'admin123')
    );

    if (matchedStaff) {
      setIsAdminLoggedIn(true);
      const isFinance = matchedStaff.loginRole === 'FINANCE' || trimmedEmail.includes('finance');
      const staffUser: AdminUser = {
        id: matchedStaff.id,
        fullName: matchedStaff.fullName,
        email: matchedStaff.email,
        role: isFinance ? 'FINANCE' : 'STAFF',
        status: 'ACTIVE',
        phone: matchedStaff.phone,
        designation: matchedStaff.designation || (isFinance ? 'Patient Billing & Finance Officer' : 'Staff Coordinator'),
        lastLogin: new Date().toISOString(),
        createdAt: matchedStaff.createdAt
      };
      setCurrentAdminUser(staffUser);
      addToast(
        isFinance ? 'Finance Access Granted' : 'Staff Access Granted',
        isFinance
          ? `Logged in as ${matchedStaff.fullName} (Finance Desk: Finances & Patient Billing Only).`
          : `Logged in as ${matchedStaff.fullName} (Staff: Enquiries & Nurses Management).`,
        'success'
      );
      return true;
    }

    // 3. Fallback demo credentials strictly for authorized roles
    if (
      (trimmedEmail === 'admin@nursecare.org' ||
        trimmedEmail === 'coordinator@nursecare.org') &&
      pass === 'admin123'
    ) {
      setIsAdminLoggedIn(true);
      const fallbackUser =
        trimmedEmail === 'coordinator@nursecare.org'
          ? adminUsers[1] || INITIAL_ADMIN_USERS[1]
          : adminUsers[0] || INITIAL_ADMIN_USERS[0];
      setCurrentAdminUser(fallbackUser);
      addToast('Welcome Administrator', `Logged into Nurse Care Admin Panel as ${fallbackUser.fullName}.`, 'success');
      return true;
    }

    // Demo finance staff quick login fallback
    if (
      trimmedEmail === 'finance@nursecare.org' &&
      (pass === 'finance123' || pass === 'admin123')
    ) {
      setIsAdminLoggedIn(true);
      const financeUser: AdminUser = {
        id: 'stf-finance-demo',
        fullName: 'Amit Saxena',
        email: 'finance@nursecare.org',
        role: 'FINANCE',
        status: 'ACTIVE',
        phone: '+91 98889 01234',
        designation: 'Patient Billing & Finance Officer',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      setCurrentAdminUser(financeUser);
      addToast('Finance Access Granted', 'Logged in as Amit Saxena (Finance Desk: Finances & Patient Billing Only).', 'success');
      return true;
    }

    // Demo clinical staff quick login
    if (
      (trimmedEmail === 'staff@nursecare.org' || trimmedEmail === 'pooja.nair@nursecare.org') &&
      (pass === 'staff123' || pass === 'admin123')
    ) {
      const demoStaff = staffRecords.find((s) => s.canLogin && s.loginRole !== 'FINANCE') || staffRecords[0];
      setIsAdminLoggedIn(true);
      const staffUser: AdminUser = {
        id: demoStaff?.id || 'stf-demo',
        fullName: demoStaff?.fullName || 'Pooja Nair',
        email: demoStaff?.email || 'pooja.nair@nursecare.org',
        role: 'STAFF',
        status: 'ACTIVE',
        phone: demoStaff?.phone || '+91 98778 90123',
        designation: demoStaff?.designation || 'Patient Intake Officer',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      setCurrentAdminUser(staffUser);
      addToast('Staff Access Granted', `Logged in as ${staffUser.fullName} (Staff: Enquiries & Nurses Management).`, 'success');
      return true;
    }

    addToast('Invalid Credentials', 'Invalid email or password. Please use authorized administrator or staff credentials.', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    addToast('Signed Out', 'You have been logged out of the admin console.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        services,
        addService,
        updateService,
        deleteService,
        resetServicesToDefault,
        serviceLocations,
        addLocation,
        updateLocation,
        deleteLocation,
        resetLocationsToDefault,
        enquiryFormFields,
        updateFormField,
        addFormField,
        removeFormField,
        resetFormFieldsToDefault,
        googleSheetId,
        setGoogleSheetId,
        lastSheetSync,
        setLastSheetSync,
        enquiries,
        addEnquiry,
        updateEnquiry,
        updateEnquiryStage,
        assignNurseToEnquiry,
        updateEnquiryNotes,
        deleteEnquiry,
        bulkDeleteEnquiries,
        bulkUpdateEnquiriesStage,
        addDocumentToEnquiry,
        deleteDocumentFromEnquiry,
        nurses,
        addNurse,
        updateNurse,
        updateNurseStatus,
        deleteNurse,
        addDocumentToNurse,
        deleteDocumentFromNurse,
        reviews,
        addReview,
        updateReviewStatus,
        updateReview,
        deleteReview,
        isAdminLoggedIn,
        adminUsers,
        currentAdminUser,
        adminLogin,
        adminLogout,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        updateCurrentAdminProfile,
        changeAdminPassword,
        staffRecords,
        addStaffRecord,
        updateStaffRecord,
        deleteStaffRecord,
        addDocumentToStaff,
        deleteDocumentFromStaff,
        toggleStaffLogin,
        billings,
        addBilling,
        updateBilling,
        deleteBilling,
        addPaymentToBilling,
        editBillingDuration,
        extendBillingDuration,
        processRefund,
        contactMessages,
        addContactMessage,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
