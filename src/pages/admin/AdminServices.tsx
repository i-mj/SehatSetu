/**
 * Nurse Care - Admin Services & Locations Management
 * Allows administrators to add, edit, and remove clinical services, customize
 * bullet points, FAQs, icons, descriptions, and manage available service locations/coverage zones.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { ServiceItem, ServiceLocation, ServiceFAQ } from '../../types';
import {
  HeartHandshake,
  ShieldAlert,
  Syringe,
  UserCheck,
  Clock,
  HeartPulse,
  Activity,
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  MapPin,
  HelpCircle,
  ListChecks,
  RotateCcw,
  Sparkles,
  Info,
  X,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AVAILABLE_ICONS = [
  { name: 'HeartHandshake', label: 'Elderly / Compassion', icon: HeartHandshake },
  { name: 'ShieldAlert', label: 'Wound / Surgical Care', icon: ShieldAlert },
  { name: 'Syringe', label: 'Injections / IV', icon: Syringe },
  { name: 'UserCheck', label: 'Attendant / Personal Care', icon: UserCheck },
  { name: 'Clock', label: 'Short Visits / Vitals', icon: Clock },
  { name: 'HeartPulse', label: 'Cardiac / Vitals', icon: HeartPulse },
  { name: 'Activity', label: 'Intensive / Monitor', icon: Activity },
  { name: 'Stethoscope', label: 'Clinical Assessment', icon: Stethoscope }
];

export const AdminServices: React.FC = () => {
  const {
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
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'locations'>('services');
  const [searchTerm, setSearchTerm] = useState('');

  // Service Edit / Create Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<{
    title: string;
    slug: string;
    iconName: string;
    shortDescription: string;
    fullDescription: string;
    pricingNote: string;
    isActive: boolean;
    locations: string[];
    bulletPoints: string[];
    faqs: ServiceFAQ[];
  }>({
    title: '',
    slug: '',
    iconName: 'HeartHandshake',
    shortDescription: '',
    fullDescription: '',
    pricingNote: '',
    isActive: true,
    locations: [],
    bulletPoints: [''],
    faqs: [{ question: '', answer: '' }]
  });

  // Location Edit / Create Modal State
  const [editingLocation, setEditingLocation] = useState<ServiceLocation | null>(null);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState<{
    name: string;
    city: string;
    popularAreasInput: string;
    responseEta: string;
    isActive: boolean;
    notes: string;
  }>({
    name: '',
    city: '',
    popularAreasInput: '',
    responseEta: 'Within 2 to 3 hours',
    isActive: true,
    notes: ''
  });

  // Delete Confirmations
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);
  const [confirmDeleteLocId, setConfirmDeleteLocId] = useState<string | null>(null);

  // Helper to open Service Editor
  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setIsCreatingService(false);
    setServiceForm({
      title: service.title,
      slug: service.slug,
      iconName: service.iconName || 'HeartHandshake',
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      pricingNote: service.pricingNote || '',
      isActive: service.isActive ?? true,
      locations: service.locations && service.locations.length > 0 ? service.locations : serviceLocations.map((l) => l.id),
      bulletPoints: service.bulletPoints && service.bulletPoints.length > 0 ? [...service.bulletPoints] : [''],
      faqs: service.faqs && service.faqs.length > 0 ? [...service.faqs] : [{ question: '', answer: '' }]
    });
  };

  const handleOpenCreateService = () => {
    setEditingService(null);
    setIsCreatingService(true);
    setServiceForm({
      title: '',
      slug: '',
      iconName: 'HeartHandshake',
      shortDescription: '',
      fullDescription: '',
      pricingNote: 'Hourly / Shift based',
      isActive: true,
      locations: serviceLocations.map((l) => l.id),
      bulletPoints: ['Comprehensive vital monitoring', 'Clinical medication dispensing'],
      faqs: [{ question: 'What is required prior to this service?', answer: 'A doctor prescription or hospital summary is required.' }]
    });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) {
      addToast('Validation Error', 'Service title cannot be empty.', 'error');
      return;
    }

    const cleanedBullets = serviceForm.bulletPoints.map((b) => b.trim()).filter((b) => b.length > 0);
    const cleanedFaqs = serviceForm.faqs
      .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
      .filter((f) => f.question.length > 0 && f.answer.length > 0);

    const slug =
      serviceForm.slug.trim() ||
      serviceForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (isCreatingService) {
      addService({
        title: serviceForm.title.trim(),
        slug,
        iconName: serviceForm.iconName,
        shortDescription: serviceForm.shortDescription.trim(),
        fullDescription: serviceForm.fullDescription.trim(),
        pricingNote: serviceForm.pricingNote.trim(),
        isActive: serviceForm.isActive,
        locations: serviceForm.locations,
        bulletPoints: cleanedBullets.length > 0 ? cleanedBullets : ['Clinical home assessment included'],
        faqs: cleanedFaqs
      });
      setIsCreatingService(false);
    } else if (editingService) {
      updateService(editingService.id, {
        title: serviceForm.title.trim(),
        slug,
        iconName: serviceForm.iconName,
        shortDescription: serviceForm.shortDescription.trim(),
        fullDescription: serviceForm.fullDescription.trim(),
        pricingNote: serviceForm.pricingNote.trim(),
        isActive: serviceForm.isActive,
        locations: serviceForm.locations,
        bulletPoints: cleanedBullets.length > 0 ? cleanedBullets : ['Clinical home assessment included'],
        faqs: cleanedFaqs
      });
      setEditingService(null);
    }
  };

  // Helper to open Location Editor
  const handleOpenEditLocation = (loc: ServiceLocation) => {
    setEditingLocation(loc);
    setIsCreatingLocation(false);
    setLocationForm({
      name: loc.name,
      city: loc.city,
      popularAreasInput: loc.popularAreas.join(', '),
      responseEta: loc.responseEta,
      isActive: loc.isActive,
      notes: loc.notes || ''
    });
  };

  const handleOpenCreateLocation = () => {
    setEditingLocation(null);
    setIsCreatingLocation(true);
    setLocationForm({
      name: '',
      city: 'Delhi NCR',
      popularAreasInput: '',
      responseEta: 'Within 2 to 3 hours',
      isActive: true,
      notes: ''
    });
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.name.trim()) {
      addToast('Validation Error', 'Location name is required.', 'error');
      return;
    }

    const popularAreas = locationForm.popularAreasInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (isCreatingLocation) {
      addLocation({
        name: locationForm.name.trim(),
        city: locationForm.city.trim() || 'Delhi NCR',
        popularAreas: popularAreas.length > 0 ? popularAreas : [locationForm.name.trim()],
        responseEta: locationForm.responseEta.trim() || 'Within 2 to 4 hours',
        isActive: locationForm.isActive,
        notes: locationForm.notes.trim()
      });
      setIsCreatingLocation(false);
    } else if (editingLocation) {
      updateLocation(editingLocation.id, {
        name: locationForm.name.trim(),
        city: locationForm.city.trim() || 'Delhi NCR',
        popularAreas: popularAreas.length > 0 ? popularAreas : [locationForm.name.trim()],
        responseEta: locationForm.responseEta.trim() || 'Within 2 to 4 hours',
        isActive: locationForm.isActive,
        notes: locationForm.notes.trim()
      });
      setEditingLocation(null);
    }
  };

  const renderIcon = (iconName: string) => {
    const match = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComponent = match ? match.icon : HeartHandshake;
    return <IconComponent className="w-5 h-5 text-[#0f8672]" />;
  };

  // Filtered views
  const filteredServices = services.filter((s) => {
    const q = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q);
  });

  const filteredLocations = serviceLocations.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.popularAreas.some((a) => a.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <PageSeo
        title="Admin - Services & Location Coverage"
        description="Edit clinical care services, procedures, FAQs, and configure locations where home nursing is available."
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Services & Coverage Areas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify available clinical procedures, pricing notes, and change where our home nurses are dispatched.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === 'services' ? (
            <button
              onClick={handleOpenCreateService}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateLocation}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service Location</span>
            </button>
          )}

          <Link
            to="/services"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors shadow-2xs"
          >
            <span>Preview Public Services</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'services'
                ? 'bg-[#0f8672] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Services Catalog ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'locations'
                ? 'bg-[#0f8672] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Available Locations & Zones ({serviceLocations.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'services' ? 'Search services...' : 'Search locations or areas...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus-visible:outline-teal-700"
          />
        </div>
      </div>

      {/* TAB 1: SERVICES CATALOG */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const assignedLocationNames = service.locations && service.locations.length > 0
                ? serviceLocations.filter((l) => service.locations?.includes(l.id)).map((l) => l.name)
                : ['All Available Locations'];

              return (
                <div
                  key={service.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-teal-200 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#effaf8] border border-teal-100 flex items-center justify-center shrink-0">
                          {renderIcon(service.iconName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {service.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">
                            /{service.slug}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          service.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {service.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Features summary */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ListChecks className="w-3.5 h-3.5 text-[#0f8672]" />
                          <span>Procedures & Bullets:</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          {service.bulletPoints?.length || 0} items
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-[#0f8672]" />
                          <span>Clinical FAQs:</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          {service.faqs?.length || 0} questions
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 pt-1">
                        <span className="flex items-center gap-1 shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>Coverage:</span>
                        </span>
                        <span className="text-slate-700 font-medium text-right text-[11px] line-clamp-1">
                          {assignedLocationNames.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditService(service)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-50 hover:bg-teal-100/80 text-[#0f8672] text-xs font-semibold rounded-xl transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>

                    <button
                      onClick={() => setConfirmDeleteServiceId(service.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No services match your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#0f8672] font-semibold hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredServices.length} of {services.length} services</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all services to the original clinical default roster? Custom services will be replaced.')) {
                  resetServicesToDefault();
                }
              }}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Services to Clinical Default</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABLE LOCATIONS & SERVICE ZONES */}
      {activeTab === 'locations' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-slate-50 border border-teal-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0f8672]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Where We Are Available (Active Dispatch Zones)
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                These locations are shown publicly on the Service Catalog, Homepage, and Enquiry form so patients and family caregivers know where registered nurses can arrive immediately.
              </p>
            </div>

            <button
              onClick={handleOpenCreateLocation}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Location</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-teal-200 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                      <span className="text-[11px] font-medium text-slate-500">{loc.city}</span>
                    </div>

                    <button
                      onClick={() =>
                        updateLocation(loc.id, { isActive: !loc.isActive })
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        loc.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                      title="Click to toggle availability"
                    >
                      {loc.isActive ? 'Active Coverage' : 'Temporarily Paused'}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 text-[11px] font-medium block">
                      Response ETA:
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-teal-50 border border-teal-100/70 text-[#0e6b5c] font-semibold text-xs rounded-lg">
                      {loc.responseEta}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] font-medium block mb-1.5">
                      Key Areas & Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {loc.popularAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {loc.notes && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      {loc.notes}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditLocation(loc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-teal-50 hover:text-[#0f8672] text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Location</span>
                  </button>

                  <button
                    onClick={() => setConfirmDeleteLocId(loc.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredLocations.length} locations</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all coverage locations to default NCR zones?')) {
                  resetLocationsToDefault();
                }
              }}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Locations to Default</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDIT OR ADD SERVICE */}
      {(editingService || isCreatingService) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isCreatingService ? 'Add New Clinical Service' : `Edit: ${editingService?.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update titles, descriptions, procedures, FAQs, and location availability.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setIsCreatingService(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-6 text-xs">
              {/* Primary Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setServiceForm((prev) => ({
                        ...prev,
                        title: val,
                        slug:
                          isCreatingService && !prev.slug
                            ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                            : prev.slug
                      }));
                    }}
                    placeholder="e.g. Critical Care Nursing at Home"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    URL Slug (anchor link) *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                    placeholder="e.g. critical-care-nursing"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                {/* Icon Selection */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Service Icon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVAILABLE_ICONS.map((item) => {
                      const IconComp = item.icon;
                      const isSelected = serviceForm.iconName === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setServiceForm({ ...serviceForm, iconName: item.name })}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            isSelected
                              ? 'border-[#0f8672] bg-teal-50 text-[#0e6b5c] font-semibold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] leading-tight truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pricing / Shift Arrangement Note
                  </label>
                  <input
                    type="text"
                    value={serviceForm.pricingNote}
                    onChange={(e) => setServiceForm({ ...serviceForm, pricingNote: e.target.value })}
                    placeholder="e.g. Flexible 8hr, 12hr & 24hr live-in shifts"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={serviceForm.isActive}
                      onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#0f8672] rounded focus:ring-teal-500"
                    />
                    <span>Service is active and visible to public</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Description (For Cards & Previews) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={serviceForm.shortDescription}
                    onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of what this nursing service includes..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Description (For Detailed Services Catalog Page) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={serviceForm.fullDescription}
                    onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                    placeholder="Complete clinical explanation of the home care service, procedures, protocols, and nurse qualifications..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>
              </div>

              {/* Service Locations Availability */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <MapPin className="w-4 h-4 text-[#0f8672]" />
                    <span>Locations Where This Service is Available</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (serviceForm.locations.length === serviceLocations.length) {
                        setServiceForm({ ...serviceForm, locations: [] });
                      } else {
                        setServiceForm({
                          ...serviceForm,
                          locations: serviceLocations.map((l) => l.id)
                        });
                      }
                    }}
                    className="text-[11px] text-[#0f8672] hover:underline font-semibold"
                  >
                    {serviceForm.locations.length === serviceLocations.length
                      ? 'Deselect All'
                      : 'Select All Locations'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceLocations.map((loc) => {
                    const isChecked = serviceForm.locations.includes(loc.id);
                    return (
                      <label
                        key={loc.id}
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-teal-50 border-teal-200 text-teal-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServiceForm({
                                ...serviceForm,
                                locations: [...serviceForm.locations, loc.id]
                              });
                            } else {
                              setServiceForm({
                                ...serviceForm,
                                locations: serviceForm.locations.filter((id) => id !== loc.id)
                              });
                            }
                          }}
                          className="w-3.5 h-3.5 text-[#0f8672] rounded"
                        />
                        <span className="text-xs truncate">{loc.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Procedures & Bullet Points */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ListChecks className="w-4 h-4 text-[#0f8672]" />
                    <span>Key Procedures & Inclusions ({serviceForm.bulletPoints.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setServiceForm({
                        ...serviceForm,
                        bulletPoints: [...serviceForm.bulletPoints, '']
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#0f8672] hover:underline font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {serviceForm.bulletPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-5">
                        {pIdx + 1}.
                      </span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...serviceForm.bulletPoints];
                          updated[pIdx] = e.target.value;
                          setServiceForm({ ...serviceForm, bulletPoints: updated });
                        }}
                        placeholder="e.g. Sterile dressing changes for incision lines"
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg focus-visible:outline-teal-700 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = serviceForm.bulletPoints.filter((_, i) => i !== pIdx);
                          setServiceForm({ ...serviceForm, bulletPoints: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove bullet point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service FAQs */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <HelpCircle className="w-4 h-4 text-[#0f8672]" />
                    <span>Clinical FAQs ({serviceForm.faqs.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setServiceForm({
                        ...serviceForm,
                        faqs: [...serviceForm.faqs, { question: '', answer: '' }]
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#0f8672] hover:underline font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {serviceForm.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 bg-white border border-slate-200 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">
                          FAQ #{fIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = serviceForm.faqs.filter((_, i) => i !== fIdx);
                            setServiceForm({ ...serviceForm, faqs: updated });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...serviceForm.faqs];
                          updated[fIdx].question = e.target.value;
                          setServiceForm({ ...serviceForm, faqs: updated });
                        }}
                        placeholder="Question: e.g. Do I need a doctor's prescription?"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />

                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...serviceForm.faqs];
                          updated[fIdx].answer = e.target.value;
                          setServiceForm({ ...serviceForm, faqs: updated });
                        }}
                        placeholder="Answer: e.g. Yes, a valid physician prescription is required before medication dispensing."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsCreatingService(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCreatingService ? 'Create Service' : 'Save Service Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT OR ADD LOCATION */}
      {(editingLocation || isCreatingLocation) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isCreatingLocation ? 'Add Coverage Location' : `Edit: ${editingLocation?.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure service zone name, response ETA, and prominent localities.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingLocation(null);
                  setIsCreatingLocation(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Location / Zone Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="e.g. South Delhi, or Gurugram Cyber Hub"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.city}
                  onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                  placeholder="e.g. New Delhi, Haryana, Uttar Pradesh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Response Time ETA *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.responseEta}
                  onChange={(e) => setLocationForm({ ...locationForm, responseEta: e.target.value })}
                  placeholder="e.g. Within 1 to 2 hours, or Within 2 to 4 hours"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Popular Localities & Sectors (comma-separated) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={locationForm.popularAreasInput}
                  onChange={(e) => setLocationForm({ ...locationForm, popularAreasInput: e.target.value })}
                  placeholder="e.g. Vasant Vihar, Hauz Khas, Saket, Greater Kailash, Defense Colony"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Separated by commas. These will be highlighted on the service coverage section.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Notes (Optional)
                </label>
                <input
                  type="text"
                  value={locationForm.notes}
                  onChange={(e) => setLocationForm({ ...locationForm, notes: e.target.value })}
                  placeholder="e.g. Full 24/7 standby roster with geriatric specialists"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={locationForm.isActive}
                    onChange={(e) => setLocationForm({ ...locationForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0f8672] rounded focus:ring-teal-500"
                  />
                  <span>Active coverage zone (nurses currently available)</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLocation(null);
                    setIsCreatingLocation(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingLocation ? 'Add Location' : 'Save Location'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SERVICE DIALOG */}
      {confirmDeleteServiceId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Service Removal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove this service from the public catalogue? Existing enquiries tied to this service will still retain their records.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteServiceId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteService(confirmDeleteServiceId);
                  setConfirmDeleteServiceId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE LOCATION DIALOG */}
      {confirmDeleteLocId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Remove Coverage Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this location? It will no longer show in the public coverage availability areas.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteLocId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteLocation(confirmDeleteLocId);
                  setConfirmDeleteLocId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Delete Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
