import { useEffect, useState } from 'react';
import { reminderAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuBell, LuCalendar, LuCheck, LuPhone } from 'react-icons/lu';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminReminders() {
  const [data, setData] = useState({ reminders: [], rangeEnd: null, daysAhead: 0 });
  const [loading, setLoading] = useState(true);

  const fetchReminders = () => {
    reminderAPI.getAdmin()
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Failed to load reminders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReminders(); }, []);

  const markDone = async (id) => {
    try {
      await reminderAPI.markDone(id);
      toast.success('Marked as picked up!');
      setData((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r._id !== id) }));
    } catch {
      toast.error('Failed to update');
    }
  };

  const now = new Date();
  const todayName = DAY_NAMES[now.getDay()];
  const rangeEndName = data.rangeEnd ? DAY_NAMES[new Date(data.rangeEnd).getDay()] : '';

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LuBell className="text-orange-500" size={28} /> Pickup Reminders
          </h1>
          <p className="page-subtitle">
            Today is <span className="text-white font-semibold">{todayName}</span>
            {rangeEndName && (
              <> — showing pickups up to <span className="text-orange-400 font-semibold">{rangeEndName}</span> ({data.daysAhead} day{data.daysAhead !== 1 ? 's' : ''} ahead)</>
            )}
          </p>
        </div>
        {/* Live clock badge */}
        <div className="bg-[#1E293B] border border-white/5 rounded-2xl px-4 py-3 shrink-0 text-center">
          <p className="text-xs text-slate-400 mb-0.5">Today</p>
          <p className="text-white font-bold text-sm">
            {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Count badge */}
      {data.reminders.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">
            <span className="text-white font-semibold">{data.reminders.length}</span> company{data.reminders.length !== 1 ? 'ies' : ''} need pickup in this window
          </span>
        </div>
      )}

      {data.reminders.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="✅" message={`No pickups scheduled between today (${todayName}) and ${rangeEndName || 'end of window'}.`} />
        </div>
      ) : (
        <div className="space-y-3">
          {data.reminders.map((r) => {
            const pickup = new Date(r.pickupDate);
            const isToday = now.toDateString() === pickup.toDateString();
            const dayName = DAY_NAMES[pickup.getDay()];
            return (
              <div key={r._id}
                className={`bg-[#1E293B] rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition
                  ${isToday ? 'border-orange-500/40 shadow-lg shadow-orange-500/5' : 'border-white/5 hover:border-white/10'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 text-center
                    ${isToday ? 'bg-orange-500/20' : 'bg-[#0F172A]'}`}>
                    <span className={`text-xs font-semibold ${isToday ? 'text-orange-400' : 'text-slate-500'}`}>{dayName.slice(0, 3)}</span>
                    <span className={`text-lg font-bold leading-tight ${isToday ? 'text-orange-400' : 'text-white'}`}>{pickup.getDate()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{r.companyName}</p>
                      {isToday && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium animate-pulse">TODAY</span>}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">🔩 {r.metalType}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <LuPhone size={11} className="text-slate-500" />
                      <a href={`tel:${r.phone}`} className="text-slate-400 text-xs hover:text-orange-400 transition">{r.phone}</a>
                    </div>
                    {r.note && <p className="text-slate-500 text-xs mt-0.5 italic">"{r.note}"</p>}
                  </div>
                </div>
                <button onClick={() => markDone(r._id)}
                  className="btn-success flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <LuCheck size={15} /> Mark Picked Up
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
