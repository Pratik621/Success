import { useEffect, useState } from 'react';
import { reviewAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuStar, LuTrash2, LuCheck, LuX } from 'react-icons/lu';

const tabs = ['Pending', 'Approved', 'Rejected'];

const tabStyle = {
  Pending:  { active: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  Approved: { active: 'bg-green-500/15 text-green-400 border-green-500/30',   dot: 'bg-green-400' },
  Rejected: { active: 'bg-red-500/15 text-red-400 border-red-500/30',         dot: 'bg-red-400' },
};

const badgeStyle = {
  Pending:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Approved: 'bg-green-500/15 text-green-400 border-green-500/20',
  Rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  const fetchReviews = () => {
    reviewAPI.getAdmin()
      .then(({ data }) => setReviews(data))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await reviewAPI.updateStatus(id, status);
      setReviews((prev) => prev.map((r) => r._id === id ? data : r));
      toast.success(`Review ${status}`);
    } catch {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const filtered = reviews.filter((r) => r.status === activeTab);
  const counts   = { Pending: 0, Approved: 0, Rejected: 0 };
  reviews.forEach((r) => { if (counts[r.status] !== undefined) counts[r.status]++; });

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuStar className="text-yellow-400" size={28} /> Manage Reviews
        </h1>
        <p className="page-subtitle">Approve reviews before they appear on the user home page</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all
              ${activeTab === tab
                ? tabStyle[tab].active
                : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'}`}>
            <span className={`w-2 h-2 rounded-full ${activeTab === tab ? tabStyle[tab].dot : 'bg-slate-600'}`} />
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${activeTab === tab ? 'bg-white/20' : 'bg-white/5 text-slate-500'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon={activeTab === 'Pending' ? '⏳' : activeTab === 'Approved' ? '✅' : '❌'}
            message={`No ${activeTab.toLowerCase()} reviews.`} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r._id}
              className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 flex flex-col gap-3 hover:border-white/10 transition">

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                    {r.companyName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{r.companyName}</p>
                    <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badgeStyle[r.status]}`}>
                  {r.status}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <LuStar key={s} size={13}
                    className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{r.comment}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-white/5">
                {r.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(r._id, 'Approved')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition active:scale-95">
                      <LuCheck size={13} /> Approve
                    </button>
                    <button onClick={() => updateStatus(r._id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition active:scale-95">
                      <LuX size={13} /> Reject
                    </button>
                  </>
                )}
                {r.status === 'Approved' && (
                  <button onClick={() => updateStatus(r._id, 'Rejected')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition active:scale-95">
                    <LuX size={13} /> Reject
                  </button>
                )}
                {r.status === 'Rejected' && (
                  <button onClick={() => updateStatus(r._id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition active:scale-95">
                    <LuCheck size={13} /> Approve
                  </button>
                )}
                <button onClick={() => handleDelete(r._id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition">
                  <LuTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
