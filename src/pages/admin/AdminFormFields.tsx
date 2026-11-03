/**
 * Nurse Care - Admin Enquiry Form Fields Configuration
 * Manage, customize, add, edit, toggle, and remove public enquiry form fields with instant preview.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { FormFieldConfig } from '../../types';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  HelpCircle,
  Type,
  Hash,
  Mail,
  Calendar,
  List,
  AlignLeft,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminFormFields: React.FC = () => {
  const {
    enquiryFormFields,
    updateFormField,
    addFormField,
    removeFormField,
    resetFormFieldsToDefault,
    services
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state for Add / Edit
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<FormFieldConfig['type']>('text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldHelpText, setFieldHelpText] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptionsText, setFieldOptionsText] = useState('');

  const openAddModal = () => {
    setFieldLabel('');
    setFieldType('text');
    setFieldPlaceholder('');
    setFieldHelpText('');
    setFieldRequired(false);
    setFieldOptionsText('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (field: FormFieldConfig) => {
    setEditingField(field);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldPlaceholder(field.placeholder || '');
    setFieldHelpText(field.helpText || '');
    setFieldRequired(field.required);
    setFieldOptionsText(field.options ? field.options.join(', ') : '');
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim()) return;

    const options =
      fieldType === 'select' && fieldOptionsText.trim()
        ? fieldOptionsText.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

    if (editingField) {
      updateFormField(editingField.id, {
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim() || undefined,
        helpText: fieldHelpText.trim() || undefined,
        required: fieldRequired,
        options
      });
      setEditingField(null);
    } else {
      addFormField({
        name: fieldLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim() || undefined,
        helpText: fieldHelpText.trim() || undefined,
        required: fieldRequired,
        enabled: true,
        options
      });
      setIsAddModalOpen(false);
    }
  };

  const getTypeIcon = (type: FormFieldConfig['type']) => {
    switch (type) {
      case 'tel':
        return <Hash className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'select':
        return <List className="w-4 h-4 text-purple-600" />;
      case 'textarea':
        return <AlignLeft className="w-4 h-4 text-rose-600" />;
      default:
        return <Type className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageSeo
        title="Admin - Enquiry Form Fields"
        description="Customize public patient booking form fields. Add custom questions, edit labels, or remove non-essential fields."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enquiry Form Builder & Fields
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure which fields appear on the public patient booking form (`/enquiry`).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetFormFieldsToDefault}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset to default clinical form layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Form Field</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Field List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Form Fields ({enquiryFormFields.filter((f) => f.enabled).length} of {enquiryFormFields.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Changes apply to public form immediately
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {enquiryFormFields.map((field) => (
                <div
                  key={field.id}
                  className={`p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors ${
                    !field.enabled ? 'opacity-50 bg-slate-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-slate-100 rounded-lg mt-0.5">
                      {getTypeIcon(field.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Required
                          </span>
                        )}
                        {!field.isDefault && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Custom
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono capitalize">
                          {field.type}
                        </span>
                      </div>
                      {field.placeholder && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          Placeholder: "{field.placeholder}"
                        </p>
                      )}
                      {field.helpText && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Enabled */}
                    <button
                      type="button"
                      onClick={() => updateFormField(field.id, { enabled: !field.enabled })}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                        field.enabled
                          ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={field.enabled ? 'Click to disable from form' : 'Click to enable on form'}
                    >
                      {field.enabled ? 'Enabled' : 'Disabled'}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditModal(field)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit field properties"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Form Field */}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(field.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete field from enquiry form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Form Simulation Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Eye className="w-4 h-4 text-[#0f8672]" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Public Form Simulation
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              This interactive preview reflects how patients and caregivers see the booking form on `/enquiry`:
            </p>

            <div className="space-y-4 text-xs">
              {enquiryFormFields
                .filter((f) => f.enabled)
                .map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {field.label} {field.required && <span className="text-rose-600">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        disabled
                        rows={2}
                        placeholder={field.placeholder || ''}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        disabled
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option>
                          {field.id === 'serviceId' ? 'Select clinical service...' : 'Select an option...'}
                        </option>
                        {field.id === 'serviceId'
                          ? services.map((s) => <option key={s.id}>{s.title}</option>)
                          : field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        disabled
                        placeholder={field.placeholder || ''}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    )}

                    {field.helpText && (
                      <span className="text-[10px] text-slate-400 block">{field.helpText}</span>
                    )}
                  </div>
                ))}

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 bg-[#0f8672] text-white text-xs font-semibold rounded-xl opacity-90 cursor-not-allowed"
                >
                  Submit Care Enquiry (Preview Only)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FIELD MODAL */}
      {(isAddModalOpen || editingField) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingField ? `Edit Field: ${editingField.label}` : 'Add New Enquiry Form Field'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingField(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveField} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attending Physician Name"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Input Type</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="text">Single-line Text</option>
                    <option value="tel">Phone / Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date Picker</option>
                    <option value="textarea">Multi-line Paragraph</option>
                    <option value="select">Dropdown Select</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requirement</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fieldRequired}
                      onChange={(e) => setFieldRequired(e.target.checked)}
                      className="rounded text-[#0f8672] focus:ring-teal-600 w-4 h-4"
                    />
                    <span className="text-slate-700">Required field</span>
                  </label>
                </div>
              </div>

              {fieldType === 'select' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dropdown Options (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Morning Shift, Evening Shift, 24-Hour"
                    value={fieldOptionsText}
                    onChange={(e) => setFieldOptionsText(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Placeholder Text</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Gupta (optional)"
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Help / Subtitle Note</label>
                <input
                  type="text"
                  placeholder="e.g. Name of referring hospital doctor"
                  value={fieldHelpText}
                  onChange={(e) => setFieldHelpText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingField(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Field
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
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Form Field?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this field from the public enquiry form? You can restore default fields anytime using &quot;Reset Defaults&quot;.
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
                  removeFormField(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Remove Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
