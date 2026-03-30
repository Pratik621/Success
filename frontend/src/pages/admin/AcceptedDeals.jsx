import { useEffect, useState } from 'react';
import { dealAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import DealTable from '../../components/DealTable';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuCircleCheck } from 'react-icons/lu';

export default function AcceptedDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealAPI.getAllDeals('Accepted')
      .then(({ data }) => setDeals(data))
      .catch(() => toast.error('Failed to load deals'))
      .finally(() => setLoading(false));
  }, []);

  const markCompleted = async (id) => {
    try {
      await dealAPI.updateStatus(id, 'Completed');
      toast.success('Deal marked as Completed');
      setDeals((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error('Failed to update deal');
    }
  };

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuCircleCheck className="text-blue-400" size={28} /> Accepted Deals
        </h1>
        <p className="page-subtitle">{deals.length} deal{deals.length !== 1 ? 's' : ''} accepted — ready to complete</p>
      </div>
      {deals.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="📭" message="No accepted deals at the moment." />
        </div>
      ) : (
        <DealTable
          isAdmin
          deals={deals}
          renderActions={(d) => (
            <button onClick={() => markCompleted(d._id)}
              className="bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 text-blue-400 font-semibold px-4 py-2 rounded-xl border border-blue-500/20 transition-all duration-200 text-sm whitespace-nowrap">
              Mark Completed
            </button>
          )}
        />
      )}
    </Layout>
  );
}
