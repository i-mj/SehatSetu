/**
 * Nurse Care - Patient & Family Testimonials & Feedback
 * Route: /feedbacks
 * Features:
 * - Seva At Home style testimonials grid (quote marks, star ratings, patient family roles, service tags)
 * - Trust metrics banner (4.9/5 satisfaction, 100% verified visits)
 * - Category filter tabs
 * - Media preview modal (photo/video testimonials)
 * - Customer Feedback Submission Form positioned BELOW the reviews
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  Star,
  Quote,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Play,
  X,
  FileCheck2,
  Image as ImageIcon,
  Heart,
  HeartPulse,
  UserCheck,
  Send,
  Filter,
  ShieldCheck,
  Upload
} from 'lucide-react';

export const FeedbacksPage: React.FC = () => {
  const { settings, services, reviews, addReview, addToast } = useApp();

  // Testimonial Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Media Modal preview
  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'photo' | 'video';
    url: string;
    reviewer: string;
  } | null>(null);

  // Form State (Positioned BELOW Reviews)
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [serviceName, setServiceName] = useState('');
  const [message, setMessage] = useState('');

  // Media upload state
  const [mediaType, setMediaType] = useState<'text' | 'photo' | 'video'>('text');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter approved reviews for display
  const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');

  const filteredReviews = approvedReviews.filter((rev) => {
    if (selectedCategory === 'ALL') return true;
    return rev.serviceName?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Media handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFormError('Image size must be under 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setMediaType('photo');
      setVideoPreview(null);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (MP4, WebM).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFormError('Video size must be under 20 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setVideoPreview(reader.result as string);
      setMediaType('video');
      setPhotoPreview(null);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setPhotoPreview(null);
    setVideoPreview(null);
    setMediaType('text');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError('Please provide a meaningful feedback description (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    setTimeout(() => {
      addReview({
        reviewerName: name.trim(),
        rating,
        serviceName: serviceName || 'General Nursing Care',
        message: message.trim(),
        mediaType,
        photoUrl: photoPreview || undefined,
        videoUrl: videoPreview || undefined,
        status: 'PENDING'
      });

      addToast(
        'Feedback Submitted',
        'Thank you! Your testimonial has been submitted for verification before public display.',
        'success'
      );

      setSubmittedSuccess(true);
      setIsSubmitting(false);
    }, 400);
  };

  const resetForm = () => {
    setName('');
    setRating(5);
    setServiceName('');
    setMessage('');
    clearMedia();
    setSubmittedSuccess(false);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nursecare.org';
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '4.9';

  const reviewsStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'HomeHealthCareService'],
        '@id': `${origin}/#organization`,
        name: settings.siteName,
        url: `${origin}`,
        telephone: settings.phone,
        email: settings.email,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'IN'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating,
          reviewCount: approvedReviews.length || 1,
          bestRating: '5',
          worstRating: '1'
        },
        review: approvedReviews.slice(0, 20).map((rev) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: rev.reviewerName
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: rev.rating,
            bestRating: '5',
            worstRating: '1'
          },
          reviewBody: rev.message,
          datePublished: rev.createdAt ? rev.createdAt.substring(0, 10) : '2026-02-01',
          itemReviewed: {
            '@type': 'MedicalBusiness',
            name: settings.siteName,
            telephone: settings.phone,
            address: settings.address
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${origin}/feedbacks/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Patient & Family Testimonials',
            item: `${origin}/feedbacks`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Patient & Family Testimonials - Nurse Care"
        description="Read genuine verified testimonials from patient families who trusted Nurse Care for elderly care, post-operative recovery, and home nursing."
        ogType="website"
        ogTitle="Patient & Family Testimonials & Reviews — Nurse Care"
        ogDescription="Read authentic experiences from patient families who chose Nurse Care for certified in-home elderly assistance and clinical recovery."
        ogImage="/images/og-default.svg"
        ogImageAlt="Nurse Care Patient & Family Testimonials"
        twitterCard="summary_large_image"
        twitterTitle="Patient & Family Testimonials & Reviews — Nurse Care"
        twitterDescription="Read authentic experiences from patient families who chose Nurse Care for certified in-home elderly assistance and clinical recovery."
        twitterImage="/images/og-default.svg"
        twitterImageAlt="Nurse Care Patient & Family Testimonials"
        schema={reviewsStructuredData}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/80 via-[#effaf8]/30 to-white pt-16 pb-12 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-[#0f8672] fill-[#0f8672]" />
            <span>Real Patient Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Loved by Patients, Trusted by Families
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover how our certified nurses bring clinical excellence, warmth, and dignity to patients healing in the comfort of their own homes.
          </p>

          {/* Key Trust Signals Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-teal-200/80 shadow-2xs">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900">4.9 / 5.0</span>
              <span className="text-slate-400">· Family Satisfaction</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-teal-200/80 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-900">100% Verified</span>
              <span className="text-slate-400">· Authentic Care Logs</span>
            </div>

            <a
              href="#share-feedback"
              className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white font-semibold rounded-2xl shadow-xs transition-colors"
            >
              Share Your Experience ↓
            </a>
          </div>
        </div>
      </section>

      {/* Main Reviews Display Section (SEVA AT HOME STYLE) */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#0f8672] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Testimonials ({approvedReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('elderly')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'elderly'
                  ? 'bg-[#0f8672] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Elderly Care
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('post-operative')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'post-operative'
                  ? 'bg-[#0f8672] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Post-Surgical Care
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('critical')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'critical'
                  ? 'bg-[#0f8672] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Critical Nursing & ICU
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('infusion')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'infusion'
                  ? 'bg-[#0f8672] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              IV Injections & Dressings
            </button>
          </div>

          {/* Testimonial Cards Grid */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 max-w-lg mx-auto">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No testimonials found in this category</p>
              <p className="text-xs text-slate-400 mt-1">Please select "All Testimonials" or be the first to share your experience.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-200 flex flex-col justify-between relative group"
                >
                  {/* Decorative Quote Mark Top Right */}
                  <div className="absolute top-6 right-6 text-teal-100 group-hover:text-teal-200 transition-colors pointer-events-none">
                    <Quote className="w-10 h-10 rotate-180 opacity-60 fill-teal-100" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    {/* Star Rating & Verified Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Patient Family</span>
                      </span>
                    </div>

                    {/* Testimonial Quote Message */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{rev.message}"
                    </p>

                    {/* Optional Media (Photo or Video Preview) */}
                    {rev.photoUrl && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMediaModal({
                              type: 'photo',
                              url: rev.photoUrl!,
                              reviewer: rev.reviewerName
                            })
                          }
                          className="relative rounded-2xl overflow-hidden border border-teal-200 aspect-16/9 w-full bg-slate-50 group/img cursor-pointer"
                        >
                          <img
                            src={rev.photoUrl}
                            alt="Patient Care Attachment"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="text-[11px] text-white font-semibold bg-black/60 px-3 py-1 rounded-full">
                              View Care Photo
                            </span>
                          </div>
                        </button>
                      </div>
                    )}

                    {rev.videoUrl && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMediaModal({
                              type: 'video',
                              url: rev.videoUrl!,
                              reviewer: rev.reviewerName
                            })
                          }
                          className="relative rounded-2xl overflow-hidden border border-teal-200 aspect-16/9 w-full bg-slate-900 group/vid flex items-center justify-center cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#0f8672] text-white flex items-center justify-center shadow-md group-hover/vid:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                          <span className="absolute bottom-2.5 left-3 text-[10px] text-white font-medium bg-black/60 px-2 py-0.5 rounded">
                            Watch Family Video
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Author / Reviewer Info Bottom Block */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-[#0f8672] border border-teal-200 flex items-center justify-center font-bold text-sm shrink-0">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {rev.reviewerName}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                        <span>{rev.serviceName || 'Home Nursing'}</span>
                        <span>·</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* REVIEW SUBMISSION FORM POSITIONED BELOW REVIEWS */}
      {/* ========================================================= */}
      <section id="share-feedback" className="py-16 bg-slate-50/70 border-t border-slate-200 scroll-mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share Your Story</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Share Your Care Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Your bedside observations help other families choose safe, verified home nursing for their loved ones.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="bg-white border-2 border-teal-300 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-sm animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-[#0f8672] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Thank You for Your Review!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Your feedback has been received with status <strong className="text-teal-800">PENDING</strong>. To prevent spam and safeguard clinical authenticity, our nursing coordinator reviews each submission before public publishing.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Another Feedback
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              {formError && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {/* 1-5 Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Overall Care Rating <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform focus-visible:outline-2 focus-visible:outline-teal-600 rounded cursor-pointer"
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            starValue <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Reviewer Name */}
                  <div>
                    <label
                      htmlFor="reviewerName"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      Your Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="reviewerName"
                      type="text"
                      required
                      placeholder="e.g. Meenakshi Sundaram"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                    />
                  </div>

                  {/* Service dropdown */}
                  <div>
                    <label
                      htmlFor="serviceReceived"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      Service Received
                    </label>
                    <select
                      id="serviceReceived"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700 font-medium"
                    >
                      <option value="">Select service provided...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Review Message */}
                <div>
                  <label
                    htmlFor="feedbackMessage"
                    className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                  >
                    Your Comments & Care Observations <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="feedbackMessage"
                    rows={4}
                    required
                    placeholder="Describe the nurse's punctuality, gentle bedside attitude, hygiene, communication..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus-visible:outline-teal-700"
                  />
                </div>

                {/* Optional Photo / Video Upload with Preview */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Optional Photo or Video Upload
                  </label>

                  {photoPreview && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 max-w-xs">
                      <img
                        src={photoPreview}
                        alt="Feedback Attachment Preview"
                        className="w-full h-36 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                        aria-label="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="block text-[11px] text-slate-500 mt-1.5 text-center">
                        Photo attached
                      </span>
                    </div>
                  )}

                  {videoPreview && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black p-2 max-w-xs">
                      <video controls className="w-full h-36 object-contain rounded-lg">
                        <source src={videoPreview} type="video/mp4" />
                      </video>
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                        aria-label="Remove video"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="block text-[11px] text-slate-300 mt-1.5 text-center">
                        Video attached
                      </span>
                    </div>
                  )}

                  {!photoPreview && !videoPreview && (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-teal-50/40 hover:border-teal-300 cursor-pointer transition-colors text-center">
                        <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-slate-700">Add Photo</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG (max 8MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-teal-50/40 hover:border-teal-300 cursor-pointer transition-colors text-center">
                        <Play className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-slate-700">Add Video</span>
                        <span className="text-[10px] text-slate-400">MP4 (max 20MB)</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Submission Notice */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                  <ShieldAlert className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span>
                    Your submission is held privately until authenticated by our clinical quality desk.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting feedback...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Patient Family Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* MEDIA MODAL FOR FULL SCREEN VIEW */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                Care Document - {activeMediaModal.reviewer}
              </h4>
              <button
                type="button"
                onClick={() => setActiveMediaModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center aspect-16/9">
              {activeMediaModal.type === 'video' ? (
                <video controls className="w-full h-full object-contain" autoPlay>
                  <source src={activeMediaModal.url} type="video/mp4" />
                  Your browser does not support HTML video preview.
                </video>
              ) : (
                <img
                  src={activeMediaModal.url}
                  alt="Verified Patient Care"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveMediaModal(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
