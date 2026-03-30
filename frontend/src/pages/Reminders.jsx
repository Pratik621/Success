import { useEffect, useState } from 'react';
import { reminderAPI, metalAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { EmptyState } from '../components/UI';
import toast from 'react-hot-toast';
import { LuBell, LuPlus, LuTrash2, LuCheck, LuPhone, LuX } from 'react-icons/lu';

const statusColor = {
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Done:    'bg-green-500/15 text-green-400 border-green-500/20',
};

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [metals, setMetals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    metalType: '',
    pickupDate: getTomorrowDate(),
    note: '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    Promise.all([reminderAPI.getMy(), metalAPI.getAll()])
      .then(([r, m]) => { setReminders(r.data); setMetals(m.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await reminderAPI.create(form);
      setReminders([data, ...reminders]);
      setForm({ metalType: '', pickupDate: getTomorrowDate(), note: '', phone: user?.phone || '' });
      setShowForm(false);
      toast.success('Reminder set! Admin will be notified.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reminderAPI.deleteMy(id);
      setReminders((prev) => prev.filter((r) => r._id !== id));
      toast.success('Reminder removed');
    } catch {
      toast.error('Failed to remove reminder');
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <LuBell className="text-orange-500 shrink-0" size={24} /> Pickup Reminders
        </h1>
        <p className="text-slate-400 text-sm">
          Schedule a pickup — admin gets notified automatically
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95
            ${showForm
              ? 'bg-white/8 text-slate-300 border border-white/10'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}>
          {showForm ? <><LuX size={15} /> Cancel</> : <><LuPlus size={15} /> Set New Reminder</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#1E293B] rounded-2xl border border-orange-500/25 p-4 mb-6">
          <p className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <LuBell size={14} className="text-orange-400" /> New Pickup Reminder
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Metal Type</label>
              <div className="relative">
                <select required value={form.metalType}
                  onChange={(e) => setForm({ ...form, metalType: e.target.value })}
                  className="select-dark">
                  <option value="">— Select metal —</option>

                  {/* Default / common options always available */}
                  <optgroup label="── Common Types ──">
                    <option value="Mixed Metals">🔩 Mixed Metals (All Types)</option>
                    <option value="Iron / Steel">🪨 Iron / Steel</option>
                    <option value="Copper">🟠 Copper</option>
                    <option value="Aluminium">⚪ Aluminium</option>
                    <option value="Brass">🟡 Brass</option>
                    <option value="Stainless Steel">🔘 Stainless Steel</option>
                    <option value="Lead">⬛ Lead</option>
                    <option value="Zinc">🔵 Zinc</option>
                  </optgroup>

                  {/* Admin-added metals */}
                  {metals.length > 0 && (
                    <optgroup label="── Listed Metals ──">
                      {metals.map((m) => (
                        <option key={m._id} value={m.metalName}>{m.metalName}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
              </div>
            </div>
            <div>
              <label className="label-dark">Pickup Date</label>
              <input type="date" required value={form.pickupDate}
                min={getTomorrowDate()}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Contact Phone</label>
              <div className="relative">
                <LuPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-dark pl-10" placeholder="Your contact number" />
              </div>
            </div>
            <div>
              <label className="label-dark">
                Note <span className="normal-case text-slate-600 font-normal">(optional)</span>
              </label>
              <textarea value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={2} className="input-dark resize-none"
                placeholder="Any special instructions..." />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LuBell size={15} /> Confirm Reminder
                </span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {reminders.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="🔔" message="No reminders yet. Tap 'Set New Reminder' above." />
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => {
            const pickup  = new Date(r.pickupDate);
            const isToday = new Date().toDateString() === pickup.toDateString();
            const isPast  = pickup < new Date() && !isToday;

            // Single summary line
            const summaryLine = `${r.metalType} · ${pickup.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${r.phone}`;

            return (
              <div key={r._id}
                className={`bg-[#1E293B] rounded-2xl border transition-all
                  ${isToday ? 'border-orange-500/40' : isPast ? 'border-white/5 opacity-55' : 'border-white/5'}`}>
                <div className="p-4">

                  {/* Single info line */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {isToday && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
                        Today
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium leading-snug truncate">{summaryLine}</p>
                  {r.note && (
                    <p className="text-slate-500 text-xs mt-0.5 italic truncate">"{r.note}"</p>
                  )}

                  {/* Button below */}
                  <div className="mt-3">
                    {r.status === 'Pending' ? (
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 transition-all active:scale-95">
                        <LuTrash2 size={13} /> Remove Reminder
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-green-400 bg-green-500/8 border border-green-500/15">
                        <LuCheck size={13} /> Picked Up
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
