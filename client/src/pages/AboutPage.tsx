import React from 'react';
import { Info, AlertTriangle, Shield, CheckCircle, Code, Cpu, Award, Target, Sparkles } from 'lucide-react';
import { Card, Alert, Badge } from '../components/UI';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0e1422] p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-card ring-1 ring-black/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-3">
              <Award className="w-3.5 h-3.5" /> HerHackathon 2026 Solution
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-teal-700" /> Problem Statement & Architecture
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Bridging digital harassment threat defense and physical transit safety with transparent, local-first intelligence.
            </p>
          </div>
          <div className="shrink-0 flex sm:flex-col gap-2">
            <Badge variant="teal">AI & Social Impact</Badge>
            <Badge variant="amber">Student Innovation</Badge>
          </div>
        </div>
      </div>

      {/* Alignment with Hackathon Evaluation Criteria */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg font-bold text-stone-900">Hackathon Evaluation Alignment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">1. Innovation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Eliminates dependence on privacy-invasive cloud LLM APIs. Uses an offline deterministic NLP token classifier to inspect sensitive messages locally without telemetry.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">2. Technical Implementation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Full-stack TypeScript architecture (React + Vite + Express + SQLite). Cryptographic SHA-256 session tokens, client-side Leaflet mapping, and legal PDF compilation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">3. Problem Relevance & Impact</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Directly addresses women's night commute insecurity, extortion blackmail, cyberstalking, and student campus transit risks.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">4. Usability & Quality</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Accessible responsive layout, instant quick-dial emergency actions, high-contrast readability, and zero mandatory account creation barriers.
            </p>
          </div>
        </div>
      </Card>

      {/* Product Mission */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Product Mission & Core Philosophy</h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          ShieldSafe is an autonomous personal safety and digital defense web platform created to bridge
          the gap between digital harassment documentation and real-world physical transit risks.
          It gives users agency, tools for objective evidence preservation, and verified check-in channels with trusted contacts — without charging subscriptions or selling location data.
        </p>
      </Card>

      {/* Limitations Notice */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Honest System Boundaries
        </h2>
        <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-stone-900">• Not an Emergency Police Dispatcher:</span>
            <span>
              ShieldSafe is an informational and documentation utility. In an active emergency involving physical danger,
              always contact your official local emergency services (112 in India/Europe, 911 in North America) immediately.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-stone-900">• Zero Unethical Predictive Policing:</span>
            <span>
              We reject black-box predictive policing algorithms that claim to forecast crime rates.
              All digital harassment checks are rule-based, objective linguistic evaluations.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-stone-900">• Community Verified Crowdsourcing:</span>
            <span>
              Streetlights, stray dog sightings, and road closure markers are submitted by other commuters.
              Community confirmations help validate conditions, but hazards change rapidly in real-world scenarios.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-stone-900">• Court-Ready Personal Documentation:</span>
            <span>
              Exported PDF summaries are timestamped personal records designed to help you communicate clearly with
              attorneys, counsellors, or police officers. They do not constitute official certified police FIR documents.
            </span>
          </li>
        </ul>
      </Card>

      {/* Tech Stack Breakdown */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-teal-700" /> Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Frontend</span>
            <span className="text-stone-500">React 18 + Vite + Tailwind CSS</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Backend</span>
            <span className="text-stone-500">Node.js + Express + TypeScript</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Database</span>
            <span className="text-stone-500">SQLite (Better-SQLite3)</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Mapping</span>
            <span className="text-stone-500">Leaflet & OpenStreetMap</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Document Engine</span>
            <span className="text-stone-500">jsPDF Evidence Exporter</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Privacy</span>
            <span className="text-stone-500">Zero Cloud AI Exfiltration</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

