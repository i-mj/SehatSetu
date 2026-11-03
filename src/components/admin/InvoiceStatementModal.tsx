import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Receipt,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  CreditCard,
  RotateCcw,
  Plus
} from 'lucide-react';
import { CareBilling } from '../../types';

interface InvoiceStatementModalProps {
  billing: CareBilling | null;
  onClose: () => void;
  onAddPayment?: (billing: CareBilling) => void;
}

export const InvoiceStatementModal: React.FC<InvoiceStatementModalProps> = ({
  billing,
  onClose,
  onAddPayment
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!billing) return null;

  const invoiceNumber = billing.id.toUpperCase().startsWith('BILL-')
    ? billing.id.toUpperCase()
    : `INV-${billing.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  const issueDate = billing.createdAt
    ? new Date(billing.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

  const percentPaid =
    billing.totalCharges > 0
      ? Math.min(100, Math.round((billing.amountPaid / billing.totalCharges) * 100))
      : 100;

  // Print Handler: Opens an isolated printable document with clean healthcare invoice styling
  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${billing.patientName} (${invoiceNumber})</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 15mm 15mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 20px;
              background: #ffffff;
              font-size: 12px;
              line-height: 1.4;
            }
            .invoice-wrapper {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #cbd5e1;
              padding: 24px;
              border-radius: 8px;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f8672;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 800;
              color: #0f8672;
              letter-spacing: -0.5px;
            }
            .brand-sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 3px;
            }
            .invoice-title-block {
              text-align: right;
            }
            .invoice-title {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
            }
            .invoice-badge {
              display: inline-block;
              padding: 4px 10px;
              font-size: 10px;
              font-weight: 700;
              border-radius: 4px;
              margin-top: 5px;
              text-transform: uppercase;
            }
            .badge-paid {
              background: #ecfdf5;
              color: #047857;
              border: 1px solid #a7f3d0;
            }
            .badge-due {
              background: #fffbeb;
              color: #b45309;
              border: 1px solid #fde68a;
            }
            .badge-refund {
              background: #fff1f2;
              color: #be123c;
              border: 1px solid #fecdd3;
            }
            .grid-two {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              gap: 20px;
            }
            .card {
              flex: 1;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px 14px;
            }
            .card-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 6px;
              letter-spacing: 0.5px;
            }
            .patient-name {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            table.items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            table.items-table th {
              background: #f1f5f9;
              color: #334155;
              font-size: 11px;
              font-weight: 700;
              text-align: left;
              padding: 8px 10px;
              border-bottom: 2px solid #cbd5e1;
            }
            table.items-table td {
              padding: 10px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 11px;
            }
            .text-right {
              text-align: right;
            }
            .totals-table {
              width: 320px;
              margin-left: auto;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .totals-table td {
              padding: 6px 10px;
              font-size: 11px;
            }
            .totals-table tr.total-row td {
              border-top: 2px solid #cbd5e1;
              border-bottom: 2px solid #cbd5e1;
              font-weight: 800;
              font-size: 13px;
              color: #0f172a;
            }
            .payment-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 18px;
            }
            .payment-header {
              font-size: 11px;
              font-weight: 700;
              color: #334155;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            .ledger-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            .ledger-table th {
              border-bottom: 1px solid #cbd5e1;
              padding: 4px 6px;
              text-align: left;
              color: #64748b;
            }
            .ledger-table td {
              padding: 6px;
              border-bottom: 1px solid #f1f5f9;
            }
            .footer-notes {
              margin-top: 24px;
              border-top: 1px solid #e2e8f0;
              padding-top: 14px;
              font-size: 10px;
              color: #64748b;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .signature-box {
              text-align: right;
              font-size: 10px;
              color: #475569;
            }
            .signature-line {
              margin-top: 35px;
              border-top: 1px dashed #94a3b8;
              width: 180px;
              display: inline-block;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-wrapper {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <!-- Header Table -->
            <table class="header-table">
              <tr>
                <td style="vertical-align: top;">
                  <div class="brand-name">NURSE CARE</div>
                  <div class="brand-sub">Professional Home Healthcare & Clinical Nursing Services</div>
                  <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
                    Reg No: DNC/DEL/2026/0891 · GSTIN: 07AAECN4911K1ZX<br />
                    24x7 Care Desk: +91 98112 23344 · support@nursecare.in<br />
                    Central Hub: Healthcare Center, Ring Road, South Delhi 110049
                  </div>
                </td>
                <td class="invoice-title-block" style="vertical-align: top;">
                  <h1 class="invoice-title">TAX INVOICE</h1>
                  <div style="font-size: 11px; font-weight: 700; color: #334155; margin-top: 3px;">
                    Invoice #: ${invoiceNumber}
                  </div>
                  <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                    Date of Issue: ${issueDate}
                  </div>
                  <div>
                    <span class="invoice-badge ${
                      billing.balanceDue === 0
                        ? 'badge-paid'
                        : billing.status === 'REFUNDED'
                        ? 'badge-refund'
                        : 'badge-due'
                    }">
                      ${
                        billing.balanceDue === 0
                          ? 'PAID IN FULL'
                          : billing.status === 'REFUNDED'
                          ? 'REFUNDED'
                          : `BALANCE DUE: ₹${billing.balanceDue.toLocaleString('en-IN')}`
                      }
                    </span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Billed To & Service Details Cards -->
            <div class="grid-two">
              <div class="card">
                <div class="card-title">Billed To (Patient Information)</div>
                <div class="patient-name">${billing.patientName}</div>
                <div style="color: #475569; font-size: 11px;">Primary Phone: ${billing.phone}</div>
                <div style="color: #64748b; font-size: 10px; margin-top: 2px;">Patient Booking Ref: #${billing.enquiryId}</div>
              </div>

              <div class="card">
                <div class="card-title">Care Duration & Roster Schedule</div>
                <div style="font-weight: 700; color: #0f172a; font-size: 12px;">${billing.serviceName}</div>
                <div style="color: #475569; font-size: 11px; margin-top: 2px;">
                  Period: <strong>${billing.startDate}</strong> to <strong>${billing.endDate}</strong> (${billing.totalDays} Total Days)
                </div>
                <div style="color: #475569; font-size: 11px;">Roster Shift: ${billing.shiftType}</div>
                ${
                  billing.extensions && billing.extensions.length > 0
                    ? `<div style="color: #047857; font-size: 10px; font-weight: 700; margin-top: 3px;">Includes ${billing.extensions.reduce(
                        (a, c) => a + c.extendedDays,
                        0
                      )} extended care days</div>`
                    : ''
                }
              </div>
            </div>

            <!-- Line Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 50%;">Service Description & Clinical Procedure</th>
                  <th style="width: 15%;" class="text-right">Rate / Day</th>
                  <th style="width: 15%;" class="text-right">Duration</th>
                  <th style="width: 20%;" class="text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${billing.serviceName}</strong>
                    <div style="font-size: 10px; color: #64748b;">
                      Certified clinical bedside care & vitals monitoring (${billing.shiftType})
                    </div>
                  </td>
                  <td class="text-right">₹${billing.dailyRate.toLocaleString('en-IN')}</td>
                  <td class="text-right">${billing.totalDays} Days</td>
                  <td class="text-right" style="font-weight: 700;">₹${billing.baseCareCharges.toLocaleString('en-IN')}</td>
                </tr>
                ${
                  billing.consumablesCharges > 0
                    ? `<tr>
                        <td>
                          <strong>Clinical Consumables & Disposable Supplies</strong>
                          <div style="font-size: 10px; color: #64748b;">Sterile dressings, IV sets, gloves & antiseptics</div>
                        </td>
                        <td class="text-right">-</td>
                        <td class="text-right">Lump-sum</td>
                        <td class="text-right" style="font-weight: 700;">₹${billing.consumablesCharges.toLocaleString('en-IN')}</td>
                      </tr>`
                    : ''
                }
              </tbody>
            </table>

            <!-- Totals Summary Table -->
            <table class="totals-table">
              <tr>
                <td style="color: #64748b;">Subtotal (Care Services):</td>
                <td class="text-right">₹${billing.baseCareCharges.toLocaleString('en-IN')}</td>
              </tr>
              ${
                billing.consumablesCharges > 0
                  ? `<tr>
                      <td style="color: #64748b;">Consumables & Materials:</td>
                      <td class="text-right">₹${billing.consumablesCharges.toLocaleString('en-IN')}</td>
                    </tr>`
                  : ''
              }
              <tr>
                <td style="color: #64748b;">Applicable Taxes (GST 0% on Medical Care):</td>
                <td class="text-right">₹0.00</td>
              </tr>
              <tr class="total-row">
                <td>Total Invoiced Amount:</td>
                <td class="text-right" style="color: #0f8672;">₹${billing.totalCharges.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #047857;">Total Payments Received:</td>
                <td class="text-right" style="font-weight: 700; color: #047857;">- ₹${billing.amountPaid.toLocaleString('en-IN')}</td>
              </tr>
              ${
                billing.totalRefunded > 0
                  ? `<tr>
                      <td style="font-weight: 700; color: #be123c;">Total Refund Issued:</td>
                      <td class="text-right" style="font-weight: 700; color: #be123c;">+ ₹${billing.totalRefunded.toLocaleString('en-IN')}</td>
                    </tr>`
                  : ''
              }
              <tr style="background: #f8fafc; font-weight: 800;">
                <td style="font-size: 12px; color: #0f172a;">Outstanding Balance Due:</td>
                <td class="text-right" style="font-size: 13px; color: ${billing.balanceDue > 0 ? '#b45309' : '#047857'};">
                  ₹${billing.balanceDue.toLocaleString('en-IN')}
                </td>
              </tr>
            </table>

            <!-- Payments Ledger -->
            ${
              billing.payments && billing.payments.length > 0
                ? `<div class="payment-box">
                    <div class="payment-header">Recorded Payment Receipts (${billing.payments.length})</div>
                    <table class="ledger-table">
                      <thead>
                        <tr>
                          <th>Receipt #</th>
                          <th>Date & Time</th>
                          <th>Payment Mode</th>
                          <th>Transaction / UTR Ref</th>
                          <th>Received By</th>
                          <th class="text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${billing.payments
                          .map(
                            (p) => `
                          <tr>
                            <td style="font-family: monospace; font-weight: 700;">${p.receiptNumber}</td>
                            <td>${new Date(p.paidAt).toLocaleDateString('en-IN')}</td>
                            <td>${p.paymentMode}</td>
                            <td style="font-family: monospace; color: #64748b;">${p.transactionRef || 'N/A'}</td>
                            <td>${p.receivedBy}</td>
                            <td class="text-right" style="font-weight: 700; color: #047857;">₹${p.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>`
                : `<div class="payment-box" style="color: #64748b; font-size: 11px; text-align: center;">
                    No payment receipts logged yet for this care duration.
                  </div>`
            }

            <!-- Footer & Signature Block -->
            <div class="footer-notes">
              <div>
                <strong>Terms & Clinical Conditions:</strong>
                <div style="margin-top: 3px; max-width: 450px;">
                  1. Payments for scheduled clinical care shifts are due prior to or on the date of discharge.<br />
                  2. All nurses are certified by the Nursing Council & undergo comprehensive background verification.<br />
                  3. Emergency 24/7 care support desk is accessible round the clock at +91 98112 23344.
                </div>
              </div>
              <div class="signature-box">
                <div style="font-weight: 700; color: #0f8672;">Nurse Care Healthcare Desk</div>
                <div class="signature-line"></div>
                <div style="margin-top: 3px;">Authorized Care Coordinator</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Trigger print dialog once loaded
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Control Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center border border-teal-100">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Invoice & Billing Statement
                </h3>
                <span className="font-mono text-xs text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  {invoiceNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Patient: <strong className="text-slate-700">{billing.patientName}</strong> · Generated on {issueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PRINT BUTTON */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Print professional invoice copy"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body (Screen View) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs bg-slate-50/50" ref={printAreaRef}>
          {/* Invoice Paper Canvas */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header / Brand */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-[#0f8672]">
              <div>
                <h2 className="text-2xl font-black text-[#0f8672] tracking-tight">NURSE CARE</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Professional Home Healthcare & Clinical Nursing Services
                </p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  Reg No: DNC/DEL/2026/0891 · GSTIN: 07AAECN4911K1ZX<br />
                  24x7 Helpline: +91 98112 23344 · support@nursecare.in<br />
                  Central Dispatch: Healthcare Center, South Delhi 110049
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-slate-900 tracking-wide block uppercase">
                  Tax Invoice
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 mt-1 block">
                  #{invoiceNumber}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Issue Date: {issueDate}
                </span>
                <div className="mt-2.5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      billing.balanceDue === 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : billing.status === 'REFUNDED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {billing.balanceDue === 0
                      ? 'PAID IN FULL'
                      : billing.status === 'REFUNDED'
                      ? 'REFUNDED'
                      : `BALANCE DUE: ₹${billing.balanceDue.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Details: Patient Info & Service Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Billed To (Patient Information)
                </span>
                <p className="font-bold text-slate-900 text-sm">{billing.patientName}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{billing.phone}</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Patient Booking Ref: #{billing.enquiryId}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Care Duration & Shift Roster
                </span>
                <p className="font-bold text-slate-900 text-sm">{billing.serviceName}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0f8672]" />
                  <span>
                    {billing.startDate} → {billing.endDate} (<strong>{billing.totalDays} Days</strong>)
                  </span>
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{billing.shiftType}</span>
                </p>
                {billing.extensions && billing.extensions.length > 0 && (
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">
                    Includes +{billing.extensions.reduce((acc, x) => acc + x.extendedDays, 0)} days extended care
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Service Description</th>
                    <th className="py-2.5 px-4 text-right">Daily Rate</th>
                    <th className="py-2.5 px-4 text-right">Duration</th>
                    <th className="py-2.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{billing.serviceName}</p>
                      <p className="text-[11px] text-slate-500">
                        Bedside clinical care & continuous patient vital monitoring ({billing.shiftType})
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      ₹{billing.dailyRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      {billing.totalDays} Days
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{billing.baseCareCharges.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  {billing.consumablesCharges > 0 && (
                    <tr>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">Clinical Consumables & Disposable Supplies</p>
                        <p className="text-[11px] text-slate-500">
                          Sterile wound dressings, antiseptics, gloves, catheter & syringe kits
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-700">-</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-700">Lump-sum</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ₹{billing.consumablesCharges.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Care Services Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{billing.baseCareCharges.toLocaleString('en-IN')}
                  </span>
                </div>
                {billing.consumablesCharges > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Clinical Consumables:</span>
                    <span className="font-semibold text-slate-900">
                      ₹{billing.consumablesCharges.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Medical Care GST (Exempted):</span>
                  <span className="font-semibold text-slate-900">₹0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-slate-200 text-sm font-extrabold text-[#0f8672]">
                  <span>Total Invoiced Amount:</span>
                  <span>₹{billing.totalCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Amount Paid / Deposited:</span>
                  <span>- ₹{billing.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                {billing.totalRefunded > 0 && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Refund Processed:</span>
                    <span>+ ₹{billing.totalRefunded.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900 bg-slate-50 p-2.5 rounded-xl">
                  <span>Balance Due:</span>
                  <span className={billing.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                    ₹{billing.balanceDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Receipts Ledger */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#0f8672]" />
                  <span>Recorded Payment Receipts ({billing.payments?.length || 0})</span>
                </span>
                {onAddPayment && billing.balanceDue > 0 && (
                  <button
                    type="button"
                    onClick={() => onAddPayment(billing)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f8672] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Collect Payment</span>
                  </button>
                )}
              </div>

              {(!billing.payments || billing.payments.length === 0) ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-xs italic">
                  No payment receipts recorded yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {billing.payments.map((p) => (
                    <div key={p.id} className="p-3 bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {p.receiptNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0f8672]">
                            {p.paymentMode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {p.transactionRef && `Ref: ${p.transactionRef} · `}
                          Received by {p.receivedBy}
                          {p.notes && ` · "${p.notes}"`}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(p.paidAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refunds Section if any */}
            {billing.refunds && billing.refunds.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refund Vouchers ({billing.refunds.length})</span>
                </span>
                <div className="border border-rose-200 bg-rose-50/40 rounded-xl overflow-hidden divide-y divide-rose-100">
                  {billing.refunds.map((r) => (
                    <div key={r.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-rose-900">
                          ₹{r.amount.toLocaleString('en-IN')} via {r.refundMode}
                        </span>
                        <p className="text-[11px] text-rose-700">
                          {r.reason} · Handled by {r.processedBy}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(r.refundedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal / Signatory Notes */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4 text-[10px] text-slate-400">
              <div className="max-w-md space-y-1">
                <p className="font-bold text-slate-600">Clinical Terms & Care Undertaking:</p>
                <p>
                  1. Clinical nursing duties are provided in strict adherence to doctor-prescribed orders.<br />
                  2. All medical fees are subject to healthcare service protocols. Emergency support line is active 24/7.
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#0f8672]">Nurse Care Clinical Operations</p>
                <div className="w-40 border-b border-dashed border-slate-300 my-4 ml-auto"></div>
                <p className="text-slate-500">Authorized Care Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Computer-Generated Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
