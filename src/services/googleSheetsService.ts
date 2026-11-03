/**
 * Nurse Care - Google Sheets Integration Service
 * Communicates directly with the Google Sheets API v4 using OAuth bearer token.
 * Features automated spreadsheet creation, full enquiry synchronization, and verification.
 */

import { Enquiry, Nurse, ServiceItem } from '../types';

export interface SheetSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowsUpdated: number;
  sheetTitle: string;
}

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Creates a brand new Google Spreadsheet for patient enquiries.
 */
export const createEnquirySpreadsheet = async (
  accessToken: string,
  title = 'Nurse Care — Patient Enquiries Log'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const response = await fetch(SHEETS_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: 'Enquiries',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create spreadsheet (${response.status})`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Fetches basic spreadsheet metadata to verify accessibility.
 */
export const getSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheets: string[] }> => {
  const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch spreadsheet (${response.status})`);
  }

  const data = await response.json();
  const sheets = data.sheets?.map((s: any) => s.properties?.title || 'Sheet1') || ['Sheet1'];

  return {
    title: data.properties?.title || 'Google Sheet',
    sheets
  };
};

/**
 * Syncs the entire roster of patient enquiries into the specified Google Sheet.
 */
export const syncEnquiriesToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  enquiries: Enquiry[],
  nurses: Nurse[],
  services: ServiceItem[],
  sheetTabName = 'Enquiries'
): Promise<SheetSyncResult> => {
  const headers = [
    'Reference ID',
    'Patient / Contact Name',
    'Phone Number',
    'Email Address',
    'Service Requested',
    'City / Area',
    'Preferred Date',
    'Status Stage',
    'Assigned Nurse',
    'Clinical / Admin Notes',
    'Submission Date'
  ];

  const rows = enquiries.map((enq) => {
    const service = services.find((s) => s.id === enq.serviceId);
    const assignedNurse = nurses.find((n) => n.id === enq.assignedNurseId);

    return [
      `#${enq.id}`,
      enq.fullName,
      enq.phone,
      enq.email || '',
      service ? service.title : enq.serviceId,
      enq.cityArea,
      enq.preferredDate,
      enq.stage,
      assignedNurse ? `${assignedNurse.fullName} (${assignedNurse.city})` : 'Unassigned',
      enq.notes || '',
      new Date(enq.createdAt).toLocaleString()
    ];
  });

  const allValues = [headers, ...rows];

  // First, verify tab name from metadata
  let targetTab = sheetTabName;
  try {
    const meta = await getSpreadsheetMetadata(accessToken, spreadsheetId);
    if (!meta.sheets.includes(targetTab)) {
      targetTab = meta.sheets[0] || 'Sheet1';
    }
  } catch {
    targetTab = 'Sheet1';
  }

  const range = `${targetTab}!A1:K${allValues.length}`;
  const response = await fetch(
    `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: allValues
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update spreadsheet cells (${response.status})`);
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    rowsUpdated: rows.length,
    sheetTitle: targetTab
  };
};
