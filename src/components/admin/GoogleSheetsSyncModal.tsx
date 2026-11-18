/**
 * Nurse Care - Google Sheets Integration Modal
 * Handles Google OAuth login, spreadsheet creation, live syncing of patient enquiries,
 * and direct external links to Google Sheets.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  initGoogleAuth,
  googleSignIn,
  googleSignOut,
  getGoogleAccessToken
} from '../../services/googleAuth';
import {
  createEnquirySpreadsheet,
  syncEnquiriesToSheet,
  getSpreadsheetMetadata
} from '../../services/googleSheetsService';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  LogOut,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    enquiries,
    nurses,
    services,
    googleSheetId,
    setGoogleSheetId,
    lastSheetSync,
    setLastSheetSync,
    addToast
  } = useApp();

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [manualSheetId, setManualSheetId] = useState(googleSheetId || '');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [showConfirmSync, setShowConfirmSync] = useState(false);

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, accessToken) => {
        setGoogleUser(user);
        setToken(accessToken);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      setGoogleUser(res.user);
      setToken(res.accessToken);
      addToast('Google Connected', `Signed in as ${res.user.email} with Sheets access.`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Google Connection Failed', err.message || 'Could not authenticate with Google.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setToken(null);
    addToast('Google Disconnected', 'Signed out of Google Workspace.', 'info');
  };

  const handleCreateNewSheet = async () => {
    const accessToken = token || getGoogleAccessToken();
    if (!accessToken) {
      addToast('Authentication Required', 'Please connect your Google account first.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const { spreadsheetId, spreadsheetUrl } = await createEnquirySpreadsheet(
        accessToken,
        'Nurse Care — Patient Enquiries Log'
      );
      setGoogleSheetId(spreadsheetId);
      setManualSheetId(spreadsheetId);

      // Immediately sync current enquiries
      await syncEnquiriesToSheet(
        accessToken,
        spreadsheetId,
        enquiries,
        nurses,
        services
      );

      const nowIso = new Date().toISOString();
      setLastSheetSync(nowIso);
      setSyncStatusMsg(`Created and synced ${enquiries.length} enquiries to Google Sheet.`);
      addToast('Spreadsheet Created', 'New Google Sheet created and populated successfully.', 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Creation Failed', err.message || 'Unable to create spreadsheet.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePerformSync = async () => {
    setShowConfirmSync(false);
    const accessToken = token || getGoogleAccessToken();
    const sheetId = manualSheetId.trim() || googleSheetId;

    if (!accessToken) {
      addToast('Authentication Required', 'Please sign in with Google.', 'warning');
      return;
    }

    if (!sheetId) {
      addToast('Missing Sheet ID', 'Please enter or create a Google Sheet ID.', 'warning');
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg(null);

    try {
      const result = await syncEnquiriesToSheet(
        accessToken,
        sheetId,
        enquiries,
        nurses,
        services
      );

      setGoogleSheetId(sheetId);
      const nowIso = new Date().toISOString();
      setLastSheetSync(nowIso);
      setSyncStatusMsg(`Successfully synchronized ${result.rowsUpdated} enquiries to Google Sheets.`);
      addToast('Google Sheet Updated', `${result.rowsUpdated} records exported to Google Sheets.`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Sync Failed', err.message || 'Could not update spreadsheet cells.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const activeSheetId = googleSheetId || manualSheetId.trim();
  const liveSheetUrl = activeSheetId ? `https://docs.google.com/spreadsheets/d/${activeSheetId}/edit` : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Fixed Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-7 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Google Sheets Real-time Synchronization
              </h2>
              <p className="text-xs text-slate-500">
                Live patient intake export with authorized Google Workspace APIs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-5 space-y-6">

        {/* Auth State Card */}
        {!googleUser ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Connect Google Workspace Account
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Authorize Nurse Care to create and synchronize patient bookings into Google Sheets with permission from your account.
              </p>
            </div>

            {/* Official Google Material Style Sign-In Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoading ? 'Connecting Google Account...' : 'Sign in with Google'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Logged In Google Workspace Controls */
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-emerald-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {googleUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {googleUser.displayName || 'Google User'}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-mono">
                    {googleUser.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogout}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Spreadsheet Connection Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Connected Google Spreadsheet ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter existing spreadsheet ID or generate a new one below..."
                    value={manualSheetId}
                    onChange={(e) => setManualSheetId(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus-visible:outline-teal-700"
                  />
                  {manualSheetId && (
                    <button
                      type="button"
                      onClick={() => setGoogleSheetId(manualSheetId.trim())}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl"
                    >
                      Save ID
                    </button>
                  )}
                </div>
              </div>

              {liveSheetUrl && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Live Google Sheet:</span>
                  <a
                    href={liveSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0f8672] hover:text-[#0e6b5c] font-semibold underline"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {lastSheetSync && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Last synced: {new Date(lastSheetSync).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Sync Feedback Message */}
            {syncStatusMsg && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672] shrink-0" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCreateNewSheet}
                disabled={isLoading || isSyncing}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Nurse Care Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmSync(true)}
                disabled={isLoading || isSyncing || (!googleSheetId && !manualSheetId.trim())}
                className="flex-1 py-3 px-4 bg-[#0f8672] hover:bg-[#0e6b5c] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Exporting Rows...' : 'Sync All Enquiries Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog for Mutating Spreadsheet Operation */}
        {showConfirmSync && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 font-bold mb-0.5">
                  Confirm Data Export to Google Sheets
                </strong>
                <p className="text-amber-800 leading-relaxed">
                  Export and update {enquiries.length} enquiry records to your linked Google Spreadsheet? Existing rows in the "Enquiries" tab will be updated with current status stages and assigned nurse names.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmSync(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePerformSync}
                className="px-3.5 py-1.5 bg-[#0f8672] hover:bg-[#0e6b5c] text-white rounded-lg font-semibold shadow-xs"
              >
                Confirm & Sync
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
