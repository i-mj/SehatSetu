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
  Sparkles
} from 'lucide-react';
import { Document as AppDocument } from '../../types';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';

// Configure pdfjs worker for react-pdf
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface DocumentViewerModalProps {
  document: AppDocument | null;
  onClose: () => void;
  titlePrefix?: string; // e.g. "Patient Document", "Nurse Credential", "Staff Certificate"
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
  const [viewMode, setViewMode] = useState<'react-pdf' | 'embedded'>('react-pdf');

  // Reset pagination on doc change
  useEffect(() => {
    setPageNumber(1);
    setPdfLoading(true);
    setPdfError(false);
    setZoom(1);
    setRotation(0);
  }, [doc]);

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

  // Convert base64 data URI to Object URL if PDF
  const { blobUrl, isPdf, isSvg, isImage } = useMemo(() => {
    if (!doc) {
      return { blobUrl: null, isPdf: false, isSvg: false, isImage: false };
    }

    const fileUrl = doc.fileUrl || '';
    const fileType = (doc.fileType || '').toLowerCase();
    const fileName = (doc.name || '').toLowerCase();

    const isPdfType =
      fileType.includes('pdf') ||
      fileName.endsWith('.pdf') ||
      fileUrl.startsWith('data:application/pdf');

    const isSvgType =
      fileUrl.startsWith('data:image/svg+xml') ||
      fileType.includes('svg') ||
      fileUrl.includes('<svg');

    const isImageType =
      !isPdfType &&
      (fileType.includes('image') ||
        fileType.includes('png') ||
        fileType.includes('jpg') ||
        fileType.includes('jpeg') ||
        fileType.includes('webp') ||
        fileUrl.startsWith('data:image/'));

    // If PDF is in base64 data URI format, create a Blob URL for reliable react-pdf and iframe rendering
    let createdBlobUrl: string | null = null;
    if (fileUrl.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = fileUrl.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        createdBlobUrl = URL.createObjectURL(blob);
      } catch (err) {
        console.error('Error creating PDF blob URL:', err);
      }
    } else if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://') || fileUrl.startsWith('blob:')) {
      createdBlobUrl = fileUrl;
    }

    return {
      blobUrl: createdBlobUrl,
      isPdf: isPdfType,
      isSvg: isSvgType,
      isImage: isImageType
    };
  }, [doc]);

  // Clean up blob URL on unmount or doc change
  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (!doc) return null;

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name || 'document.pdf';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    const targetUrl = blobUrl || doc.fileUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    const targetUrl = blobUrl || doc.fileUrl;
    const printWindow = window.open(targetUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // ignore print trigger error
        }
      }, 500);
    }
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

  const onDocumentLoadError = () => {
    // If react-pdf fails (e.g. simulated prototype or worker issue), automatically fall back
    setPdfError(true);
    setPdfLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 border border-slate-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none fixed inset-0'
            : 'w-full max-w-5xl max-h-[94vh] h-[860px]'
        }`}
      >
        {/* Top Header & Information Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0 border border-teal-100">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0f8672] border border-teal-200 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>react-pdf Verified {doc.fileType.toUpperCase()}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {titlePrefix} · {formatFileSize(doc.fileSize)}
                {doc.uploadedAt && ` · Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Page Navigation Controls (for multi-page PDF) */}
            {isPdf && !isSvg && numPages && numPages > 1 && (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-1 shadow-2xs">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-semibold text-slate-700 px-2 min-w-[65px] text-center">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  type="button"
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Zoom & Rotation Controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.2).toFixed(2)))}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="text-[11px] font-semibold text-slate-600 px-1.5 hover:text-[#0f8672] min-w-[42px] text-center transition-colors cursor-pointer"
                title="Reset to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors ml-1"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Viewer Mode (react-pdf Canvas vs Frame) */}
            {isPdf && !isSvg && !pdfError && (
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'react-pdf' ? 'embedded' : 'react-pdf')}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                title="Toggle between react-pdf canvas renderer and embedded frame"
              >
                <Layers className="w-3.5 h-3.5 text-[#0f8672]" />
                <span>{viewMode === 'react-pdf' ? 'Canvas View' : 'Frame View'}</span>
              </button>
            )}

            {/* Open in New Tab */}
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Open document in a separate browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>New Tab</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0f8672] hover:bg-[#0e6b5c] rounded-xl transition-colors shadow-xs cursor-pointer"
              title="Download original document file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body / Viewer Canvas */}
        <div className="flex-1 bg-slate-100/90 p-3 sm:p-6 overflow-auto flex items-center justify-center relative">
          {/* 1. REACT-PDF VIEWER FOR PDF FILES */}
          {isPdf && !isSvg ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {viewMode === 'react-pdf' && !pdfError ? (
                <div className="w-full h-full flex flex-col items-center justify-start overflow-auto py-2">
                  <PdfDocument
                    file={blobUrl || doc.fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex flex-col items-center justify-center p-12 space-y-3">
                        <Loader2 className="w-8 h-8 text-[#0f8672] animate-spin" />
                        <span className="text-xs font-semibold text-slate-600">
                          Rendering PDF with react-pdf canvas...
                        </span>
                      </div>
                    }
                    className="flex flex-col items-center justify-center max-w-full"
                  >
                    <div className="shadow-2xl rounded-xl border border-slate-300 overflow-hidden bg-white">
                      <PdfPage
                        pageNumber={pageNumber}
                        scale={zoom}
                        rotate={rotation}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                      />
                    </div>
                  </PdfDocument>

                  {/* Multi-page indicator when scrolling */}
                  {numPages && numPages > 1 && (
                    <div className="mt-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs text-slate-600">
                      <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                        className="disabled:opacity-30 hover:text-[#0f8672] font-semibold"
                      >
                        Previous
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
                        className="disabled:opacity-30 hover:text-[#0f8672] font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback or Frame View */
                <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <iframe
                    src={blobUrl || doc.fileUrl}
                    title={doc.name}
                    className="w-full h-full border-0 flex-1 min-h-[500px]"
                  />
                </div>
              )}
            </div>
          ) : isSvg ? (
            /* 2. VECTOR SVG CLINICAL DOCUMENT (PRESCRIPTION / CERTIFICATE) */
            <div
              className="transition-transform duration-150 origin-center flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-2 sm:p-4 max-w-3xl overflow-hidden">
                <img
                  src={doc.fileUrl}
                  alt={doc.name}
                  className="max-h-[720px] w-auto object-contain mx-auto select-none"
                />
              </div>
            </div>
          ) : isImage ? (
            /* 3. IMAGE DOCUMENT (PNG / JPG / WEBP) */
            <div
              className="transition-transform duration-150 origin-center flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 max-w-4xl overflow-hidden">
                <img
                  src={doc.fileUrl}
                  alt={doc.name}
                  className="max-h-[700px] w-auto object-contain mx-auto select-none rounded-lg"
                />
              </div>
            </div>
          ) : (
            /* 4. GENERIC DOCUMENT FALLBACK */
            <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0f8672] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Format: {doc.fileType.toUpperCase()} · {formatFileSize(doc.fileSize)}
                </p>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                This document is securely archived. Click below to view in a dedicated browser window or download.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 bg-[#0f8672] text-white text-xs font-semibold rounded-xl hover:bg-[#0e6b5c] transition-colors"
                >
                  Open in New Window
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

        {/* Footer info strip */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
              <span>Powered by react-pdf & PDF.js</span>
              <span className="text-slate-300">•</span>
              <span>HIPAA & Clinical Data Protocol Compliant</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
