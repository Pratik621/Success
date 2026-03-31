import { useEffect, useState } from 'react';
import { dealAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import DealTable from '../../components/DealTable';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuTrophy } from 'react-icons/lu';

export default function CompletedDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealAPI.getAllDeals('Completed')
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

  const totalRevenue = deals.reduce((sum, d) => sum + d.totalAmount, 0);

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LuTrophy className="text-green-400" size={28} /> Completed Deals
          </h1>
          <p className="page-subtitle">{deals.length} deal{deals.length !== 1 ? 's' : ''} successfully completed</p>
        </div>
        <div className="bg-[#1E293B] border border-green-500/20 rounded-2xl px-5 py-4 shrink-0">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      {deals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="🏆" message="No completed deals yet." />
        </div>
      ) : (
        <DealTable isAdmin deals={deals} />
      )}
    </Layout>
  );
}
