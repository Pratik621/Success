import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX, FiHome, FiPackage, FiList } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: <FiHome /> },
    { to: '/book-deal', label: 'Book Deal', icon: <FiPackage /> },
    { to: '/my-deals', label: 'My Deals', icon: <FiList /> },
  ];

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-lg sm:text-xl font-bold text-orange-400 flex items-center gap-2">
          ⚙️ <span>ScrapMetal Pro</span>
        </Link>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-1 hover:text-orange-400 transition ${location.pathname === l.to ? 'text-orange-400' : ''}`}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-700 border-t border-slate-600 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition
                ${location.pathname === l.to ? 'bg-slate-600 text-orange-400' : 'hover:bg-slate-600'}`}>
              <span className="text-orange-400">{l.icon}</span> {l.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-600 transition mt-1">
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
