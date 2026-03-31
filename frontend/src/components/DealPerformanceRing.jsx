import { useMemo, useEffect, useState } from 'react';

const R = 80;
const STROKE = 14;
const C = 2 * Math.PI * R;
const SZ = 220;
const CX = SZ / 2;

export default function DealPerformanceRing({ deals = [] }) {
  const [animated, setAnimated] = useState(false);

  // Safety check - ensure deals is an array
  const dealsArray = Array.isArray(deals) ? deals : [];

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Last 3 months dynamically
  const months = useMemo(() => {
    const now = new Date();
    return [2, 1, 0].map((i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        short: d.toLocaleString('default', { month: 'short' }),
        full:  d.toLocaleString('default', { month: 'long' }),
        m: d.getMonth(),
        y: d.getFullYear(),
      };
    });
  }, []);

  // Total per month
  const totals = useMemo(() =>
    months.map(({ m, y }) =>
      dealsArray
        .filter(d => { const dt = new Date(d.createdAt); return dt.getMonth() === m && dt.getFullYear() === y; })
        .reduce((s, d) => s + (d.totalAmount || 0), 0)
    ), [deals, months]);

  // Current month = months[0] (most recent), prev = months[1], oldest = months[2]
  const cur  = totals[0];
  const prev = totals[1];
  const old  = totals[2];

  // Color: compare current vs previous
  // green = cur >= prev (growing), orange = cur < prev but not too low, yellow = very low
  const getColor = () => {
    if (cur === 0 && prev === 0) return { stroke: '#eab308', label: 'No Data',  text: '#eab308' };
    if (cur >= prev)             return { stroke: '#22c55e', label: 'Growing',  text: '#22c55e' };
    const drop = prev > 0 ? (prev - cur) / prev : 1;
    if (drop < 0.4)              return { stroke: '#f97316', label: 'Moderate', text: '#f97316' };
    return                              { stroke: '#eab308', label: 'Low',      text: '#eab308' };
  };

  const color    = getColor();
  const maxVal   = Math.max(cur, prev, old, 1);
  const progress = Math.max(cur / maxVal, 0.04);
  const offset   = animated ? C * (1 - progress) : C;

  const trendPct = prev > 0 ? (((cur - prev) / prev) * 100).toFixed(0) : null;
  const trendUp  = trendPct !== null && Number(trendPct) >= 0;

  // Current month name
  const curMonthName = months[0].short;
  const curYear      = months[0].y;

  return (
    <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold text-sm">Deal Performance</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {months[2].short} → {months[0].short} {curYear}
          </p>
        </div>
        {trendPct !== null && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
            ${trendUp
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(trendPct)}%
          </span>
        )}
      </div>

      {/* Single big ring — centered, full width */}
      <div className="flex justify-center">
        <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
          {/* Background track */}
          <circle cx={CX} cy={CX} r={R} fill="none" stroke="#0F172A" strokeWidth={STROKE} />

          {/* Colored arc */}
          <circle
            cx={CX} cy={CX} r={R}
            fill="none"
            stroke={color.stroke}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CX})`}
            style={{ transition: 'stroke-dashoffset 1.3s ease, stroke 0.5s ease' }}
          />

          {/* Month name — large, inside ring */}
          <text x={CX} y={CX - 18} textAnchor="middle"
            fill={color.stroke} fontSize="28" fontWeight="800" fontFamily="Inter,sans-serif">
            {curMonthName}
          </text>

          {/* Status label */}
          <text x={CX} y={CX + 10} textAnchor="middle"
            fill={color.stroke} fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">
            {color.label}
          </text>

          {/* Amount */}
          <text x={CX} y={CX + 30} textAnchor="middle"
            fill="#94a3b8" fontSize="11" fontFamily="Inter,sans-serif">
            {cur > 0 ? `₹${cur >= 100000 ? (cur/100000).toFixed(1)+'L' : cur >= 1000 ? (cur/1000).toFixed(1)+'k' : cur}` : 'No deals'}
          </text>
        </svg>
      </div>

      {/* 3-month breakdown row */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {months.map((mo, i) => {
          const val = totals[i];
          const isActive = i === 0;
          return (
            <div key={mo.m} className={`rounded-xl p-2.5 text-center border
              ${isActive ? 'bg-[#0F172A] border-white/10' : 'bg-[#0F172A]/50 border-white/5'}`}>
              <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{mo.short}</p>
              <p className={`text-xs mt-0.5 font-semibold ${isActive ? 'text-orange-400' : 'text-slate-600'}`}>
                {val > 0 ? `₹${val >= 1000 ? (val/1000).toFixed(1)+'k' : val}` : '—'}
              </p>
            </div>
          );
        })}
      </div>

      {/* vs last month */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-500">vs last month ({months[1].short})</span>
        <span className={`font-bold ${trendUp ? 'text-green-400' : trendPct !== null ? 'text-red-400' : 'text-slate-500'}`}>
          {trendPct !== null ? `${trendUp ? '+' : ''}${trendPct}%` : '— no data'}
        </span>
      </div>
    </div>
  );
}
