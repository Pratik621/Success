// Badge — status indicator
export function Badge({ status }) {
  const map = {
    Pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Accepted:  'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Completed: 'bg-green-500/15 text-green-400 border-green-500/20',
    Rejected:  'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
      {status}
    </span>
  );
}

// Card wrapper
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#1E293B] rounded-2xl border border-white/5 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

// Section with title
export function Section({ title, icon, children, className = '' }) {
  return (
    <section className={`mb-6 sm:mb-8 ${className}`}>
      {title && (
        <h2 className="section-title">
          {icon && <span className="text-orange-500">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// Primary button
export function BtnPrimary({ children, className = '', ...props }) {
  return (
    <button className={`btn-primary ${className}`} {...props}>
      {children}
    </button>
  );
}

// Secondary button
export function BtnSecondary({ children, className = '', ...props }) {
  return (
    <button className={`btn-secondary ${className}`} {...props}>
      {children}
    </button>
  );
}

// Form input
export function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="label-dark">{label}</label>}
      <input className="input-dark" {...props} />
    </div>
  );
}

// Form select
export function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="label-dark">{label}</label>}
      <div className="relative">
        <select className="select-dark" {...props}>
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
      </div>
    </div>
  );
}

// Stat card (for dashboard metrics)
export function StatCard({ icon, label, value, sub, color = 'text-orange-400' }) {
  return (
    <div className="card-p flex items-center gap-4">
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon = '📭', message }) {
  return (
    <div className="text-center py-16 text-slate-500">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
