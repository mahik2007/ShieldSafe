import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useSafetyMode();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-stone-50 dark:bg-[#070a12] flex flex-col font-sans antialiased text-stone-900 dark:text-stone-100 selection:bg-teal-700 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/80 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <Logo size="md" showText={false} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-stone-900 dark:text-white tracking-tight leading-none">
                    Shield<span className="text-teal-600 dark:text-teal-400">Safe</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60">
                    HerHackathon
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block tracking-tight">AI & Social Impact Autonomous Protection</span>
              </div>
            </Link>
          </div>

          {/* Desktop Actions & Safety Mode Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Safety Profile Switcher */}
            <div className="flex items-center gap-2 bg-stone-100/90 dark:bg-[#111827] px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-medium transition-colors shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="text-stone-500 dark:text-stone-400">Profile:</span>
              <select
                aria-label="Current Safety Profile Mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="bg-transparent font-semibold text-teal-800 dark:text-teal-300 focus:outline-none cursor-pointer pr-1"
              >
                <option value="everyday" className="dark:bg-[#111827] dark:text-stone-200">Everyday Safety</option>
                <option value="womens" className="dark:bg-[#111827] dark:text-stone-200">Women's Safety</option>
                <option value="child-teen" className="dark:bg-[#111827] dark:text-stone-200">Child & Teen Safety</option>
              </select>
            </div>

            <Link
              to="/privacy"
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors"
              title="Privacy & Data Transparency"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors"
              title="About ShieldSafe & Problem Statement"
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none"
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
          <div className="sticky top-24 space-y-1 bg-white dark:bg-[#0c1220] p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800/90 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-200">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1 flex items-center justify-between">
              <span>Platform Modules</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/30 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Profile Mode Status Card */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 px-2 space-y-2.5 mt-3">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium">Active Safety Profile:</span>
              </div>
              <div className="text-xs font-semibold text-teal-900 dark:text-teal-200 bg-teal-50/90 dark:bg-teal-950/50 p-3 rounded-xl border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-between">
                <div>
                  <div className="font-bold">{modeLabels[mode]}</div>
                  <div className="text-[10px] text-teal-700 dark:text-teal-400 font-normal mt-0.5">Real-time localized ruleset</div>
                </div>
                <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full text-left text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-teal-700 dark:hover:text-teal-300 py-1 transition-colors flex items-center justify-between"
              >
                <span>Switch Safety Profile</span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400">Edit →</span>
              </button>
            </div>

            {/* Hackathon Track Tag */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 px-2">
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>Hackathon Tracks</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-amber-200/70 dark:bg-amber-900/60 rounded font-semibold text-amber-950 dark:text-amber-200">AI & Impact</span>
                </div>
                <p className="text-[10px] text-amber-800 dark:text-amber-300/80 leading-tight">
                  Tackling real-world women's & student safety with offline-first deterministic ML engine.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-stone-900/60 dark:bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
            <div className="bg-white dark:bg-[#0c1220] rounded-t-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white text-base">ShieldSafe Navigation</span>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Autonomous Safety & Digital Protection</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Safety Mode select on mobile */}
              <div className="bg-stone-50 dark:bg-[#111827] p-3 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block">Select Active Safety Mode:</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0a0f1d] border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold text-teal-800 dark:text-teal-300"
                >
                  <option value="everyday">Everyday Safety</option>
                  <option value="womens">Women's Safety</option>
                  <option value="child-teen">Child & Teen Safety</option>
                </select>
              </div>

              <div className="space-y-1 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-teal-700 text-white shadow-sm font-semibold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
                <Link
                  to="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-stone-600 dark:text-stone-400 py-2 flex items-center gap-2 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <Lock className="w-4 h-4" /> Privacy & Local-First Data Handling
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-stone-600 dark:text-stone-400 py-2 flex items-center gap-2 hover:text-teal-700 dark:hover:text-teal-300"
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
      <footer className="mt-auto bg-white dark:bg-[#090e1a] border-t border-stone-200 dark:border-stone-800/80 py-8 text-xs text-stone-500 dark:text-stone-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-bold text-stone-800 dark:text-stone-200">ShieldSafe</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
            <span>Local-first AI & Community Safety Platform. Zero paid API lock-in, zero cloud surveillance.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium">Privacy Architecture</Link>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <Link to="/about" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium">System Disclaimers</Link>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <Link to="/dashboard" className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 font-semibold flex items-center gap-1">
              Launch App <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
