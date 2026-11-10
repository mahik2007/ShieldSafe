import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
  Radar,
  ShieldCheck,
  CheckCircle,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/UI';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SHEcurity protect my privacy compared to commercial safety apps?',
      a: 'Unlike traditional trackers that continuously stream your GPS location to commercial cloud servers and sell behavioral telemetry, SHEcurity operates on a local-first SQLite architecture. Your harassment message scans run on deterministic edge rules without calling public AI APIs, and Journey Guardian links are cryptographically tokenized and expire automatically.',
    },
    {
      q: 'Does the Harassment Defender send my personal chats or messages to any third-party AI?',
      a: 'Never. Our harassment detection engine runs completely deterministic, local regular expression and heuristic rules directly on your machine. No text excerpts, images, or chat logs are ever shared with third-party language models or commercial analytics vendors.',
    },
    {
      q: 'How does the Journey Guardian live tracking work?',
      a: 'When you start a commute or cab ride, you configure an expected arrival timer and select your destination. A secure, time-bounded public URL is generated that you can share with your trusted contacts. If you do not check in before the timer expires, the dashboard prompts rapid escalation with one-click SOS notifications.',
    },
    {
      q: 'Can incident evidence exported from SHEcurity be used in legal or disciplinary reports?',
      a: 'Yes. The Incident Evidence Vault organizes dates, timestamps, communication excerpts, location logs, and chronological notes into court-ready structured exports with cryptographic SHA-256 tamper-evident integrity hashes.',
    },
    {
      q: 'Are community hazard reports verified before appearing on the map?',
      a: 'Yes. Community hazard reports (such as broken streetlights, deserted poorly-lit alleys, or construction roadblocks) require threshold confirmations from nearby users before receiving verified status, preventing spam while keeping neighborhood commuters informed.',
    },
  ];
  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col font-sans selection:bg-[#00E5BE] selection:text-[#070a12]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#090d18]/95 backdrop-blur-md border-b border-stone-800/90 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size="md" showText={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight leading-none">
                  Shield<span className="text-[#00E5BE]">Safe</span>
                </span>
                <span className="text-[10px] text-stone-400 font-medium tracking-wide">Personal Protection & Evidence Platform</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/about" className="text-xs sm:text-sm font-medium text-stone-300 hover:text-white hidden sm:inline-block transition-colors">
              Problem & Architecture
            </Link>
            <Link to="/privacy" className="text-xs sm:text-sm font-medium text-stone-300 hover:text-white hidden sm:inline-block transition-colors">
              Privacy First
            </Link>
            <Link to="/login">
              <Button size="sm" variant="outline" className="text-xs font-semibold">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary" className="text-xs font-bold shadow-md shadow-teal-500/20">
                Create Account →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Ambient Interactive Animation */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-44 bg-[#070a12] text-white">
        {/* Dynamic Multi-layered Ambient Glows in Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09101d] via-[#070a12] to-[#070a12]" />
        
        {/* Animated glowing orbs matching new teal & amber accents */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00E5BE]/15 rounded-full blur-[140px] pointer-events-none animate-glow-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-950/400/10 rounded-full blur-[140px] pointer-events-none animate-glow-2" />
        
        {/* Subtle geometric grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #ffffff 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Platform banner badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1c2b] border border-teal-500/40 text-[#00E5BE] text-xs font-bold mb-8 backdrop-blur-md shadow-lg shadow-teal-950/50 animate-float-badge">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span>AI & Digital Protection: Local-First Safety Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Autonomous Safety. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5BE] via-teal-200 to-amber-300">
              Zero Cloud Surveillance.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Engineered for real-world women's commute protection, automated digital harassment threat detection,
            and offline-first cryptographic evidence preservation. Powered by deterministic intelligence that protects your privacy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 text-base px-9 py-4 font-bold shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-transform">
                Create Account & Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4 bg-[#0d1424] border-stone-700 text-white hover:bg-[#131d33] hover:border-teal-400/50">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>

          {/* Real-world Evaluation Criteria Match */}
          <div className="mt-16 pt-8 border-t border-stone-800 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300 font-medium">
            <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1424] border border-stone-800 shadow-md">
              <Cpu className="w-5 h-5 text-[#00E5BE] mb-1.5" />
              <span className="font-bold text-white">Edge AI Rules Engine</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Deterministic NLP detection</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1424] border border-stone-800 shadow-md">
              <Server className="w-5 h-5 text-[#00E5BE] mb-1.5" />
              <span className="font-bold text-white">Local-First SQLite</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Zero data leaks or telemetry</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1424] border border-stone-800 shadow-md">
              <Lock className="w-5 h-5 text-[#00E5BE] mb-1.5" />
              <span className="font-bold text-white">Court-Ready PDF Vault</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Cryptographic incident logs</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1424] border border-stone-800 shadow-md">
              <Radar className="w-5 h-5 text-[#00E5BE] mb-1.5" />
              <span className="font-bold text-white">Crowd Hazard Alerts</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Community verified safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement & Innovation Match Section */}
      <section className="py-20 bg-[#090e1a] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 text-[#00E5BE] text-xs font-bold border border-teal-500/40">
                <HeartHandshake className="w-3.5 h-3.5" /> Problem Relevance & Social Impact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Why Standard Safety Apps Fail in High-Stakes Situations
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                Most commercial tools force users onto battery-draining continuous GPS trackers, send intimate harassment evidence to third-party cloud servers, and rely on unpredictable cloud generative AI.
              </p>
              <div className="pt-2 space-y-3 text-xs sm:text-sm text-stone-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Women's Commute:</strong> Real-time dark streetlights, transit stalls, and harassment alerts.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Digital Blackmail:</strong> Instant local detection of sextortion, coercion, and stalking threats.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Student & Teen Safety:</strong> Non-invasive safe arrival timers without surveillance.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0d1424] p-6 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-800/80 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-white text-base">The Real Threat</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Victims of digital harassment and unsafe commutes rarely preserve timely, structured evidence before messages are deleted.
                </p>
              </div>

              <div className="bg-[#0d1424] p-6 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-950/50 text-[#00E5BE] border border-teal-500/50 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-white text-base">The AI Innovation</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Deterministic token classification and NLP patterns evaluate threat severity in microseconds locally without external API latency or leakage.
                </p>
              </div>

              <div className="bg-[#0d1424] p-6 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/50 text-amber-300 border border-amber-800/80 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-white text-base">Community Scalability</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Decentralized hazard reports allow students and neighbors to crowdsource broken infrastructure and dog pack sightings.
                </p>
              </div>

              <div className="bg-[#0d1424] p-6 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/50 text-blue-300 border border-blue-800/80 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-white text-base">Legal Readiness</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Generates clean, timestamped PDF legal summaries ready for submission to campus authorities or national helplines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-24 bg-[#070a12] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-950/80 text-[#00E5BE] text-xs font-bold border border-teal-500/40">
              Full Suite Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Six Comprehensive Protection Modules
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Every tool operates deterministically with transparent data handling and zero black-box AI claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Map */}
            <div className="bg-[#0d1424] rounded-2xl border border-stone-800 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111e30] border border-teal-500/30 flex items-center justify-center text-[#00E5BE] mb-5 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Local Safety Map</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Interactive Leaflet & OpenStreetMap platform for reporting broken streetlights, road hazards,
                  pack dog sightings, and unlit alleys with community upvoting.
                </p>
              </div>
              <Link to="/map" className="text-sm font-bold text-[#00E5BE] hover:text-teal-300 flex items-center gap-1 transition-colors">
                Explore live map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Analyzer */}
            <div className="bg-[#0d1424] rounded-2xl border border-stone-800 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1d1610] border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Harassment & Scam Defender</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Deterministic NLP analyzer identifying coercion, intimate blackmail threats,
                  phishing scams, and stalking without exposing your text to cloud providers.
                </p>
              </div>
              <Link to="/analyze" className="text-sm font-bold text-[#00E5BE] hover:text-teal-300 flex items-center gap-1 transition-colors">
                Test message analyzer <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Journey Guardian */}
            <div className="bg-[#0d1424] rounded-2xl border border-stone-800 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#10192e] border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Journey Guardian</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Active transit session monitor with check-in timers, overdue SMS warnings, and revocable
                  cryptographic share links that guardians can view without installing an app.
                </p>
              </div>
              <Link to="/journey" className="text-sm font-bold text-[#00E5BE] hover:text-teal-300 flex items-center gap-1 transition-colors">
                Setup journey session <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Incident Vault */}
            <div className="bg-[#0d1424] rounded-2xl border border-stone-800 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0e1d1b] border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Incident Evidence Vault</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Preserve chronological incident records, witness contact logs, and legal timelines.
                  Export instantly to structured, tamper-resistant PDF documents.
                </p>
              </div>
              <Link to="/incidents" className="text-sm font-bold text-[#00E5BE] hover:text-teal-300 flex items-center gap-1 transition-colors">
                Open incident manager <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 5: Action Checklist */}
            <div className="bg-[#0d1424] rounded-2xl border border-stone-800 p-6 card-hover group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-stone-200 mb-5 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tailored Action Checklist</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Dynamic actionable checklist tailored to your safety profile: digital footprint cleanups,
                  cab ride verification protocols, and emergency quick-dials.
                </p>
              </div>
              <Link to="/safety-plan" className="text-sm font-bold text-[#00E5BE] hover:text-teal-300 flex items-center gap-1 transition-colors">
                View safety checklist <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 6: Profile Mode Highlight */}
            <div className="bg-gradient-to-br from-[#0c1a2e] to-[#081220] text-white rounded-2xl border border-teal-500/40 p-6 card-hover flex flex-col justify-between shadow-lg shadow-teal-950/40">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-[#00E5BE] mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">3 Specialized Profiles</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Switch on the fly between <strong className="text-white">Everyday Safety</strong>, <strong className="text-white">Women's Night Commute</strong>,
                  or <strong className="text-white">Child & Teen Guardian</strong> rulesets.
                </p>
              </div>
              <Link to="/onboarding" className="text-sm font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors">
                Select your safety profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="py-20 bg-[#090e1a] border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 text-[#00E5BE] text-xs font-bold border border-teal-500/40 mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="mt-3 text-stone-300 text-sm max-w-xl mx-auto">
              How SHEcurity ensures absolute offline-first privacy, robust evidence verification, and community resilience.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-800 bg-[#0d1424] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#121c32] transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base pr-2">
                      {faq.q}
                    </span>
                    <span className={`p-1.5 rounded-lg bg-[#15223c] text-[#00E5BE] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-stone-800/60 bg-[#0b111f]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Honest Boundary Notice */}
      <section className="py-16 bg-[#080d1a] border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 text-xs font-bold border border-amber-800">
            Transparent Safety Notice
          </div>
          <h3 className="text-2xl font-bold text-white">Important System Boundaries</h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl mx-auto">
            ShieldSafe is an informational and documentation assistant. It does not replace emergency police services (112 / 911),
            does not guarantee physical safety, and avoids pseudo-scientific predictive policing claims. All hazard reports are community-submitted
            and must be evaluated with personal caution.
          </p>
          <div className="pt-2">
            <Link to="/about">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Read Full System Disclaimers & Technical Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Architectural Banner (HERHACK Styled Big Typography) */}
      <footer className="relative bg-[#05070d] border-t border-stone-800/80 pt-10 pb-6 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top metadata credits matching reference banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-stone-400 pb-8 border-b border-stone-800/50">
            <div className="flex items-center gap-2">
              <span>&copy; 2026 HERHACK. ALL RIGHTS RESERVED.</span>
            </div>
            <div className="text-stone-400 text-center sm:text-right">
              Echelon Institute of Technology + IEEE Echelon Student Branch.
            </div>
          </div>

          {/* Huge Outline Typography Banner */}
          <div className="relative py-6 sm:py-10 flex justify-center items-center overflow-hidden">
            <h1 className="text-stroke-outline text-6xl sm:text-8xl md:text-9xl lg:text-[14rem] font-black tracking-tighter leading-none pointer-events-none">
              HERHACK
            </h1>

            {/* Glowing Accent Dots matching the reference screenshot */}
            <div className="absolute left-[8%] top-[45%] w-2 h-2 rounded-full bg-rose-500/60 blur-[1px] animate-pulse" />
            <div className="absolute left-[38%] top-[30%] w-2.5 h-2.5 rounded-full bg-[#00E5BE]/70 blur-[1px] animate-pulse" />
            <div className="absolute right-[32%] top-[65%] w-2 h-2 rounded-full bg-amber-400/60 blur-[1px] animate-pulse" />
            <div className="absolute right-[18%] top-[25%] w-2.5 h-2.5 rounded-full bg-violet-400/60 blur-[1px] animate-pulse" />
          </div>

          {/* Sub navigation links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-stone-400 border-t border-stone-800/40">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SHEcurity</span>
              <span className="text-stone-700">•</span>
              <span>ShieldSafe Autonomous Protection Platform</span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/about" className="hover:text-[#00E5BE] transition-colors">About & Architecture</Link>
              <Link to="/privacy" className="hover:text-[#00E5BE] transition-colors">Privacy First</Link>
              <Link to="/register" className="text-[#00E5BE] hover:underline font-bold">Get Started →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

