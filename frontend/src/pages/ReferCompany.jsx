import { useEffect, useState } from 'react';
import { referralAPI } from '../services/api';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { EmptyState } from '../components/UI';
import toast from 'react-hot-toast';
import { LuUsers, LuPlus, LuBuilding2, LuPhone, LuUser, LuFileText, LuX } from 'react-icons/lu';

const statusStyle = {
  New:       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Converted: 'bg-green-500/15 text-green-400 border-green-500/20',
};

export default function ReferCompany() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: '', contactPerson: '', phone: '', note: '' });

  useEffect(() => {
    referralAPI.getMy()
      .then(({ data }) => setReferrals(data))
      .catch(() => toast.error('Failed to load referrals'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await referralAPI.create(form);
      setReferrals([data, ...referrals]);
      setForm({ companyName: '', contactPerson: '', phone: '', note: '' });
      setShowForm(false);
      toast.success('Referral submitted! Admin has been notified.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  const total     = referrals.length;
  const converted = referrals.filter((r) => r.status === 'Converted').length;
  const contacted = referrals.filter((r) => r.status === 'Contacted').length;
  const pending   = referrals.filter((r) => r.status === 'New').length;

  return (
    <Layout>

      {/* Page Header — same pattern as Reminders */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <LuUsers className="text-orange-500 shrink-0" size={24} /> Refer a Company
        </h1>
        <p className="text-slate-400 text-sm">
          Know a company with scrap? Refer them — admin will follow up
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95
            ${showForm
              ? 'bg-white/8 text-slate-300 border border-white/10'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}>
          {showForm ? <><LuX size={15} /> Cancel</> : <><LuPlus size={15} /> Refer a Company</>}
        </button>
      </div>

      {/* Stats row — only show if there are referrals */}
      {total > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Total',     value: total,     color: 'text-white',        bg: 'bg-white/5',          border: 'border-white/8' },
            { label: 'New',       value: pending,   color: 'text-blue-400',     bg: 'bg-blue-500/10',      border: 'border-blue-500/15' },
            { label: 'Contacted', value: contacted, color: 'text-yellow-400',   bg: 'bg-yellow-500/10',    border: 'border-yellow-500/15' },
            { label: 'Converted', value: converted, color: 'text-green-400',    bg: 'bg-green-500/10',     border: 'border-green-500/15' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-3 text-center`}>
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-[#1E293B] rounded-2xl border border-orange-500/25 p-4 mb-6">
          <p className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <LuUsers size={14} className="text-orange-400" /> Company Details
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Company Name</label>
              <div className="relative">
                <LuBuilding2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" required value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="input-dark pl-10" placeholder="XYZ Scrap Pvt. Ltd." />
              </div>
            </div>
            <div>
              <label className="label-dark">Contact Person</label>
              <div className="relative">
                <LuUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" required value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="input-dark pl-10" placeholder="Mr. Ramesh Kumar" />
              </div>
            </div>
            <div>
              <label className="label-dark">Phone Number</label>
              <div className="relative">
                <LuPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-dark pl-10" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div>
              <label className="label-dark">
                Note <span className="normal-case text-slate-600 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <LuFileText size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                <textarea value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={2} className="input-dark pl-10 resize-none"
                  placeholder="e.g. They have large quantity of copper scrap..." />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LuUsers size={15} /> Submit Referral
                </span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {referrals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="🤝" message="No referrals yet. Tap 'Refer a Company' above." />
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((r) => {
            const summaryLine = `${r.contactPerson} · ${r.phone}`;
            return (
              <div key={r._id}
                className="bg-[#1E293B] rounded-2xl border border-white/5 transition-all">
                <div className="p-4">

                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusStyle[r.status]}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Company name — main line */}
                  <p className="text-white text-sm font-semibold leading-snug truncate">{r.companyName}</p>

                  {/* Contact line */}
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{summaryLine}</p>

                  {/* Note */}
                  {r.note && (
                    <p className="text-slate-500 text-xs mt-0.5 italic truncate">"{r.note}"</p>
                  )}

                  {/* Button below — same as reminder */}
                  <div className="mt-3">
                    <div className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-medium bg-white/5 border border-white/5">
                      <span className="text-slate-500">
                        Referred {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {r.status === 'Converted' && (
                        <span className="text-green-400 font-semibold">✅ Converted</span>
                      )}
                      {r.status === 'Contacted' && (
                        <span className="text-yellow-400 font-semibold">📞 Being Contacted</span>
                      )}
                      {r.status === 'New' && (
                        <span className="text-blue-400 font-semibold">🔔 Notified Admin</span>
                      )}
                    </div>
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
