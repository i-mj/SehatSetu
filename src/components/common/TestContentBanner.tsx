/**
 * Nurse Care - Test Content Banner
 * Highlights prototype and legal sample disclaimers on regulatory pages.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TestContentBanner: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 mb-6 rounded-xl" role="alert">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0 mr-3" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-0.5">Prototype Demonstration Notice</p>
          <p>
            The following {pageName} text represents sample prototype documentation for Nurse Care.
            In a live clinical deployment, legal agreements and clinical policies must be reviewed by certified medical legal counsel.
          </p>
        </div>
      </div>
    </div>
  );
};
