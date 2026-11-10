import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  MessageSquareWarning,
  FileText,
  Navigation,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { api } from '../services/api';
import { Hazard, Incident, Journey } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const DashboardPage: React.FC = () => {
  const { mode } = useSafetyMode();
  const [stats, setStats] = useState({
    totalHazards: 0,
    totalIncidents: 0,
    activeJourneys: 0,
    checklistProgress: { completed: 0, total: 0, percentage: 0 },
  });
  const [recentHazards, setRecentHazards] = useState<Hazard[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [statsData, hazardsData, incidentsData, activeJourneyData] = await Promise.all([
          api.getStats().catch(() => ({
            totalHazards: 0,
            totalIncidents: 0,
            activeJourneys: 0,
            checklistProgress: { completed: 0, total: 0, percentage: 0 },
          })),
          api.getHazards().catch(() => ({ hazards: [] })),
          api.getIncidents().catch(() => ({ incidents: [] })),
          api.getActiveJourney().catch(() => ({ journey: null })),
        ]);

        setStats(statsData);
        setRecentHazards((hazardsData.hazards || []).slice(0, 3));
        setRecentIncidents((incidentsData.incidents || []).slice(0, 3));
        setActiveJourney(activeJourneyData.journey);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const modeHeaders = {
    everyday: {
      title: 'Everyday Safety Command',
      desc: 'Balanced commute awareness, transit checking, and proactive digital threat prevention.',
      badge: 'Everyday Profile',
    },
    womens: {
      title: "Women's Safety Command",
      desc: 'Optimized for nighttime commutes, harassment defense, and prioritized route hazards.',
      badge: "Women's Safety Profile",
    },
    'child-teen': {
      title: 'Child & Teen Guardian Command',
      desc: 'Tailored for conservative privacy checks, parental guidance, and youth digital hygiene.',
      badge: 'Child & Teen Profile',
    },
  };

  const currentHeader = modeHeaders[mode] || modeHeaders.everyday;

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-brand relative overflow-hidden ring-1 ring-teal-700/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1424] dark:bg-[#0e1422]/10 text-teal-200 text-xs font-semibold backdrop-blur-sm border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {currentHeader.badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentHeader.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-teal-100/80 leading-relaxed font-light">
            {currentHeader.desc}
          </p>
        </div>
      </div>

      {/* Active Journey Warning Bar (if active) */}
      {activeJourney && (
        <div className="bg-[#1a1508] border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Navigation className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight">Active Journey In Progress</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">
                  Check-in Active
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Travelling to: <span className="font-bold text-[#00E5BE]">{activeJourney.destination}</span>
              </p>
            </div>
          </div>
          <Link to="/journey">
            <Button size="sm" variant="gold" className="font-bold shadow-md shadow-amber-950/50">
              Open Journey Controls →
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/analyze">
          <Card className="hover:border-teal-300 hover:shadow-brand transition-all cursor-pointer h-full flex flex-col justify-between p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-3">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Analyze Message</h3>
              <p className="text-xs text-stone-300 mt-1">Check text for coercion & threats</p>
            </div>
          </Card>
        </Link>

        <Link to="/map">
          <Card className="hover:border-teal-300 hover:shadow-brand transition-all cursor-pointer h-full flex flex-col justify-between p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00E5BE] border border-teal-100 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Safety Map</h3>
              <p className="text-xs text-stone-300 mt-1">Explore road & transit alerts</p>
            </div>
          </Card>
        </Link>

        <Link to="/report-hazard">
          <Card className="hover:border-teal-300 hover:shadow-brand transition-all cursor-pointer h-full flex flex-col justify-between p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Report Hazard</h3>
              <p className="text-xs text-stone-300 mt-1">Submit streetlights or closures</p>
            </div>
          </Card>
        </Link>

        <Link to="/journey">
          <Card className="hover:border-teal-300 hover:shadow-brand transition-all cursor-pointer h-full flex flex-col justify-between p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00E5BE] border border-teal-100 flex items-center justify-center mb-3">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Start Journey</h3>
              <p className="text-xs text-stone-300 mt-1">Check-in timer & share link</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1424] dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-800 shadow-card ring-1 ring-black/5">
          <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Logged Hazards</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalHazards}</div>
          <div className="text-[11px] text-stone-300 mt-1">Open public reports</div>
        </div>

        <div className="bg-[#0d1424] dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-800 shadow-card ring-1 ring-black/5">
          <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Saved Incidents</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalIncidents}</div>
          <div className="text-[11px] text-stone-300 mt-1">Preserved timelines</div>
        </div>

        <div className="bg-[#0d1424] dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-800 shadow-card ring-1 ring-black/5">
          <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Active Trips</div>
          <div className="text-2xl font-black text-white mt-1">{stats.activeJourneys}</div>
          <div className="text-[11px] text-stone-300 mt-1">Journey Guardian sessions</div>
        </div>

        <div className="bg-[#0d1424] dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-800 shadow-card ring-1 ring-black/5">
          <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Checklist Progress</div>
          <div className="text-2xl font-black text-[#00E5BE] mt-1">{stats.checklistProgress.percentage}%</div>
          <div className="text-[11px] text-stone-300 mt-1">{stats.checklistProgress.completed} of {stats.checklistProgress.total} completed</div>
        </div>
      </div>

      {/* Main Dual Grid: Recent Hazards & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hazards Section */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00E5BE]" />
                <h3 className="font-bold text-white">Recent Community Hazards</h3>
              </div>
              <Link to="/map" className="text-xs font-semibold text-[#00E5BE] hover:text-teal-900 transition-colors">
                View Full Map →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-300">Loading hazard reports...</div>
            ) : recentHazards.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-300">No hazards reported yet.</div>
            ) : (
              <div className="space-y-3">
                {recentHazards.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-xl border border-stone-800 bg-[#0f172a]/60 hover:bg-[#0f172a] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-white text-xs sm:text-sm">{h.title}</h4>
                      {h.isDemoData ? (
                        <span className="text-[10px] font-bold text-stone-200 bg-stone-800 border border-stone-700 px-2 py-0.5 rounded-md">
                          Demo Data
                        </span>
                      ) : (
                        <Badge variant="blue">Community</Badge>
                      )}
                    </div>
                    <p className="text-xs text-stone-200 mt-1 line-clamp-2">{h.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-300">
                      <span className="capitalize">{h.category.replace('-', ' ')}</span>
                      <span>{h.confirmationCount} confirmation{h.confirmationCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
            <Link to="/report-hazard">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Submit New Report
              </Button>
            </Link>
            <Link to="/map" className="text-xs text-stone-300 hover:text-white transition-colors">
              Open Map Explorer
            </Link>
          </div>
        </Card>

        {/* Incidents Section */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00E5BE]" />
                <h3 className="font-bold text-white">Incident Documentation Logs</h3>
              </div>
              <Link to="/incidents" className="text-xs font-semibold text-[#00E5BE] hover:text-teal-900 transition-colors">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-300">Loading incident records...</div>
            ) : recentIncidents.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-300">No incident logs recorded.</div>
            ) : (
              <div className="space-y-3">
                {recentIncidents.map((inc) => (
                  <Link key={inc.id} to={`/incidents/${inc.id}`}>
                    <div className="p-3.5 rounded-xl border border-stone-800 bg-[#0f172a]/60 hover:bg-[#0f172a] hover:border-teal-200 transition-all cursor-pointer mb-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white text-xs sm:text-sm">{inc.title}</h4>
                        <Badge
                          variant={
                            inc.status === 'open'
                              ? 'rose'
                              : inc.status === 'in-progress'
                              ? 'amber'
                              : 'emerald'
                          }
                        >
                          {inc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-200 mt-1 line-clamp-1">{inc.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-300">
                        <span className="capitalize">{inc.category.replace('-', ' ')}</span>
                        <span>{inc.notes?.length || 0} note(s) logged</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
            <Link to="/analyze">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <MessageSquareWarning className="w-3.5 h-3.5" /> New Analysis
              </Button>
            </Link>
            <Link to="/incidents" className="text-xs text-stone-300 hover:text-white transition-colors">
              Manage Evidence Vault
            </Link>
          </div>
        </Card>
      </div>

      {/* Privacy Notice Banner */}
      <Alert type="info">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#00E5BE] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-teal-900">Local-First Storage Guarantee:</span>{' '}
            All hazard reports, analysis sessions, and incident documentation are saved directly to your local
            SQLite database. Nothing is transmitted to external AI cloud APIs or surveillance advertisers.
          </div>
        </div>
      </Alert>
    </div>
  );
};




