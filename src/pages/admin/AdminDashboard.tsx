/**
 * Nurse Care - Admin Dashboard
 * Displays metrics on enquiries across all 5 stages, pending verification badges,
 * and quick-access table for the latest customer enquiries.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageSeo } from '../../components/common/PageSeo';
import {
  ClipboardList,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Stethoscope,
  MapPin,
  BarChart3,
  Calendar,
  RotateCcw,
  Inbox
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { enquiries, nurses, reviews, services, serviceLocations, billings, contactMessages } = useApp();

  // Counts of enquiries per stage
  const countNew = enquiries.filter((e) => e.stage === 'NEW').length;
  const countContacted = enquiries.filter((e) => e.stage === 'CONTACTED').length;
  const countConfirmed = enquiries.filter((e) => e.stage === 'CONFIRMED').length;
  const countCompleted = enquiries.filter((e) => e.stage === 'COMPLETED').length;
  const countCancelled = enquiries.filter((e) => e.stage === 'CANCELLED').length;

  const countPendingNurses = nurses.filter((n) => n.status === 'PENDING').length;
  const countPendingReviews = reviews.filter((r) => r.status === 'PENDING').length;
  const countNewContactMessages = contactMessages.filter((m) => (m.status || 'NEW') === 'NEW').length;

  const [trendRange, setTrendRange] = useState<'6m' | '12m'>('6m');

  // Aggregation for Monthly Enquiry Trends and Nurse Applications Volume
  const monthlyTrendsData = useMemo(() => {
    const monthsCount = trendRange === '12m' ? 12 : 6;
    const now = new Date();
    const map: Record<string, { month: string; rawMonth: string; enquiries: number; nurseApplications: number }> = {};

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { month: 'short' });
      map[key] = {
        month: label,
        rawMonth: key,
        enquiries: 0,
        nurseApplications: 0
      };
    }

    enquiries.forEach((e) => {
      const dateStr = e.createdAt || '';
      const key = dateStr.substring(0, 7);
      if (map[key]) {
        map[key].enquiries += 1;
      }
    });

    nurses.forEach((n) => {
      const dateStr = n.createdAt || '';
      const key = dateStr.substring(0, 7);
      if (map[key]) {
        map[key].nurseApplications += 1;
      }
    });

    return Object.values(map);
  }, [enquiries, nurses, trendRange]);

  const totalEnquiriesInPeriod = monthlyTrendsData.reduce((acc, curr) => acc + curr.enquiries, 0);
  const totalNursesInPeriod = monthlyTrendsData.reduce((acc, curr) => acc + curr.nurseApplications, 0);

  // Refunds summary metrics for Admin Dashboard
  const refundSummary = useMemo(() => {
    const allRefunds = billings
      .flatMap((b) =>
        (b.refunds || []).map((r) => ({
          ...r,
          patientName: b.patientName,
          serviceName: b.serviceName
        }))
      )
      .sort((a, b) => new Date(b.refundedAt).getTime() - new Date(a.refundedAt).getTime());

    const totalRefundedAmount = billings.reduce((sum, b) => sum + (b.totalRefunded || 0), 0);
    const refundedAccountsCount = billings.filter((b) => (b.totalRefunded || 0) > 0).length;

    return {
      totalRefundedAmount,
      refundTransactionsCount: allRefunds.length,
      refundedAccountsCount,
      latestRefund: allRefunds[0] || null
    };
  }, [billings]);

  // Latest enquiries (sorted by date descending)
  const latestEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMED':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      <PageSeo
        title="Admin Dashboard"
        description="Administrative overview of enquiries, nurse applications, and patient reviews."
      />

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Clinical Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time home healthcare bookings, nurse deployments, and quality feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/enquiries"
            className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Manage Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Actionable Alerts / Pending Items */}
      {(countPendingNurses > 0 || countPendingReviews > 0 || countNew > 0 || countNewContactMessages > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {countNew > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-900">{countNew} New Enquiries</div>
                  <div className="text-xs text-blue-700">Awaiting clinical callback</div>
                </div>
              </div>
              <Link
                to="/admin/enquiries?stage=NEW"
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Review →
              </Link>
            </div>
          )}

          {countPendingNurses > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-900">{countPendingNurses} Pending Nurses</div>
                  <div className="text-xs text-amber-700">Awaiting credential check</div>
                </div>
              </div>
              <Link
                to="/admin/nurses?status=PENDING"
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Verify →
              </Link>
            </div>
          )}

          {countPendingReviews > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-purple-900">{countPendingReviews} Pending Reviews</div>
                  <div className="text-xs text-purple-700">Awaiting approval for home</div>
                </div>
              </div>
              <Link
                to="/admin/reviews?status=PENDING"
                className="text-xs font-semibold text-purple-700 hover:underline"
              >
                Approve →
              </Link>
            </div>
          )}

          {countNewContactMessages > 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0f8672] flex items-center justify-center shrink-0">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-teal-950 tabular-nums">{countNewContactMessages} Contact Enquiries</div>
                  <div className="text-xs text-teal-700">New Contact Us messages</div>
                </div>
              </div>
              <Link
                to="/admin/contact-messages"
                className="text-xs font-semibold text-[#0f8672] hover:underline whitespace-nowrap shrink-0"
              >
                Open →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Services, Coverage & Refunds Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f8672] flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {services.filter((s) => s.isActive !== false).length} Active Clinical Services
              </div>
              <div className="text-xs text-slate-500 truncate">
                Descriptions, procedures & FAQs
              </div>
            </div>
          </div>
          <Link
            to="/admin/services"
            className="text-xs font-semibold text-[#0f8672] hover:underline whitespace-nowrap shrink-0"
          >
            Edit Services →
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {serviceLocations.filter((l) => l.isActive !== false).length} Active Locations
              </div>
              <div className="text-xs text-slate-500 truncate">
                Dispatch zones & response ETAs
              </div>
            </div>
          </div>
          <Link
            to="/admin/services"
            className="text-xs font-semibold text-[#0f8672] hover:underline whitespace-nowrap shrink-0"
          >
            Locations →
          </Link>
        </div>

        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 tabular-nums">
                  ₹{refundSummary.totalRefundedAmount.toLocaleString('en-IN')} Refunded
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  {refundSummary.refundTransactionsCount} transaction(s) · {refundSummary.refundedAccountsCount} account(s)
                </div>
              </div>
            </div>
            <Link
              to="/admin/finances?view=refunds"
              className="text-xs font-semibold text-rose-700 hover:underline whitespace-nowrap shrink-0"
            >
              View Ledger →
            </Link>
          </div>
          {refundSummary.latestRefund ? (
            <div className="text-[11px] text-slate-600 bg-rose-50/60 border border-rose-100 rounded-lg px-2.5 py-1.5 truncate tabular-nums">
              Latest: <strong className="text-slate-900">{refundSummary.latestRefund.patientName}</strong> · ₹{refundSummary.latestRefund.amount.toLocaleString('en-IN')} via {refundSummary.latestRefund.refundMode}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
              No patient refunds processed yet
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Stages Breakdown Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Enquiries by Lifecycle Stage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-600 uppercase">NEW</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{countNew}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Fresh bookings</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-amber-600 uppercase">CONTACTED</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{countContacted}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Assessing prescription</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-[#0f8672] uppercase">CONFIRMED</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{countConfirmed}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Nurse assigned</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">COMPLETED</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{countCompleted}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Care finished</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">CANCELLED</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{countCancelled}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Out of area / void</div>
          </div>
        </div>
      </div>

      {/* Monthly Enquiry Trends & Nurse Volume Analytics (Recharts) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f8672] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Monthly Enquiry Trends & Nurse Onboarding Volume
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 ml-10">
              Comparative visualization of incoming care demand vs. registered nursing personnel applications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTrendRange('6m')}
                className={`px-3 py-1 rounded-md transition-all ${
                  trendRange === '6m'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => setTrendRange('12m')}
                className={`px-3 py-1 rounded-md transition-all ${
                  trendRange === '12m'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 12 Months
              </button>
            </div>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#0f8672]" />
              Enquiries ({trendRange === '6m' ? '6M' : '12M'})
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">{totalEnquiriesInPeriod}</div>
            <div className="text-[10px] text-slate-400">Total care requests received</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Nurse Applications ({trendRange === '6m' ? '6M' : '12M'})
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">{totalNursesInPeriod}</div>
            <div className="text-[10px] text-slate-400">Credentials onboarded</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500">Active Nurse Roster</div>
            <div className="text-xl font-bold text-teal-700 mt-0.5 tabular-nums">
              {nurses.filter((n) => n.status === 'ACTIVE').length} Active
            </div>
            <div className="text-[10px] text-slate-400">Ready for dispatch</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500">Staffing Inflow Ratio</div>
            <div className="text-xl font-bold text-indigo-700 mt-0.5 tabular-nums">
              {totalEnquiriesInPeriod > 0
                ? `${((totalNursesInPeriod / totalEnquiriesInPeriod) * 100).toFixed(1)}%`
                : '100%'}
            </div>
            <div className="text-[10px] text-slate-400">Nurses per enquiry volume</div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyTrendsData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[170px]">
                        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">
                          {label}
                        </p>
                        {payload.map((entry: any, index: number) => (
                          <div
                            key={`tooltip-${index}`}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-900">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <Bar
                name="Patient Enquiries"
                dataKey="enquiries"
                fill="#0f8672"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                name="Nurse Applications"
                dataKey="nurseApplications"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Enquiries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Latest Care Enquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Most recent incoming home nursing requests</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-[#0f8672] hover:underline flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Patient / Contact</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestEnquiries.map((enq) => {
                const srv = services.find((s) => s.id === enq.serviceId);
                return (
                  <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      #{enq.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{enq.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">
                        {srv ? srv.title : 'Home Care'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {enq.cityArea}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeClass(
                          enq.stage
                        )}`}
                      >
                        {enq.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {enq.preferredDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/enquiries?view=${enq.id}`}
                        className="text-xs font-semibold text-[#0f8672] hover:underline"
                      >
                        Open Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
