import { useEffect, useState } from 'react';
import { dealAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import DealTable from '../../components/DealTable';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuClock, LuX } from 'react-icons/lu';

function CounterModal({ deal, onClose, onSubmit }) {
  const [rate, setRate] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(deal._id, { counterRate: rate, counterNote: note });
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><LuX size={18} /></button>
        <h2 className="text-white font-bold mb-1">Counter Offer</h2>
        <p className="text-slate-400 text-xs mb-4">{deal.companyName} · {deal.metalType} · {deal.weight} {deal.weightUnit}</p>
        <form onSubmit={handle} className="space-y-3">
          <div>
            <label className="label-dark">New Rate (₹/kg)</label>
            <input type="number" required min="0.01" step="0.01" value={rate}
              onChange={(e) => setRate(e.target.value)} className="input-dark" placeholder="e.g. 420" />
          </div>
          {rate && <p className="text-orange-400 text-xs">New total: ₹{(deal.weight * parseFloat(rate || 0)).toLocaleString()}</p>}
          <div>
            <label className="label-dark">Note <span className="normal-case text-slate-600 font-normal">(optional)</span></label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              rows={2} className="input-dark resize-none" placeholder="Reason for counter offer..." />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Sending...' : 'Send Counter Offer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PendingDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterDeal, setCounterDeal] = useState(null);

  useEffect(() => {
    dealAPI.getAllDeals('Pending')
      .then(({ data }) => {
        // Safety check - ensure data is an array
        setDeals(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load deals:', err);
        toast.error('Failed to load deals');
        setDeals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await dealAPI.updateStatus(id, status);
      toast.success(`Deal ${status}`);
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch { toast.error('Failed to update deal'); }
  };

  const sendCounter = async (id, data) => {
    try {
      await dealAPI.counterOffer(id, data);
      toast.success('Counter offer sent!');
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch { toast.error('Failed to send counter offer'); throw new Error(); }
  };

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuClock className="text-yellow-400" size={28} /> Pending Deals
        </h1>
        <p className="page-subtitle">{deals.length} deal{deals.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      {deals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="✅" message="All caught up! No pending deals." />
        </div>
      ) : (
        <DealTable
          isAdmin
          deals={deals}
          renderActions={(d) => (
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => updateStatus(d._id, 'Accepted')} className="btn-success">Accept</button>
              <button onClick={() => setCounterDeal(d)}
                className="bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 text-orange-400 font-semibold px-3 py-2 rounded-xl border border-orange-500/20 transition-all text-xs">
                Counter
              </button>
              <button onClick={() => updateStatus(d._id, 'Rejected')} className="btn-danger">Reject</button>
            </div>
          )}
        />
      )}

      {counterDeal && (
        <CounterModal deal={counterDeal} onClose={() => setCounterDeal(null)} onSubmit={sendCounter} />
      )}
    </Layout>
  );
}
