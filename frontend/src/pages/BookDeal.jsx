import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metalAPI, dealAPI } from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { LuPackagePlus } from 'react-icons/lu';

export default function BookDeal() {
  const [metals, setMetals] = useState([]);
  const [form, setForm] = useState({ metalType: '', weight: '', weightUnit: 'kg', rate: '', totalAmount: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    metalAPI.getAll().then(({ data }) => setMetals(data)).catch(() => toast.error('Failed to load metals'));
  }, []);

  const handleMetalChange = (e) => {
    const selected = metals.find((m) => m.metalName === e.target.value);
    const rate = selected ? selected.pricePerKg : '';
    const total = rate && form.weight ? (parseFloat(rate) * parseFloat(form.weight)).toFixed(2) : '';
    setForm({ ...form, metalType: e.target.value, rate, totalAmount: total });
  };

  const handleWeightChange = (e) => {
    const weight = e.target.value;
    const total = form.rate && weight ? (parseFloat(form.rate) * parseFloat(weight)).toFixed(2) : '';
    setForm({ ...form, weight, totalAmount: total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.metalType) return toast.error('Please select a metal');
    setLoading(true);
    try {
      await dealAPI.book(form);
      toast.success('Deal booked successfully!');
      navigate('/my-deals');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="page-title flex items-center gap-2">
            <LuPackagePlus className="text-orange-500" size={28} /> Book a Deal
          </h1>
          <p className="page-subtitle">Fill in the details to submit your scrap metal deal</p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-white/5 shadow-xl p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark">Select Metal</label>
              <div className="relative">
                <select required value={form.metalType} onChange={handleMetalChange} className="select-dark">
                  <option value="">— Choose a metal —</option>
                  {metals.map((m) => (
                    <option key={m._id} value={m.metalName}>{m.metalName} — ₹{m.pricePerKg}/kg</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Weight</label>
                <input type="number" min="0.1" step="0.1" required value={form.weight}
                  onChange={handleWeightChange} className="input-dark" placeholder="e.g. 100" />
              </div>
              <div>
                <label className="label-dark">Unit</label>
                <div className="relative">
                  <select value={form.weightUnit}
                    onChange={(e) => setForm({ ...form, weightUnit: e.target.value })}
                    className="select-dark">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ton">Tons</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                </div>
              </div>
            </div>

            <div>
              <label className="label-dark">Rate (₹/kg)</label>
              <input type="text" readOnly value={form.rate ? `₹${form.rate}` : ''}
                className="input-dark opacity-60 cursor-not-allowed"
                placeholder="Auto-filled on metal selection" />
            </div>

            <div>
              <label className="label-dark">Total Amount</label>
              <div className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all
                ${form.totalAmount
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : 'bg-[#0F172A] border-white/10 text-slate-500'}`}>
                {form.totalAmount ? `₹${parseFloat(form.totalAmount).toLocaleString()}` : 'Auto-calculated'}
              </div>
            </div>

            <div className="border-t border-white/5" />

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : '✅ Submit Deal'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
