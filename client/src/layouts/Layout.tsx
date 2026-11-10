import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  MapPin,
  MessageSquareWarning,
  FileText,
  Navigation,
  CheckSquare,
  Info,
  Lock,
  Menu,
  X,
  UserCheck,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useSafetyMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Shield, badge: 'Live' },
    { label: 'Safety Map', path: '/map', icon: MapPin },
    { label: 'Harassment Defender', path: '/analyze', icon: MessageSquareWarning },
    { label: 'Incident Manager', path: '/incidents', icon: FileText },
    { label: 'Journey Guardian', path: '/journey', icon: Navigation },
    { label: 'Safety Checklist', path: '/safety-plan', icon: CheckSquare },
  ];

  const modeLabels = {
    everyday: 'Everyday Safety',
    womens: "Women's Safety",
    'child-teen': 'Child & Teen Safety',
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex flex-col font-sans antialiased text-stone-100 selection:bg-[#00E5BE] selection:text-[#070a12]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#090d18]/95 backdrop-blur-md border-b border-stone-800 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <Logo size="md" showText={false} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-white tracking-tight leading-none">
                    Shield<span className="text-[#00E5BE]">Safe</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950/80 text-[#00E5BE] border border-teal-500/40">
                    Live Security
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 hidden sm:block tracking-tight">AI Autonomous Protection & Evidence Platform</span>
              </div>
            </Link>
          </div>

          {/* Desktop Actions & Safety Mode Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Safety Profile Switcher */}
            <div className="flex items-center gap-2 bg-[#0e1626] px-3.5 py-1.5 rounded-xl border border-stone-700/80 text-xs text-stone-200 font-medium shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-[#00E5BE] shrink-0" />
              <span className="text-stone-400">Profile:</span>
              <select
                aria-label="Current Safety Profile Mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="bg-transparent font-bold text-[#00E5BE] focus:outline-none cursor-pointer pr-1"
              >
                <option value="everyday" className="bg-[#0e1626] text-white">Everyday Safety</option>
                <option value="womens" className="bg-[#0e1626] text-white">Women's Safety</option>
                <option value="child-teen" className="bg-[#0e1626] text-white">Child & Teen Safety</option>
              </select>
            </div>

            <Link
              to="/privacy"
              className="p-2 text-stone-300 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              title="Privacy & Data Transparency"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="p-2 text-stone-300 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              title="About ShieldSafe & Problem Statement"
            >
              <Info className="w-4 h-4" />
            </Link>

            {/* User Session & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <span className="text-xs font-semibold text-stone-300 max-w-[120px] truncate" title={user?.name || user?.email}>
                {user?.name || 'User'}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-stone-400 hover:text-rose-400 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-1 bg-[#0d1424] p-3.5 rounded-2xl border border-stone-800/90 shadow-lg shadow-black/40 ring-1 ring-white/5">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1 flex items-center justify-between">
              <span>Platform Modules</span>
              <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" title="System Operational" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isItemActive
                      ? 'bg-[#00E5BE] text-[#070a12] font-bold shadow-md shadow-teal-500/20'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isItemActive
                          ? 'bg-[#070a12] text-[#00E5BE]'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Profile Mode Status Card */}
            <div className="pt-4 border-t border-stone-800 px-2 space-y-2.5 mt-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-medium">Active Safety Profile:</span>
              </div>
              <div className="text-xs font-semibold text-teal-200 bg-[#0c1a26] p-3 rounded-xl border border-teal-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{modeLabels[mode]}</div>
                  <div className="text-[10px] text-teal-400 font-normal mt-0.5">Real-time localized ruleset</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#00E5BE]" />
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full text-left text-xs font-medium text-stone-400 hover:text-[#00E5BE] py-1 transition-colors flex items-center justify-between"
              >
                <span>Switch Safety Profile</span>
                <span className="text-[11px] text-[#00E5BE]">Edit →</span>
              </button>
            </div>

            {/* Platform Trust Tag */}
            <div className="pt-3 border-t border-stone-800 px-2">
              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-200 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>Privacy Architecture</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-teal-500/20 text-[#00E5BE] rounded font-bold">Local-First</span>
                </div>
                <p className="text-[10px] text-stone-300 leading-tight">
                  Tackling real-world women's & student safety with an offline-first deterministic ML engine.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
            <div className="bg-[#0d1424] rounded-t-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border-t border-stone-700">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <span className="font-bold text-white text-base">ShieldSafe Navigation</span>
                  <p className="text-xs text-stone-400">Autonomous Safety & Digital Protection</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Safety Mode select on mobile */}
              <div className="bg-[#090d18] p-3 rounded-xl border border-stone-800 space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 block">Select Active Safety Mode:</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full bg-[#111c2e] border border-stone-700 rounded-lg p-2 text-xs font-bold text-[#00E5BE]"
                >
                  <option value="everyday">Everyday Safety</option>
                  <option value="womens">Women's Safety</option>
                  <option value="child-teen">Child & Teen Safety</option>
                </select>
              </div>

              <div className="space-y-1 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isItemActive
                          ? 'bg-[#00E5BE] text-[#070a12] font-bold shadow-md'
                          : 'text-stone-300 hover:bg-stone-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isItemActive
                              ? 'bg-[#070a12] text-[#00E5BE]'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
                <Link
                  to="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-stone-300 py-2 flex items-center gap-2 hover:text-[#00E5BE]"
                >
                  <Lock className="w-4 h-4" /> Privacy & Local-First Data Handling
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-stone-300 py-2 flex items-center gap-2 hover:text-[#00E5BE]"
                >
                  <Info className="w-4 h-4" /> About Problem Statement & Architecture
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 min-w-0 pb-12">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-[#050810] border-t border-stone-800/80 py-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-mono text-[11px] text-stone-300 uppercase tracking-wider">&copy; 2026 SHIELDSAFE. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline text-stone-700">•</span>
            <span>Local-first AI & Community Safety Platform. Zero cloud surveillance.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-[#00E5BE] transition-colors font-medium">Privacy Architecture</Link>
            <span className="text-stone-700">•</span>
            <Link to="/about" className="hover:text-[#00E5BE] transition-colors font-medium">System Disclaimers</Link>
            <span className="text-stone-700">•</span>
            <Link to="/dashboard" className="text-[#00E5BE] hover:text-teal-300 font-bold flex items-center gap-1">
              Launch App <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
