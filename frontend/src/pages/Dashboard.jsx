import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { metalAPI, dealAPI, reviewAPI } from '../services/api';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { Badge, Section, EmptyState } from '../components/UI';
import toast from 'react-hot-toast';
import { LuTrendingUp, LuTrendingDown, LuClock, LuStar, LuPackagePlus, LuChevronRight, LuActivity, LuLogOut, LuX, LuHistory } from 'react-icons/lu';
import DealPerformanceRing from '../components/DealPerformanceRing';
import { useLogoutModal } from '../components/Layout';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const openLogout = useLogoutModal();
  const [metals, setMetals] = useState([]);
  const [deals, setDeals] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const ratingRef = useRef(null);
  const [historyMetal, setHistoryMetal] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (ratingRef.current && !ratingRef.current.contains(e.target)) setRatingOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    Promise.all([metalAPI.getAll(), dealAPI.getMyDeals(), reviewAPI.getAll()])
      .then(([m, d, r]) => {
        setMetals(m.data);
        setDeals(d.data.slice(0, 3));
        setAllDeals(d.data);
        setReviews(r.data);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewAPI.add(reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted! It will appear after admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const openHistory = async (metal) => {
    setHistoryMetal(metal);
    setHistoryLoading(true);
    setPriceHistory([]);
    try {
      const { data } = await metalAPI.getPriceHistory(metal._id);
      setPriceHistory(data);
    } catch {
      setPriceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#1a2744] to-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-7 mb-6 sm:mb-8">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{user.companyName}</h1>
            <p className="text-slate-400 text-sm mt-1.5">Your company is growing with us.</p>
          </div>
          <button onClick={() => navigate('/book-deal')}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <LuPackagePlus size={18} /> Book a Deal
          </button>
        </div>
      </div>

      {/* Metal Rates */}
      <Section title="Current Metal Rates" icon={<LuTrendingUp size={18} />}>
        {metals.length === 0 ? (
          <EmptyState icon="🔩" message="No metals available yet. Check back soon." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {metals.map((m) => (
              <div key={m._id} onClick={() => openHistory(m)}
                className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 hover:border-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95">
                <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center text-lg mb-3">🔩</div>
                <p className="font-semibold text-white text-sm truncate">{m.metalName}</p>
                <p className="text-orange-400 font-bold text-lg mt-0.5">
                  &#8377;{m.pricePerKg}<span className="text-xs text-slate-500 font-normal">/kg</span>
                </p>
                <p className="text-slate-600 text-[10px] mt-1 flex items-center gap-1">
                  <LuHistory size={9} /> tap for history
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Price History Modal */}
      {historyMetal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHistoryMetal(null)} />
          <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <button onClick={() => setHistoryMetal(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition">
              <LuX size={18} />
            </button>

            {/* Metal header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center text-xl shrink-0">🔩</div>
              <div>
                <p className="font-bold text-white">{historyMetal.metalName}</p>
                <p className="text-orange-400 font-semibold text-sm">
                  Current: &#8377;{historyMetal.pricePerKg}/kg
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <LuHistory size={11} /> Last 3 Rate Changes
            </p>

            {historyLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : priceHistory.length === 0 ? (
              <div className="text-center py-5 bg-[#0F172A] rounded-xl border border-white/5">
                <p className="text-slate-500 text-sm">No price changes recorded yet.</p>
                <p className="text-slate-600 text-xs mt-1">Current rate is the original price.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {priceHistory.map((h, i) => {
                  const up = h.newPrice > h.oldPrice;
                  const pct = ((h.newPrice - h.oldPrice) / h.oldPrice * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center justify-between bg-[#0F172A] rounded-xl px-4 py-3 border border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs line-through">&#8377;{h.oldPrice}</span>
                          <span className="text-slate-600 text-xs">&#8594;</span>
                          <span className="text-white text-sm font-bold">&#8377;{h.newPrice}</span>
                          {up
                            ? <LuTrendingUp size={13} className="text-green-400" />
                            : <LuTrendingDown size={13} className="text-red-400" />}
                        </div>
                        <p className="text-slate-600 text-[10px] mt-0.5">
                          {new Date(h.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {up ? '+' : ''}{pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Deals */}
      <Section title="Recent Deals" icon={<LuClock size={18} />}>
        <div className="flex items-center justify-between mb-4 -mt-1">
          <span />
          <button onClick={() => navigate('/my-deals')}
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition">
            View all <LuChevronRight size={13} />
          </button>
        </div>
        {deals.length === 0 ? (
          <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-8 text-center">
            <p className="text-slate-400 text-sm mb-3">No deals yet.</p>
            <button onClick={() => navigate('/book-deal')} className="btn-primary text-sm px-5 py-2.5">
              Book your first deal
            </button>
          </div>
        ) : (Array.isArray(deals) && deals.length > 0) ? (
          <div className="space-y-3">
            {deals.map((d) => (
              <div key={d._id}
                className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                    {d.metalType[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{d.metalType}</p>
                    <p className="text-slate-500 text-xs">{d.weight} {d.weightUnit} · &#8377;{d.rate}/kg</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <p className="font-bold text-white">&#8377;{d.totalAmount.toLocaleString()}</p>
                  <Badge status={d.status} />
                  <p className="text-slate-500 text-xs hidden sm:block">{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      {/* Deal Performance Ring */}
      <Section title="Deal Performance" icon={<LuActivity size={18} />}>
        <DealPerformanceRing deals={allDeals} />
      </Section>

      {/* Reviews */}
      <Section title="Company Reviews" icon={<LuStar size={18} />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
            <h3 className="font-semibold text-white mb-4 text-sm">Share Your Experience</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div ref={ratingRef}>
                <label className="label-dark">Rating</label>
                <div className="relative">
                  <button type="button" onClick={() => setRatingOpen(o => !o)}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between hover:border-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-500 transition">
                    <span>{'⭐'.repeat(reviewForm.rating)} — {reviewForm.rating} star{reviewForm.rating > 1 ? 's' : ''}</span>
                    <span className={`text-slate-400 text-xs transition-transform duration-200 ${ratingOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {ratingOpen && (
                    <div className="absolute z-20 mt-2 w-full bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button key={r} type="button"
                          onClick={() => { setReviewForm({ ...reviewForm, rating: r }); setRatingOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-orange-500/10 ${reviewForm.rating === r ? 'text-orange-400 bg-orange-500/5' : 'text-white'}`}>
                          <span className="w-8 h-8 bg-orange-500/15 rounded-xl flex items-center justify-center text-base shrink-0">⭐</span>
                          <span className="font-semibold">{r} star{r > 1 ? 's' : ''}</span>
                          <span className="ml-auto text-yellow-400 text-xs">{'⭐'.repeat(r)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="label-dark">Comment</label>
                <textarea required value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3} className="input-dark resize-none"
                  placeholder="Share your experience with ScrapMetal Pro..." />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : 'Submit Review'}
              </button>
            </form>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <EmptyState icon="💬" message="No reviews yet. Be the first!" />
            ) : reviews.map((r) => (
              <div key={r._id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 hover:border-white/10 transition">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                      {r.companyName[0]}
                    </div>
                    <span className="font-semibold text-white text-sm truncate max-w-[140px]">{r.companyName}</span>
                  </div>
                  <span className="text-yellow-400 text-xs shrink-0">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
                <p className="text-xs text-slate-600 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Logout */}
      <div className="mt-2 mb-4">
        <button onClick={openLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 font-semibold py-3.5 rounded-2xl transition-all duration-200 active:scale-95">
          <LuLogOut size={18} /> Sign Out
        </button>
      </div>
    </Layout>
  );
}
