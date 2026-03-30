import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealAPI } from '../services/api';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { Badge, EmptyState } from '../components/UI';
import toast from 'react-hot-toast';
import { LuClipboardList, LuSearch, LuFilter, LuFileText, LuCheck, LuX } from 'react-icons/lu';

const STATUS_OPTIONS = ['All', 'Pending', 'Accepted', 'Completed', 'Rejected'];

export default function MyDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const fetchDeals = () => {
    const params = {};
    if (statusFilter !== 'All') params.status = statusFilter;
    if (search) params.search = search;
    dealAPI.getMyDeals(params)
      .then(({ data }) => setDeals(data))
      .catch(() => toast.error('Failed to load deals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDeals(); }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchDeals();
  };

  const respondCounter = async (id, accept) => {
    try {
      const { data } = await dealAPI.respondCounter(id, accept);
      setDeals((prev) => prev.map((d) => d._id === id ? data : d));
      toast.success(accept ? 'Counter offer accepted!' : 'Counter offer declined');
    } catch {
      toast.error('Failed to respond');
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="mb-5">
        <h1 className="page-title flex items-center gap-2">
          <LuClipboardList className="text-orange-500" size={28} /> My Deal History
        </h1>
        <p className="page-subtitle">{deals.length} deal{deals.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-10 w-full" placeholder="Search by metal or status..." />
        </form>
        <div className="relative shrink-0">
          <LuFilter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setLoading(true); }}
            className="select-dark pl-9 pr-8 w-full sm:w-40">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="📭" message="No deals found." />
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((d, i) => (
            <div key={d._id} className="bg-[#1E293B] rounded-2xl border border-white/5 hover:border-white/10 transition">
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                      {d.metalType[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{d.metalType}</p>
                      <p className="text-slate-500 text-xs">{d.weight} {d.weightUnit} · ₹{d.rate}/kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={d.status} />
                    <p className="font-bold text-white text-sm">₹{d.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Counter offer banner */}
                {d.counterStatus === 'Pending' && (
                  <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl p-3 mb-3">
                    <p className="text-orange-400 text-xs font-semibold mb-1">⚡ Admin Counter Offer</p>
                    <p className="text-white text-sm">New rate: <span className="font-bold text-orange-400">₹{d.counterRate}/kg</span>
                      {' '}→ Total: <span className="font-bold">₹{(d.weight * d.counterRate).toLocaleString()}</span>
                    </p>
                    {d.counterNote && <p className="text-slate-400 text-xs mt-1 italic">"{d.counterNote}"</p>}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => respondCounter(d._id, true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition active:scale-95">
                        <LuCheck size={13} /> Accept
                      </button>
                      <button onClick={() => respondCounter(d._id, false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition active:scale-95">
                        <LuX size={13} /> Decline
                      </button>
                    </div>
                  </div>
                )}
                {d.counterStatus === 'Accepted' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-3">
                    <p className="text-green-400 text-xs font-semibold">✅ Counter offer accepted — Rate: ₹{d.counterRate}/kg</p>
                  </div>
                )}
                {d.counterStatus === 'Declined' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-3">
                    <p className="text-red-400 text-xs font-semibold">❌ Counter offer declined</p>
                  </div>
                )}

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <p className="text-slate-600 text-xs">{new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  {d.status === 'Completed' && (
                    <button onClick={() => navigate(`/invoice/${d._id}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 px-3 py-1.5 rounded-xl transition active:scale-95">
                      <LuFileText size={13} /> Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
