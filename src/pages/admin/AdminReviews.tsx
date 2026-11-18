/**
 * Nurse Care - Admin Reviews Moderation
 * Approve, reject, edit, delete, and manually create reviews.
 * Displays photo and video previews, and filters by status.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import { Review, ReviewStatus, ReviewMediaType } from '../../types';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Plus,
  Play,
  Image as ImageIcon,
  AlertTriangle,
  Eye,
  X,
  Filter
} from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, updateReviewStatus, updateReview, deleteReview, addReview, services } = useApp();
  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ type: 'photo' | 'video'; url: string; title: string } | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formService, setFormService] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<ReviewStatus>('APPROVED');
  const [formMediaType, setFormMediaType] = useState<ReviewMediaType>('text');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formAdminNote, setFormAdminNote] = useState('');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  const openAddModal = () => {
    setFormName('');
    setFormRating(5);
    setFormService(services[0]?.title || 'Elderly Care at Home');
    setFormMessage('');
    setFormStatus('APPROVED');
    setFormMediaType('text');
    setFormPhotoUrl('');
    setFormVideoUrl('');
    setFormAdminNote('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setEditingReview(rev);
    setFormName(rev.reviewerName);
    setFormRating(rev.rating);
    setFormService(rev.serviceName || '');
    setFormMessage(rev.message);
    setFormStatus(rev.status);
    setFormMediaType(rev.mediaType);
    setFormPhotoUrl(rev.photoUrl || '');
    setFormVideoUrl(rev.videoUrl || '');
    setFormAdminNote(rev.adminNote || '');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingReview) {
      updateReview(editingReview.id, {
        reviewerName: formName.trim(),
        rating: formRating,
        serviceName: formService,
        message: formMessage.trim(),
        status: formStatus,
        mediaType: formMediaType,
        photoUrl: formPhotoUrl.trim() || undefined,
        videoUrl: formVideoUrl.trim() || undefined,
        adminNote: formAdminNote.trim() || undefined
      });
      setEditingReview(null);
    } else {
      addReview({
        reviewerName: formName.trim(),
        rating: formRating,
        serviceName: formService,
        message: formMessage.trim(),
        status: formStatus,
        mediaType: formMediaType,
        photoUrl: formPhotoUrl.trim() || undefined,
        videoUrl: formVideoUrl.trim() || undefined,
        adminNote: formAdminNote.trim() || undefined
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-[#0f8672]" />
            <span>APPROVED (Public)</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>PENDING MODERATION</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>REJECTED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageSeo
        title="Admin - Review Moderation"
        description="Moderate patient and caregiver reviews, approve for public display, and filter submissions."
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Patient Family Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Only <strong className="text-teal-700">APPROVED</strong> reviews are published to the public Home page.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review Manually</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((stg) => (
            <button
              key={stg}
              type="button"
              onClick={() => setStatusFilter(stg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === stg
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {stg} ({stg === 'ALL' ? reviews.length : reviews.filter((r) => r.status === stg).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-2 py-7 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No reviews found matching status "{statusFilter}".
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rev.reviewerName}</h3>
                    <div className="text-[11px] text-slate-500">{rev.serviceName || 'Home Care'}</div>
                  </div>
                  <div>{getStatusBadge(rev.status)}</div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-semibold text-slate-700 ml-1.5">
                    {rev.rating}/5
                  </span>
                </div>

                {/* Message */}
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{rev.message}"
                </p>

                {/* Media indicators */}
                {rev.mediaType !== 'text' && (
                  <div className="flex items-center gap-2">
                    {rev.mediaType === 'photo' && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewMedia({
                            type: 'photo',
                            url: rev.photoUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
                            title: `Care Photo by ${rev.reviewerName}`
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Attached Photo</span>
                      </button>
                    )}
                    {rev.mediaType === 'video' && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewMedia({
                            type: 'video',
                            url: rev.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
                            title: `Video Testimonial by ${rev.reviewerName}`
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Play Video Clip</span>
                      </button>
                    )}
                  </div>
                )}

                {rev.adminNote && (
                  <p className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <strong className="block">Internal Note:</strong> {rev.adminNote}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {rev.status !== 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => updateReviewStatus(rev.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => updateReviewStatus(rev.id, 'REJECTED')}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                    title="Edit Review"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(rev.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT REVIEW MODAL */}
      {(isAddModalOpen || editingReview) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-bold text-slate-900">
                {editingReview ? 'Edit Review Record' : 'Add Manual Review'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingReview(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewer Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1 - 5) *</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Dissatisfied</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ReviewStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="APPROVED">APPROVED (Shows on Home)</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service</label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="General Home Nursing">General Home Nursing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Message *</label>
                <textarea
                  rows={3}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Media Type</label>
                  <select
                    value={formMediaType}
                    onChange={(e) => setFormMediaType(e.target.value as ReviewMediaType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="text">Text Only</option>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Media URL (optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formMediaType === 'photo' ? formPhotoUrl : formVideoUrl}
                    onChange={(e) => {
                      if (formMediaType === 'photo') setFormPhotoUrl(e.target.value);
                      else setFormVideoUrl(e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Private Internal Admin Note</label>
                <input
                  type="text"
                  value={formAdminNote}
                  onChange={(e) => setFormAdminNote(e.target.value)}
                  placeholder="e.g. Verified by coordinator on Oct 7"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingReview(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW MODAL */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold">{previewMedia.title}</h3>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-2">
              {previewMedia.type === 'video' ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                  <video controls className="w-full h-full object-contain" autoPlay>
                    <source src={previewMedia.url} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className="aspect-4/3 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={previewMedia.url}
                    alt={previewMedia.title}
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
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
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Review?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this customer feedback record? This action cannot be undone.
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
                  deleteReview(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
