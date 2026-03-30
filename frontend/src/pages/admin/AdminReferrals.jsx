import { useEffect, useState } from 'react';
import { referralAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuUsers, LuPhone } from 'react-icons/lu';

const statusStyle = {
  New:       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Converted: 'bg-green-500/15 text-green-400 border-green-500/20',
};

const nextStatus = { New: 'Contacted', Contacted: 'Converted' };
const nextLabel  = { New: 'Mark Contacted', Contacted: 'Mark Converted' };

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralAPI.getAll()
      .then(({ data }) => setReferrals(data))
      .catch(() => toast.error('Failed to load referrals'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await referralAPI.updateStatus(id, status);
      setReferrals((prev) => prev.map((r) => (r._id === id ? data : r)));
      toast.success(`Referral marked as ${status}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const newCount       = referrals.filter((r) => r.status === 'New').length;
  const contactedCount = referrals.filter((r) => r.status === 'Contacted').length;
  const convertedCount = referrals.filter((r) => r.status === 'Converted').length;

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuUsers className="text-orange-500" size={28} /> Company Referrals
        </h1>
        <p className="page-subtitle">Companies referred by existing users — follow up and convert</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'New',       count: newCount,       color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
          { label: 'Contacted', count: contactedCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Converted', count: convertedCount, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
        ].map(({ label, count, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-3 sm:p-4 text-center`}>
            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {referrals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="🤝" message="No referrals yet." />
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((r) => (
            <div key={r._id}
              className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 sm:p-5 hover:border-white/10 transition">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 font-bold text-base shrink-0">
                    {r.companyName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{r.companyName}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">👤 {r.contactPerson}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <LuPhone size={11} className="text-slate-500" />
                      <a href={`tel:${r.phone}`} className="text-slate-400 text-xs hover:text-orange-400 transition">{r.phone}</a>
                    </div>
                    {r.note && <p className="text-slate-500 text-xs mt-0.5 italic">"{r.note}"</p>}
                    <p className="text-slate-600 text-xs mt-1">
                      Referred by <span className="text-slate-400">{r.referrerCompany}</span> · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                {nextStatus[r.status] && (
                  <button onClick={() => updateStatus(r._id, nextStatus[r.status])}
                    className="btn-primary text-sm px-4 py-2.5 self-end sm:self-auto shrink-0">
                    {nextLabel[r.status]}
                  </button>
                )}
                {r.status === 'Converted' && (
                  <span className="text-green-400 text-xs font-semibold self-end sm:self-auto">✅ Converted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
