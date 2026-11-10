import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  MessageSquareWarning,
  FileText,
  Navigation,
  CheckCircle2,
  Lock,
  ArrowRight,
  EyeOff,
  Server,
  HeartHandshake,
  Cpu,
  Globe2,
  Users2,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Radar,
  Activity,
  Flame,
} from 'lucide-react';
import { Button } from '../components/UI';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#070a12] flex flex-col font-sans selection:bg-teal-700 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size="md" showText={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-stone-900 dark:text-white tracking-tight leading-none">
                  Shield<span className="text-teal-600 dark:text-teal-400">Safe</span>
                </span>
                <span className="text-[10px] text-stone-400 font-medium tracking-wide">Personal Protection & Evidence Platform</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/about" className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hidden sm:inline-block transition-colors">
              Problem & Architecture
            </Link>
            <Link to="/privacy" className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hidden sm:inline-block transition-colors">
              Privacy First
            </Link>
            <ThemeToggle />
            <Link to="/dashboard">
              <Button size="sm" variant="outline" className="text-xs">Dashboard</Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm" variant="gold" className="text-xs font-semibold shadow-sm shadow-amber-900/10">
                Launch App →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Ambient Interactive Animation */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-44 bg-stone-950 text-white">
        {/* Dynamic Multi-layered Ambient Glows in Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-stone-950 to-stone-900" />
        
        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none animate-glow-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none animate-glow-2" />
        
        {/* Subtle geometric grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #ffffff 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Hackathon problem badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-900/60 border border-teal-700/60 text-teal-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg animate-float-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HerHackathon 2026: AI & Social Impact Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Autonomous Safety. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-100 to-amber-300">
              Zero Cloud Surveillance.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-light">
            Engineered for real-world women's commute protection, automated digital harassment threat detection,
            and offline-first cryptographic evidence preservation. Powered by deterministic intelligence that protects your privacy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" variant="gold" className="w-full sm:w-auto gap-2 text-base px-9 py-4 font-bold shadow-xl shadow-amber-900/40 hover:scale-[1.02] transition-transform">
                Start Safe Journey <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Real-world Evaluation Criteria Match */}
          <div className="mt-16 pt-8 border-t border-white/10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300 font-medium">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Cpu className="w-5 h-5 text-teal-400 mb-1.5" />
              <span className="font-semibold text-white">Edge AI Rules Engine</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Deterministic NLP detection</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Server className="w-5 h-5 text-teal-400 mb-1.5" />
              <span className="font-semibold text-white">Local-First SQLite</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Zero data leaks or telemetry</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Lock className="w-5 h-5 text-teal-400 mb-1.5" />
              <span className="font-semibold text-white">Court-Ready PDF Vault</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Cryptographic incident logs</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10">
              <Radar className="w-5 h-5 text-teal-400 mb-1.5" />
              <span className="font-semibold text-white">Crowd Hazard Alerts</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Community verified safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement & Innovation Match Section */}
      <section className="py-20 bg-stone-100/60 dark:bg-[#0a0f1d] border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-850">
                <HeartHandshake className="w-3.5 h-3.5" /> Problem Relevance & Social Impact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-snug">
                Why Standard Safety Apps Fail in High-Stakes Situations
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                Most commercial tools force users onto battery-draining continuous GPS trackers, send intimate harassment evidence to third-party cloud servers, and rely on unpredictable cloud generative AI.
              </p>
              <div className="pt-2 space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Women's Commute:</strong> Real-time dark streetlights, transit stalls, and harassment alerts.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Blackmail:</strong> Instant local detection of sextortion, coercion, and stalking threats.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Student & Teen Safety:</strong> Non-invasive safe arrival timers without surveillance.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-base">The Real Threat</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Victims of digital harassment and unsafe commutes rarely preserve timely, structured evidence before messages are deleted.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-base">The AI Innovation</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Deterministic token classification and NLP patterns evaluate threat severity in microseconds locally without external API latency or leakage.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-base">Community Scalability</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Decentralized hazard reports allow students and neighbors to crowdsource broken infrastructure and dog pack sightings.
                </p>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-base">Legal Readiness</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Generates clean, timestamped PDF legal summaries ready for submission to campus authorities or national helplines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-24 bg-white dark:bg-[#070a12] border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
              Full Suite Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Six Comprehensive Protection Modules
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
              Every tool operates deterministically with transparent data handling and zero black-box AI claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Map */}
            <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-400 mb-5 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/60 transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Local Safety Map</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Interactive Leaflet & OpenStreetMap platform for reporting broken streetlights, road hazards,
                  pack dog sightings, and unlit alleys with community upvoting.
                </p>
              </div>
              <Link to="/map" className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                Explore live map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Analyzer */}
            <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-5 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 transition-colors">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Harassment & Scam Defender</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Deterministic NLP analyzer identifying coercion, intimate blackmail threats,
                  phishing scams, and stalking without exposing your text to cloud providers.
                </p>
              </div>
              <Link to="/analyze" className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                Test message analyzer <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Journey Guardian */}
            <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-5 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition-colors">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Journey Guardian</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Active transit session monitor with check-in timers, overdue SMS warnings, and revocable
                  cryptographic share links that guardians can view without installing an app.
                </p>
              </div>
              <Link to="/journey" className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                Setup journey session <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Incident Vault */}
            <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Incident Evidence Vault</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Preserve chronological incident records, witness contact logs, and legal timelines.
                  Export instantly to structured, tamper-resistant PDF documents.
                </p>
              </div>
              <Link to="/incidents" className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                Open incident manager <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 5: Action Checklist */}
            <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card dark:shadow-card-dark ring-1 ring-black/5 dark:ring-white/5 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 mb-5 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Tailored Action Checklist</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Dynamic actionable checklist tailored to your safety profile: digital footprint cleanups,
                  cab ride verification protocols, and emergency quick-dials.
                </p>
              </div>
              <Link to="/safety-plan" className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                View safety checklist <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 6: Profile Mode Highlight */}
            <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-stone-950 text-white rounded-2xl border border-teal-800 shadow-brand ring-1 ring-teal-700/30 p-6 card-hover flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">3 Specialized Profiles</h3>
                <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed mb-4">
                  Switch on the fly between <strong>Everyday Safety</strong>, <strong>Women's Night Commute</strong>,
                  or <strong>Child & Teen Guardian</strong> rulesets.
                </p>
              </div>
              <Link to="/onboarding" className="text-sm font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors">
                Select your safety profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Boundary Notice */}
      <section className="py-16 bg-stone-100 dark:bg-[#0a0f1d] border-t border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
            Transparent Safety Notice
          </div>
          <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Important System Boundaries</h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            ShieldSafe is an informational and documentation assistant. It does not replace emergency police services (112 / 911),
            does not guarantee physical safety, and avoids pseudo-scientific predictive policing claims. All hazard reports are community-submitted
            and must be evaluated with personal caution.
          </p>
          <div className="pt-2">
            <Link to="/about">
              <Button variant="outline" size="sm" className="text-xs">
                Read Full System Disclaimers & Technical Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
