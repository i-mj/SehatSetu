/**
 * Nurse Care - Hidden Nurse Onboarding Page
 * Route: /join/nurse-7k2x (Not linked in primary navigation or footer)
 * Captures nurse credentials, government ID, experience, and creates Nurse with PENDING status.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { NurseIdType, Document } from '../../types';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  ArrowRight,
  UploadCloud,
  FileText,
  Trash2,
  Paperclip
} from 'lucide-react';

export const NurseOnboardingPage: React.FC = () => {
  const { addNurse, addToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [idType, setIdType] = useState<NurseIdType>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');

  // Document Upload State in Nurse Onboarding Form
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>('Nursing Registration Certificate');
  const [uploadDocCustomName, setUploadDocCustomName] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdNurseId, setCreatedNurseId] = useState<string | null>(null);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const cleanCategory = uploadCategory.trim();
      const finalName = uploadDocCustomName.trim()
        ? `${cleanCategory} - ${uploadDocCustomName.trim()}`
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
        uploadedBy: fullName.trim() || 'Nurse Applicant'
      };

      setUploadedDocs((prev) => [...prev, newDoc]);
      setUploadDocCustomName('');
      addToast('Document Attached', `${finalName} attached successfully.`, 'success');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docId: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
    addToast('Document Removed', 'Attached document removed from application.', 'info');
  };

  const validate = (): boolean => {
    const err: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      err.fullName = 'Full legal name must be at least 2 characters.';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
      err.phone = 'Please provide a valid 10-15 digit phone number.';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = 'Valid professional email address is required.';
    }

    if (!city.trim()) {
      err.city = 'Please specify your active practice city.';
    }

    if (!qualification.trim()) {
      err.qualification = 'Please state your nursing degree (e.g. B.Sc Nursing, GNM, Post-Basic).';
    }

    if (!idNumber.trim() || idNumber.trim().length < 4) {
      err.idNumber = 'Please provide a valid government ID number.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const nurseId = addNurse({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        qualification: qualification.trim(),
        yearsOfExperience: Number(yearsOfExperience) || 0,
        idType,
        idNumber: idNumber.trim(),
        status: 'PENDING',
        bio: `${qualification.trim()} registered professional with ${yearsOfExperience} years of practical bedside experience in ${city.trim()}.`,
        documents: uploadedDocs
      });

      addToast(
        'Nurse Application Received',
        `Application for ${fullName.trim()} registered with status PENDING. ${uploadedDocs.length} credential document(s) attached.`,
        'success'
      );

      setCreatedNurseId(nurseId);
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 450);
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCity('');
    setQualification('');
    setYearsOfExperience(3);
    setIdType('Aadhaar');
    setIdNumber('');
    setUploadedDocs([]);
    setUploadDocCustomName('');
    setErrors({});
    setIsSuccess(false);
    setCreatedNurseId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-7">
      <PageSeo
        title="Clinical Nurse Credentialing Portal"
        description="Confidential intake portal for qualified nursing professionals applying to the Nurse Care roster."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-7">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-[#0e6b5c] text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Clinical Healthcare Professionals Intake</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Nurse Registration & Onboarding
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Join our certified network of home healthcare practitioners. All submissions undergo council verification and background clearance.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white border border-teal-200 rounded-2xl p-6 sm:p-7 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#0f8672] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0f8672] uppercase tracking-wider">
                Application #{createdNurseId}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Application Submitted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                Thank you, <strong className="text-slate-900">{fullName}</strong>. Your profile has been created with status <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">PENDING</strong>. Our Nursing Superintendent will verify your {idType} credentials and schedule a clinical screening call.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 pb-5 border-b border-slate-100 mb-6">
              <UserPlus className="w-5 h-5 text-[#0f8672]" />
              <h2 className="text-base font-bold text-slate-900">
                Professional Details & Identification
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Full Legal Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nurse Sunita Roy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9871234560"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sunita.roy@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    City of Practice <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi, Gurugram, Noida"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  {errors.city && (
                    <p className="text-xs text-rose-600 mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Qualification */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Highest Nursing Qualification & Certifications <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc Nursing, GNM, Critical Care Certified, Stoma Care"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  {errors.qualification && (
                    <p className="text-xs text-rose-600 mt-1">{errors.qualification}</p>
                  )}
                </div>

                {/* Years of experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Years of Clinical Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                </div>

                {/* ID Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Government ID Document <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as NurseIdType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Other">Other Official ID</option>
                  </select>
                </div>

                {/* ID Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Government ID Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter ID document number for background verification"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-2 focus-visible:outline-teal-700"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>ID numbers are encrypted and masked on the admin roster (only last 4 characters visible).</span>
                  </p>
                  {errors.idNumber && (
                    <p className="text-xs text-rose-600 mt-1">{errors.idNumber}</p>
                  )}
                </div>
              </div>

              {/* Document Upload Section for Nurse Credentials */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#0f8672] flex items-center justify-center">
                      <FileBadge className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Upload Credential Documents
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Upload degree diploma, registration council certificate, ID, or police check (PDF, JPG, PNG &lt; 10MB)
                      </p>
                    </div>
                  </div>
                  {uploadedDocs.length > 0 && (
                    <span className="px-2 py-0.5 bg-teal-100 text-[#0f8672] text-[10px] font-bold rounded-full">
                      {uploadedDocs.length} attached
                    </span>
                  )}
                </div>

                {/* Upload inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Document Type
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Nursing Registration Certificate">State Nursing Registration Certificate</option>
                      <option value="Degree / Diploma Certificate">B.Sc / GNM Degree Diploma</option>
                      <option value="Government Photo ID">Government Photo ID (Aadhaar / Passport)</option>
                      <option value="Police Verification Certificate">Police Verification Record</option>
                      <option value="Hospital Experience Letter">Hospital Experience Letter</option>
                      <option value="BLS / ACLS Certification">BLS / ACLS Certification</option>
                      <option value="Other Clinical Certificate">Other Clinical Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Document Name / Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi Council Reg 2023"
                      value={uploadDocCustomName}
                      onChange={(e) => setUploadDocCustomName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 rounded-xl transition-colors text-xs font-semibold text-teal-800">
                    <UploadCloud className="w-4 h-4 text-teal-600" />
                    <span>Choose File to Attach</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleDocUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached files list */}
                {uploadedDocs.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700">Attached for Onboarding:</div>
                    {uploadedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 block truncate">{doc.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {(doc.fileSize / 1024).toFixed(1)} KB · {doc.fileType.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Registering Application...'
                  ) : (
                    <>
                      <span>Submit Onboarding Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
