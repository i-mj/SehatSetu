/**
 * Nurse Care - Toast Notification System
 * Visual alerts for actions like simulated admin email notifications, stage updates, and errors.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-blue-200 bg-white text-slate-900';
        let iconClass = 'text-blue-500';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-teal-200 bg-white text-slate-900';
          iconClass = 'text-[#0f8672]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-white text-slate-900';
          iconClass = 'text-amber-500';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-200 bg-white text-slate-900';
          iconClass = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderClass} transition-all duration-200 transform translate-y-0`}
            role="status"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1 -mt-1 rounded-md focus-visible:outline-2 focus-visible:outline-teal-600"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
