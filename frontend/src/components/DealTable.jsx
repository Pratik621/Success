import { Badge, EmptyState } from './UI';

export default function DealTable({ deals, emptyIcon, emptyMsg, renderActions, isAdmin }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Company', ...(isAdmin ? ['Phone', 'Address'] : []), 'Metal', 'Weight', 'Rate', 'Total', 'Date', ...(renderActions ? ['Actions'] : [])].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {deals.map((d) => (
              <tr key={d._id} className="hover:bg-white/2 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                      {d.companyName[0]}
                    </div>
                    <span className="font-medium text-white truncate max-w-[120px]">{d.companyName}</span>
                  </div>
                </td>
                {isAdmin && (
                  <>
                    <td className="px-5 py-4 text-slate-300 text-xs">{d.phone || '—'}</td>
                    <td className="px-5 py-4 text-slate-300 text-xs max-w-[140px] truncate">{d.companyAddress || '—'}</td>
                  </>
                )}
                <td className="px-5 py-4 text-slate-300">{d.metalType}</td>
                <td className="px-5 py-4 text-slate-300">{d.weight} {d.weightUnit}</td>
                <td className="px-5 py-4 text-slate-300">₹{d.rate}</td>
                <td className="px-5 py-4 font-bold text-white">₹{d.totalAmount.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                {renderActions && <td className="px-5 py-4">{renderActions(d)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {deals.map((d) => (
          <div key={d._id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                  {d.companyName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm truncate max-w-[160px]">{d.companyName}</p>
                  <p className="text-slate-500 text-xs">{d.metalType}</p>
                </div>
              </div>
              <Badge status={d.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Weight', value: `${d.weight} ${d.weightUnit}` },
                { label: 'Rate',   value: `₹${d.rate}/kg` },
                { label: 'Total',  value: `₹${d.totalAmount.toLocaleString()}`, bold: true },
                { label: 'Date',   value: new Date(d.createdAt).toLocaleDateString() },
                ...(isAdmin ? [
                  { label: 'Phone',   value: d.phone || '—' },
                  { label: 'Address', value: d.companyAddress || '—' },
                ] : []),
              ].map(({ label, value, bold }) => (
                <div key={label} className="bg-[#0F172A] rounded-xl p-2.5">
                  <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                  <p className={`text-sm ${bold ? 'font-bold text-orange-400' : 'text-white'}`}>{value}</p>
                </div>
              ))}
            </div>
            {renderActions && <div className="flex gap-2">{renderActions(d)}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
