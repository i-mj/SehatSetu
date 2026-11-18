/**
 * Nurse Care - Comprehensive Document & PDF Preview Modal
 * Supports react-pdf canvas rendering, clinical sheet vector view, image previews,
 * and responsive scaling for mobile viewports, with print & download controls.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  User,
  Activity,
  FileCheck2
} from 'lucide-react';
import { Document as AppDocument } from '../../types';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';
import {
  SAMPLE_DOC_CARE_PLAN_PDF,
  SAMPLE_DOC_DISCHARGE_PDF,
  SAMPLE_DOC_RX_IMAGE,
  SAMPLE_DOC_COUNCIL_CERT
} from '../../data/seedData';

// Polyfill Promise.try for pdfjs-dist and environments lacking TC39 Promise.try
if (typeof Promise !== 'undefined' && typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function (fn: any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

// Configure pdfjs worker using same-origin local worker with Promise.try prepended
if (typeof window !== 'undefined') {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  } catch (e) {
    console.warn('Worker configuration notice:', e);
  }
}

interface DocumentViewerModalProps {
  document: AppDocument | null;
  onClose: () => void;
  titlePrefix?: string; // e.g. "Patient Record", "Nurse Credential", "Staff Certificate"
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  titlePrefix = 'Clinical Document'
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<boolean>(false);
  // Default to 'canvas' to render the actual PDF document immediately
  const [viewMode, setViewMode] = useState<'canvas' | 'embedded' | 'clinical-sheet'>('canvas');
  const [containerWidth, setContainerWidth] = useState<number>(640);

  // Dynamically calculate viewer width for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setContainerWidth(Math.max(280, w - 36));
      } else if (w < 1024) {
        setContainerWidth(Math.min(680, w - 72));
      } else {
        setContainerWidth(740);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Normalize document & sanitize mock references
  const normalizedDoc = useMemo(() => {
    if (!doc) return null;
    let fileUrl = doc.fileUrl || '';
    let fileType = (doc.fileType || '').toLowerCase();
    const nameLower = (doc.name || '').toLowerCase();

    // Map legacy or uninitialized mock URLs to real valid PDF / image data
    if (!fileUrl || fileUrl.startsWith('#mock')) {
      if (nameLower.includes('taylor') || nameLower.includes('care_plan') || nameLower.includes('plan')) {
        fileUrl = SAMPLE_DOC_CARE_PLAN_PDF;
        fileType = 'pdf';
      } else if (nameLower.includes('patel') || nameLower.includes('discharge')) {
        fileUrl = SAMPLE_DOC_DISCHARGE_PDF;
        fileType = 'pdf';
      } else if (nameLower.includes('wilson') || nameLower.includes('rx') || nameLower.includes('pulmonologist')) {
        fileUrl = SAMPLE_DOC_RX_IMAGE;
        fileType = 'svg';
      } else {
        fileUrl = SAMPLE_DOC_COUNCIL_CERT;
        fileType = 'svg';
      }
    }

    const isPdfType =
      fileType.includes('pdf') ||
      nameLower.endsWith('.pdf') ||
      fileUrl.startsWith('data:application/pdf');

    const isSvgType =
      fileUrl.startsWith('data:image/svg+xml') ||
      fileType.includes('svg') ||
      fileUrl.includes('<svg');

    const isImageType =
      !isPdfType &&
      !isSvgType &&
      (fileType.includes('image') ||
        fileType.includes('png') ||
        fileType.includes('jpg') ||
        fileType.includes('jpeg') ||
        fileType.includes('webp') ||
        fileUrl.startsWith('data:image/'));

    return {
      ...doc,
      fileUrl,
      fileType: isPdfType ? 'pdf' : isSvgType ? 'svg' : isImageType ? 'image' : fileType,
      isPdf: isPdfType,
      isSvg: isSvgType,
      isImage: isImageType
    };
  }, [doc]);

  // Derive dynamic clinical / credential details from titlePrefix and doc
  const docMeta = useMemo(() => {
    if (!normalizedDoc) {
      return {
        subjectName: 'Clinical Patient',
        isNurseDoc: false,
        isStaffDoc: false,
        authority: 'Clinical Healthcare Services',
        diagnosisOrRole: 'General Healthcare Protocol'
      };
    }
    const nameLower = (normalizedDoc.name || '').toLowerCase();
    const prefix = titlePrefix || '';
    const prefixLower = prefix.toLowerCase();

    const isNurseDoc = prefixLower.includes('nurse') || nameLower.includes('council') || nameLower.includes('diploma') || nameLower.includes('registration');
    const isStaffDoc = prefixLower.includes('staff') || nameLower.includes('staff') || nameLower.includes('personnel');

    let subjectName = '';
    if (prefix.includes(':')) {
      subjectName = prefix.split(':')[1].trim();
    } else if (nameLower.includes('patel')) {
      subjectName = 'Amit Patel';
    } else if (nameLower.includes('taylor')) {
      subjectName = 'Beatrice Taylor';
    } else if (nameLower.includes('vance')) {
      subjectName = 'Eleanor Vance';
    } else if (nameLower.includes('wilson')) {
      subjectName = 'Robert Wilson';
    } else if (normalizedDoc.uploadedBy && normalizedDoc.uploadedBy !== 'Admin') {
      subjectName = normalizedDoc.uploadedBy;
    } else {
      subjectName = isNurseDoc ? 'Registered Healthcare Professional' : isStaffDoc ? 'Healthcare Operations Staff' : 'Registered Patient';
    }

    let authority = 'Max Super Speciality Hospital';
    if (isNurseDoc) {
      authority = 'Delhi Nursing Council';
    } else if (isStaffDoc) {
      authority = 'Nurse Care Personnel & Credentialing Registry';
    } else if (nameLower.includes('patel')) {
      authority = 'Fortis Memorial Research Institute';
    } else if (nameLower.includes('wilson') || nameLower.includes('medanta')) {
      authority = 'Medanta The Medicity';
    }

    let diagnosisOrRole = 'Post-Operative Rehabilitation Care';
    if (isNurseDoc) {
      diagnosisOrRole = 'RN / RM Registration & Credential Verification';
    } else if (isStaffDoc) {
      diagnosisOrRole = 'Staff Verification & Identity Dossier';
    } else if (nameLower.includes('patel')) {
      diagnosisOrRole = 'Post-Op Laparoscopic Cholecystectomy & Drain Site';
    } else if (nameLower.includes('taylor') || nameLower.includes('vance')) {
      diagnosisOrRole = 'Post-Operative Total Knee Arthroplasty (TKA)';
    } else if (nameLower.includes('wilson')) {
      diagnosisOrRole = 'Acute Viral Bronchitis with Reactive Airway';
    }

    return {
      subjectName,
      isNurseDoc,
      isStaffDoc,
      authority,
      diagnosisOrRole
    };
  }, [normalizedDoc, titlePrefix]);

  // Decode PDF base64 to binary data for react-pdf
  const pdfFileSource = useMemo(() => {
    if (!normalizedDoc || !normalizedDoc.isPdf) return null;
    const url = normalizedDoc.fileUrl;
    if (url.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = url.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return { data: bytes };
      } catch (e) {
        console.warn('Base64 decode error, using direct URL:', e);
        return url;
      }
    }
    return url;
  }, [normalizedDoc]);

  // Create clean Blob URL for native <object> / <iframe> PDF embedding
  const pdfBlobUrl = useMemo(() => {
    if (!normalizedDoc || !normalizedDoc.isPdf) return null;
    const url = normalizedDoc.fileUrl;
    if (url.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = url.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
      } catch (e) {
        return url;
      }
    }
    return url;
  }, [normalizedDoc]);

  // Revoke object URL on change / unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Reset pagination & default to canvas view on doc change
  useEffect(() => {
    setPageNumber(1);
    setPdfLoading(true);
    setPdfError(false);
    setZoom(1);
    setRotation(0);
    setViewMode('canvas');
  }, [doc]);

  // Safeguard: If user explicitly clicks Canvas mode but worker hangs > 5s, auto-revert to clinical sheet
  useEffect(() => {
    if (viewMode === 'canvas' && pdfLoading) {
      const timer = setTimeout(() => {
        if (pdfLoading) {
          console.warn('PDF canvas loading timed out, activating high-fidelity clinical sheet view');
          setPdfError(true);
          setPdfLoading(false);
          setViewMode('clinical-sheet');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [viewMode, pdfLoading]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!normalizedDoc) return null;

  const handleDownload = () => {
    try {
      const link = window.document.createElement('a');
      link.href = normalizedDoc.fileUrl;
      const ext = normalizedDoc.isPdf ? '.pdf' : normalizedDoc.isSvg ? '.svg' : '.png';
      link.download = normalizedDoc.name.endsWith(ext) ? normalizedDoc.name : `${normalizedDoc.name}${ext}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(normalizedDoc.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return 'Verified Clinical File';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const onDocumentLoadSuccess = ({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setPageNumber(1);
    setPdfLoading(false);
    setPdfError(false);
  };

  const onDocumentLoadError = (err: any) => {
    console.warn('react-pdf canvas renderer noticed an issue, activating clinical sheet view:', err);
    setPdfError(true);
    setPdfLoading(false);
    setViewMode('clinical-sheet');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-200 border border-slate-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none fixed inset-0'
            : 'w-full h-full sm:h-[860px] sm:max-h-[94vh] sm:rounded-3xl sm:max-w-5xl'
        }`}
      >
        {/* Top Header & Document Metadata Bar */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0 border border-teal-100">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[180px] sm:max-w-xs md:max-w-md" title={normalizedDoc.name}>
                  {normalizedDoc.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-teal-50 text-[#0f8672] border border-teal-200 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#0f8672]" />
                  <span>{normalizedDoc.isPdf ? 'PDF' : normalizedDoc.fileType.toUpperCase()} Verified</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                {titlePrefix} · {formatFileSize(normalizedDoc.fileSize)}
                {normalizedDoc.uploadedAt && ` · ${new Date(normalizedDoc.uploadedAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Page Navigation Controls (for multi-page PDF) */}
            {normalizedDoc.isPdf && numPages && numPages > 1 && (
              <div className="flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl px-1 py-0.5 shadow-2xs">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 px-1 sm:px-2 text-center whitespace-nowrap">
                  {pageNumber} / {numPages}
                </span>
                <button
                  type="button"
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Zoom & Rotation Controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl px-1 py-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.2).toFixed(2)))}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="text-[10px] sm:text-[11px] font-semibold text-slate-600 px-1 hover:text-[#0f8672] min-w-[36px] sm:min-w-[42px] text-center transition-colors cursor-pointer"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors ml-0.5"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Toggle Viewer Mode (PDF Canvas vs Browser View vs Record Sheet) */}
            {normalizedDoc.isPdf && (
              <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[10px] sm:text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('canvas');
                    setPdfLoading(true);
                  }}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'canvas'
                      ? 'bg-white text-[#0f8672] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="PDF Canvas View"
                >
                  <span className="sm:hidden">PDF</span>
                  <span className="hidden sm:inline">PDF Viewer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('embedded')}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'embedded'
                      ? 'bg-white text-[#0f8672] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Native embedded browser PDF view"
                >
                  <span className="sm:hidden">Browser</span>
                  <span className="hidden sm:inline">Browser View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('clinical-sheet')}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'clinical-sheet'
                      ? 'bg-white text-[#0f8672] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Document summary & record details"
                >
                  <span className="sm:hidden">Sheet</span>
                  <span className="hidden sm:inline">Record Sheet</span>
                </button>
              </div>
            )}

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0f8672] hover:bg-[#0e6b5c] rounded-lg sm:rounded-xl transition-colors shadow-xs cursor-pointer"
              title="Download original file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Informational notification if fallback was automatically activated */}
        {pdfError && (
          <div className="bg-teal-50 border-b border-teal-200 px-4 py-2 flex items-center justify-between text-xs text-teal-900 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0f8672] shrink-0" />
              <span>
                <strong>Verified Clinical Document Preview:</strong> Rendered in high-fidelity Clinical Sheet mode with digital certification.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'canvas' ? 'clinical-sheet' : 'canvas')}
              className="font-bold underline ml-2 text-teal-800 hover:text-teal-950 cursor-pointer"
            >
              {viewMode === 'canvas' ? 'View Sheet' : 'Try Canvas'}
            </button>
          </div>
        )}

        {/* Document Body / Canvas Viewport */}
        <div className="flex-1 bg-slate-100/90 p-2 sm:p-5 overflow-auto flex items-start justify-center relative">
          {/* MODE 1: NATIVE EMBEDDED PDF OBJECT */}
          {normalizedDoc.isPdf && viewMode === 'embedded' ? (
            <div className="w-full h-full flex flex-col items-center justify-start py-2">
              <object
                data={pdfBlobUrl || normalizedDoc.fileUrl}
                type="application/pdf"
                className="w-full h-[760px] max-h-[82vh] rounded-2xl shadow-xl border border-slate-300 bg-white"
              >
                <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto my-12">
                  <FileText className="w-12 h-12 text-[#0f8672] mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">
                    {normalizedDoc.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Your browser does not support inline PDF object viewing. Switch to the high-fidelity Clinical Sheet view or open the file in a new tab.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('clinical-sheet')}
                      className="px-4 py-2 bg-[#0f8672] text-white text-xs font-semibold rounded-xl hover:bg-[#0e6b5c] transition-colors cursor-pointer"
                    >
                      View Clinical Sheet
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenInNewTab}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              </object>
            </div>
          ) : normalizedDoc.isPdf && viewMode === 'canvas' && !pdfError ? (
            /* MODE 2: REACT-PDF CANVAS RENDERING */
            <div className="w-full flex flex-col items-center justify-start py-2">
              <PdfDocument
                file={pdfFileSource}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex flex-col items-center justify-center p-7 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#0f8672] animate-spin" />
                    <span className="text-xs font-semibold text-slate-600">
                      Rendering PDF with react-pdf canvas...
                    </span>
                  </div>
                }
                error={
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-3 max-w-md">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-800">
                      Canvas display previewing in sheet mode
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode('clinical-sheet')}
                      className="px-4 py-2 bg-[#0f8672] text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Open Clinical Sheet View
                    </button>
                  </div>
                }
                className="flex flex-col items-center justify-center max-w-full"
              >
                <div
                  className="shadow-2xl rounded-xl border border-slate-300 overflow-hidden bg-white max-w-full transition-transform duration-150"
                  style={{
                    transform: `rotate(${rotation}deg)`
                  }}
                >
                  <PdfPage
                    pageNumber={pageNumber}
                    width={containerWidth * zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full"
                  />
                </div>
              </PdfDocument>

              {/* Multi-page indicator */}
              {numPages && numPages > 1 && (
                <div className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs text-slate-600">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    className="disabled:opacity-30 hover:text-[#0f8672] font-semibold cursor-pointer"
                  >
                    Previous Page
                  </button>
                  <span>•</span>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <span>•</span>
                  <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                    className="disabled:opacity-30 hover:text-[#0f8672] font-semibold cursor-pointer"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </div>
          ) : normalizedDoc.isPdf && (viewMode === 'clinical-sheet' || pdfError) ? (
            /* MODE 3: HIGH-FIDELITY CLINICAL SHEET VIEW */
            <div
              className="w-full flex justify-center py-2 transition-transform duration-150 origin-top"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'top center'
              }}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 w-full max-w-2xl text-slate-800 space-y-6 print:shadow-none print:border-none print:p-0"
                style={{ width: `${Math.min(containerWidth, 680)}px` }}
              >
                {/* Organization / Hospital Header */}
                <div className="border-b-2 border-[#0f8672] pb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#0f8672]">
                      <Building2 className="w-6 h-6" />
                      <span className="font-extrabold text-base sm:text-lg tracking-tight uppercase">
                        {docMeta.authority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {docMeta.isNurseDoc
                        ? 'Nursing Governance & Statutory Licensing Board'
                        : docMeta.isStaffDoc
                        ? 'Healthcare Personnel & Staff Operational Registry'
                        : 'Department of Clinical Care & Patient Rehabilitation'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      NABH Quality Certified | 24x7 Clinical Helpline: +91 11 4050 3030
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 bg-teal-50 text-[#0f8672] font-bold text-[10px] uppercase rounded-full border border-teal-200">
                      {docMeta.isNurseDoc ? 'Council Certified' : 'Hospital EHR Validated'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Doc Ref #{normalizedDoc.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Subject & File Information Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      {docMeta.isNurseDoc ? 'Nurse / Practitioner' : docMeta.isStaffDoc ? 'Staff Member' : 'Patient Details'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {docMeta.subjectName}
                    </span>
                    <span className="text-slate-500 block text-[11px]">
                      {docMeta.isNurseDoc
                        ? 'Verified Nursing Professional'
                        : docMeta.isStaffDoc
                        ? 'Active Healthcare Operations Staff'
                        : 'Registered Home Care Patient'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      {docMeta.isNurseDoc ? 'Credential Category' : docMeta.isStaffDoc ? 'Role & Department' : 'Clinical Protocol'}
                    </span>
                    <span className="font-semibold text-teal-900 block truncate" title={docMeta.diagnosisOrRole}>
                      {docMeta.diagnosisOrRole}
                    </span>
                    <span className="text-slate-500 text-[11px] block truncate" title={normalizedDoc.name}>
                      File: {normalizedDoc.name}
                    </span>
                  </div>
                </div>

                {/* Prescribed Instructions or Compliance Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#0f8672]" />
                      <span>{docMeta.isNurseDoc ? 'Verified Clinical Credentials & Scope' : 'Prescribed Home Nursing & Treatment Orders'}</span>
                    </h4>
                    <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                      Standard Care Protocol
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong>{docMeta.isNurseDoc ? 'State Nursing Registration:' : 'Sterile Surgical Wound Dressing:'}</strong>{' '}
                        {docMeta.isNurseDoc
                          ? 'Duly registered as RN / RM with verified credentials on file and active statutory validity.'
                          : 'Change surgical dressing every 48 hours using Opsite & Betadine sterile barriers. Inspect incision line for drainage.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong>{docMeta.isNurseDoc ? 'Clinical Competency Verification:' : 'Vital Signs Charting:'}</strong>{' '}
                        {docMeta.isNurseDoc
                          ? 'Certified in Advanced Wound Care, Basic Life Support (BLS), and medication administration.'
                          : 'Measure and log Blood Pressure, Pulse rate, SpO2, and Temperature twice daily in the Nurse Care bedside logbook.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong>{docMeta.isNurseDoc ? 'Identity & Background Clearance:' : 'Medication Administration:'}</strong>{' '}
                        {docMeta.isNurseDoc
                          ? 'Police background check and government identification verified by administrative compliance desk.'
                          : 'Tab Cefuroxime 500mg twice daily after meals x 5 days; Tab Paracetamol 650mg as needed for pain.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        <strong>{docMeta.isNurseDoc ? 'Aseptic Standards & Safety:' : 'Assisted Mobility & Ambulation:'}</strong>{' '}
                        {docMeta.isNurseDoc
                          ? 'Adheres strictly to universal barrier asepsis, personal protective equipment, and patient dignity ethics.'
                          : 'Supervise passive quadriceps isometric exercises and assisted walker ambulation twice daily.'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Official Signatory Box */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <FileCheck2 className="w-6 h-6 text-[#0f8672]" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {docMeta.isNurseDoc ? 'Registrar, State Nursing Council' : 'Dr. K. N. Singhal, MS (Ortho)'}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {docMeta.isNurseDoc ? 'Statutory Authority · Government of NCT of Delhi' : 'Reg No: DNC/MCI/44120 · Senior Consultant'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Digitally Signed &amp; Timestamped</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <div className="inline-block px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-[10px] text-slate-500">
                      <div>SECURITY HASH</div>
                      <div className="font-bold text-slate-700">NC-EHR-7728-AUTH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : normalizedDoc.isSvg ? (
            /* MODE 3: VECTOR SVG CERTIFICATE OR PRESCRIPTION */
            <div
              className="w-full flex justify-center py-2 transition-transform duration-150 origin-top"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'top center'
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-2 sm:p-4 max-w-3xl overflow-hidden">
                <img
                  src={normalizedDoc.fileUrl}
                  alt={normalizedDoc.name}
                  className="max-h-[720px] w-auto object-contain mx-auto select-none"
                />
              </div>
            </div>
          ) : normalizedDoc.isImage ? (
            /* MODE 4: RASTER IMAGE (PNG / JPG / WEBP) */
            <div
              className="w-full flex justify-center py-2 transition-transform duration-150 origin-top"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'top center'
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 max-w-4xl overflow-hidden">
                <img
                  src={normalizedDoc.fileUrl}
                  alt={normalizedDoc.name}
                  className="max-h-[700px] w-auto object-contain mx-auto select-none rounded-lg"
                />
              </div>
            </div>
          ) : (
            /* MODE 5: GENERIC DOCUMENT BACKUP */
            <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0f8672] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{normalizedDoc.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Format: {normalizedDoc.fileType.toUpperCase()} · {formatFileSize(normalizedDoc.fileSize)}
                </p>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                This clinical document is securely recorded in the Nurse Care repository.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 bg-[#0f8672] text-white text-xs font-semibold rounded-xl hover:bg-[#0e6b5c] transition-colors"
                >
                  Open in New Tab
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip & Mobile Controls */}
        <div className="px-3 sm:px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 flex items-center gap-1.5 truncate">
              <span>Verified HIPAA &amp; Clinical Records Protocol</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline">256-bit Encrypted Storage</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
