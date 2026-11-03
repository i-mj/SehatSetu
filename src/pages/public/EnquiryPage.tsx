/**
 * Nurse Care - Public Patient Care Enquiry Form
 * Captures patient care needs with client-side validation, honeypot protection,
 * dynamic field configuration from Admin Form Builder, custom questions support,
 * stage NEW dispatch, simulated admin email notification, and clear confirmation view.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Stethoscope,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Hash,
  List
} from 'lucide-react';

export const EnquiryPage: React.FC = () => {
  const { services, serviceLocations, addEnquiry, addToast, enquiryFormFields } = useApp();
  const [searchParams] = useSearchParams();

  // Core Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  // Custom Form fields state (for any questions added via Admin Form Builder)
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // Honeypot field (hidden from real users, spambots fill it)
  const [honeypotField, setHoneypotField] = useState('');

  // Status & validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // Field configurations from AppContext Form Builder
  const fnConfig = enquiryFormFields.find((f) => f.id === 'fullName');
  const phConfig = enquiryFormFields.find((f) => f.id === 'phone');
  const emConfig = enquiryFormFields.find((f) => f.id === 'email');
  const srConfig = enquiryFormFields.find((f) => f.id === 'serviceId');
  const ctConfig = enquiryFormFields.find((f) => f.id === 'cityArea');
  const dtConfig = enquiryFormFields.find((f) => f.id === 'preferredDate');
  const mgConfig = enquiryFormFields.find((f) => f.id === 'message');

  // Any non-default custom fields that are enabled
  const activeCustomFields = enquiryFormFields.filter((f) => !f.isDefault && f.enabled);

  // Pre-fill service and area from URL if provided
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && services.some((s) => s.id === serviceParam)) {
      setServiceId(serviceParam);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }

    const areaParam = searchParams.get('area');
    if (areaParam && !cityArea) {
      setCityArea(areaParam);
    }
  }, [searchParams, services]);

  // Compute minimum selectable date (today in YYYY-MM-DD)
  const todayString = new Date().toISOString().split('T')[0];

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomValues((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (fnConfig?.enabled) {
      if (fnConfig.required && (!fullName.trim() || fullName.trim().length < 2)) {
        newErrors.fullName = 'Please enter a valid full name (minimum 2 characters).';
      }
    }

    // Phone validation
    if (phConfig?.enabled) {
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      if (phConfig.required && (!cleanedPhone || cleanedPhone.length < 10 || cleanedPhone.length > 15)) {
        newErrors.phone = 'Please enter a valid phone number (10 to 15 digits).';
      }
    }

    // Email format
    if (emConfig?.enabled) {
      if (emConfig.required && !email.trim()) {
        newErrors.email = 'Please enter an email address.';
      } else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    // Service dropdown validation
    if (srConfig?.enabled && srConfig.required && !serviceId) {
      newErrors.serviceId = 'Please select a nursing service.';
    }

    // City/Area validation
    if (ctConfig?.enabled && ctConfig.required && !cityArea.trim()) {
      newErrors.cityArea = 'Please enter your city, locality, or sector.';
    }

    // Preferred date validation
    if (dtConfig?.enabled) {
      if (dtConfig.required && !preferredDate) {
        newErrors.preferredDate = 'Please select a preferred start date.';
      } else if (preferredDate && preferredDate < todayString) {
        newErrors.preferredDate = 'Preferred date cannot be in the past.';
      }
    }

    // Message validation if marked required
    if (mgConfig?.enabled && mgConfig.required && !message.trim()) {
      newErrors.message = 'Please provide details about the patient care requirements.';
    }

    // Custom fields validation
    activeCustomFields.forEach((cf) => {
      const val = customValues[cf.name] || '';
      if (cf.required && !val.trim()) {
        newErrors[cf.name] = `${cf.label} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot: if filled, silently ignore bot
    if (honeypotField) {
      setIsSubmittedSuccess(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic network delay
    setTimeout(() => {
      const newId = addEnquiry({
        fullName: fullName.trim() || 'Patient',
        phone: phone.trim() || 'N/A',
        email: email.trim(),
        serviceId: serviceId || (services[0]?.id ?? 'service-1'),
        cityArea: cityArea.trim() || 'Local Area',
        preferredDate: preferredDate || todayString,
        message: message.trim(),
        customFields: Object.keys(customValues).length > 0 ? customValues : undefined
      });

      // Dispatch simulated email notification toast
      addToast(
        'Email alert sent to admin',
        `New enquiry #${newId} for ${fullName.trim()} registered. Duty supervisor notified.`,
        'success'
      );

      setSubmittedEnquiryId(newId);
      setIsSubmittedSuccess(true);
      setIsSubmitting(false);
    }, 450);
  };

  const handleResetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCityArea('');
    setPreferredDate('');
    setMessage('');
    setCustomValues({});
    setErrors({});
    setIsSubmittedSuccess(false);
    setSubmittedEnquiryId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Enquire Now - Book Home Nursing Care"
        description="Submit your home nursing care enquiry. Certified nurses for elderly care, wound dressing, IV care, and attendant assistance."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/20 to-white pt-14 pb-10 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Official Clinical Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Book a Trained Nurse for Care at Home
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Fill in the patient’s clinical requirements below. Our duty coordinator reviews doctor recommendations and reaches out within 30 minutes.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isSubmittedSuccess ? (
          /* Thank You / Confirmation State */
          <div className="bg-[#effaf8] border border-teal-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#0f8672] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f8672] uppercase tracking-wider">
                Booking Reference #{submittedEnquiryId}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Thank you for reaching out to Nurse Care!
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
                Your enquiry has been received and prioritized at stage <strong className="text-teal-800">NEW</strong>. Our clinical coordinator will call <strong className="text-slate-900">{phone}</strong> shortly to confirm the prescription and finalize nurse scheduling.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-teal-100 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700 shadow-2xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Patient / Contact:</span>
                <span className="font-semibold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Selected Service:</span>
                <span className="font-semibold text-slate-900">
                  {services.find((s) => s.id === serviceId)?.title || 'Home Nursing'}
                </span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Coverage Location:</span>
                <span className="font-semibold text-slate-900">{cityArea}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Preferred Start Date:</span>
                <span className="font-semibold text-slate-900">{preferredDate || 'Earliest available'}</span>
              </div>

              {/* Submitted Custom Fields */}
              {Object.keys(customValues).length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Additional Details Provided
                  </span>
                  {Object.entries(customValues).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[11px]">
                      <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-semibold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold text-xs rounded-xl shadow transition-colors"
              >
                Submit Another Enquiry
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Enquiry Form */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot field (hidden from accessibility tree & visual rendering) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_source">Leave this blank</label>
                <input
                  type="text"
                  id="website_source"
                  tabIndex={-1}
                  value={honeypotField}
                  onChange={(e) => setHoneypotField(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                {fnConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {fnConfig?.label || 'Patient or Caregiver Full Name'} {fnConfig?.required && <span className="text-rose-600">*</span>}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="fullName"
                        type="text"
                        required={fnConfig?.required}
                        placeholder={fnConfig?.placeholder || 'e.g. Eleanor Vance'}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {fnConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{fnConfig.helpText}</p>
                    )}
                    {errors.fullName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Phone */}
                {phConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {phConfig?.label || 'Phone / Mobile Number'} {phConfig?.required && <span className="text-rose-600">*</span>}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="phone"
                        type="tel"
                        required={phConfig?.required}
                        placeholder={phConfig?.placeholder || 'e.g. 9811223344 (10 to 15 digits)'}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {phConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{phConfig.helpText}</p>
                    )}
                    {errors.phone && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                {emConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {emConfig?.label || 'Email Address'}{' '}
                      {emConfig?.required ? (
                        <span className="text-rose-600">*</span>
                      ) : (
                        <span className="text-slate-400 font-normal lowercase">(optional for updates)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="email"
                        type="email"
                        required={emConfig?.required}
                        placeholder={emConfig?.placeholder || 'e.g. family@example.com'}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {emConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{emConfig.helpText}</p>
                    )}
                    {errors.email && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Service Dropdown */}
                {srConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="serviceId"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {srConfig?.label || 'Nursing Service Required'} {srConfig?.required && <span className="text-rose-600">*</span>}
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        id="serviceId"
                        required={srConfig?.required}
                        value={serviceId}
                        onChange={(e) => {
                          setServiceId(e.target.value);
                          if (errors.serviceId) setErrors((prev) => ({ ...prev, serviceId: '' }));
                        }}
                        className={`w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.serviceId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      >
                        <option value="">Select a service...</option>
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    {srConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{srConfig.helpText}</p>
                    )}
                    {errors.serviceId && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.serviceId}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* City / Area */}
                {ctConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="cityArea"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {ctConfig?.label || 'City / Locality / Sector'} {ctConfig?.required && <span className="text-rose-600">*</span>}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="cityArea"
                        type="text"
                        required={ctConfig?.required}
                        placeholder={ctConfig?.placeholder || 'e.g. Vasant Vihar, New Delhi / DLF Phase 2'}
                        value={cityArea}
                        onChange={(e) => {
                          setCityArea(e.target.value);
                          if (errors.cityArea) setErrors((prev) => ({ ...prev, cityArea: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.cityArea ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {ctConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{ctConfig.helpText}</p>
                    )}

                    {/* Active Coverage Locations Suggestions */}
                    {serviceLocations.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold">Active Zones:</span>
                        {serviceLocations
                          .filter((l) => l.isActive !== false)
                          .map((loc) => (
                            <button
                              key={loc.id}
                              type="button"
                              onClick={() => {
                                setCityArea(loc.name);
                                if (errors.cityArea) setErrors((prev) => ({ ...prev, cityArea: '' }));
                              }}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-[#0f8672] text-slate-600 transition-colors font-medium border border-slate-200/60"
                              title={`Select ${loc.name} (${loc.responseEta})`}
                            >
                              {loc.name}
                            </button>
                          ))}
                      </div>
                    )}
                    {errors.cityArea && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.cityArea}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Preferred Date */}
                {dtConfig?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {dtConfig?.label || 'Preferred Start Date'}{' '}
                      {dtConfig?.required ? (
                        <span className="text-rose-600">*</span>
                      ) : (
                        <span className="text-slate-400 font-normal lowercase">(no past dates)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="preferredDate"
                        type="date"
                        min={todayString}
                        required={dtConfig?.required}
                        value={preferredDate}
                        onChange={(e) => {
                          setPreferredDate(e.target.value);
                          if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          errors.preferredDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {dtConfig?.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{dtConfig.helpText}</p>
                    )}
                    {errors.preferredDate && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.preferredDate}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Custom Fields configured by Administrator */}
                {activeCustomFields.map((cf) => (
                  <div key={cf.id} className={cf.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label
                      htmlFor={`custom_${cf.name}`}
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      {cf.label} {cf.required && <span className="text-rose-600">*</span>}
                    </label>

                    <div className="relative">
                      {cf.type === 'select' ? (
                        <select
                          id={`custom_${cf.name}`}
                          required={cf.required}
                          value={customValues[cf.name] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.name, e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                            errors[cf.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          }`}
                        >
                          <option value="">Select an option...</option>
                          {cf.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : cf.type === 'textarea' ? (
                        <textarea
                          id={`custom_${cf.name}`}
                          rows={3}
                          required={cf.required}
                          placeholder={cf.placeholder || ''}
                          value={customValues[cf.name] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.name, e.target.value)}
                          className={`w-full p-3.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                            errors[cf.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          }`}
                        />
                      ) : (
                        <input
                          id={`custom_${cf.name}`}
                          type={cf.type}
                          required={cf.required}
                          placeholder={cf.placeholder || ''}
                          value={customValues[cf.name] || ''}
                          onChange={(e) => handleCustomFieldChange(cf.name, e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                            errors[cf.name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    {cf.helpText && (
                      <p className="text-[11px] text-slate-400 mt-1">{cf.helpText}</p>
                    )}

                    {errors[cf.name] && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors[cf.name]}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Message / Patient condition */}
              {mgConfig?.enabled !== false && (
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                  >
                    {mgConfig?.label || 'Patient Medical Condition & Specific Requirements'}{' '}
                    {mgConfig?.required && <span className="text-rose-600">*</span>}
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      rows={4}
                      required={mgConfig?.required}
                      placeholder={mgConfig?.placeholder || 'Describe patient age, diagnosis, mobility level, shift preferences, or ongoing doctor prescriptions...'}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      className={`w-full p-3.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                        errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {mgConfig?.helpText && (
                    <p className="text-[11px] text-slate-400 mt-1">{mgConfig.helpText}</p>
                  )}
                  {errors.message && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Confidential. Prescriptions and medical histories are shared strictly with assigned clinical staff.</span>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      <span>Sending Enquiry to Clinical Desk...</span>
                    </>
                  ) : (
                    <>
                      <span>Enquiry Now</span>
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
