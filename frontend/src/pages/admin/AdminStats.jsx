import { useEffect, useState } from 'react';
import { dealAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { LuChartBar, LuTrendingUp, LuPackage, LuUsers, LuChartPie } from 'react-icons/lu';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealAPI.getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  const total = (stats.pending + stats.accepted + stats.completed + stats.rejected) || 1;

  const statusCards = [
    { label: 'Pending',   value: stats.pending,   color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Accepted',  value: stats.accepted,  color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
    { label: 'Completed', value: stats.completed, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
    { label: 'Rejected',  value: stats.rejected,  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  ];

  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuChartBar className="text-orange-500" size={28} /> Dashboard Overview
        </h1>
        <p className="page-subtitle">Real-time business performance at a glance</p>
      </div>

      {/* Revenue hero */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#1a2744] to-[#1E293B] rounded-2xl border border-white/5 p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-sm mb-1">This Month's Revenue</p>
            <p className="text-4xl font-black text-white">₹{stats.currentMonthRevenue.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-2">Resets on the 1st of each month</p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <p className="text-slate-400 text-sm mb-1">All-Time Revenue</p>
            <p className="text-2xl font-black text-green-400">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-2">{stats.completed} completed deals</p>
          </div>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statusCards.map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color.replace('text-','bg-')}`}
                style={{ width: `${(value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
          <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <LuTrendingUp size={15} className="text-orange-400" /> Monthly Revenue (Last 6 Months)
          </h2>
          {stats.monthlyRevenue.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No completed deals yet</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {stats.monthlyRevenue.map((m) => {
                const pct = (m.revenue / maxRevenue) * 100;
                const label = `${MONTH_NAMES[m._id.month - 1]} ${String(m._id.year).slice(2)}`;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-[9px] text-slate-500 font-medium">
                      {m.revenue >= 1000 ? `₹${(m.revenue/1000).toFixed(0)}k` : `₹${m.revenue}`}
                    </p>
                    <div className="w-full bg-[#0F172A] rounded-lg overflow-hidden" style={{ height: '80px' }}>
                      <div className="w-full bg-orange-500 rounded-lg transition-all duration-700"
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-500">{label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Metals */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
          <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <LuPackage size={15} className="text-orange-400" /> Most Traded Metals
          </h2>
          {stats.topMetals.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No deals yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topMetals.map((m, i) => {
                const maxCount = stats.topMetals[0].count;
                return (
                  <div key={m._id} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-xs font-medium">{m._id}</span>
                        <span className="text-slate-400 text-xs">{m.count} deals</span>
                      </div>
                      <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(m.count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
        <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <LuUsers size={15} className="text-orange-400" /> Top Companies by Revenue
        </h2>
        {stats.topCompanies.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No completed deals yet</p>
        ) : (
          <div className="space-y-3">
            {stats.topCompanies.map((c, i) => (
              <div key={c._id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl border border-white/5">
                <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{c._id}</p>
                  <p className="text-slate-500 text-xs">{c.count} deal{c.count !== 1 ? 's' : ''}</p>
                </div>
                <p className="text-green-400 font-bold text-sm shrink-0">₹{c.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
