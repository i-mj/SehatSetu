/**
 * Export utilities for downloading structured data as Excel-compatible CSV files.
 * Uses UTF-8 BOM (\uFEFF) to guarantee correct rendering of Indian names, currency
 * symbols, and special formatting in Microsoft Excel and other spreadsheet editors.
 */

export const exportToCSV = (
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
) => {
  const escapeCell = (cell: string | number | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    // Escape double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ].join('\r\n');

  // \uFEFF is UTF-8 Byte Order Mark (BOM), ensuring Excel opens Hindi/UTF-8 characters cleanly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
