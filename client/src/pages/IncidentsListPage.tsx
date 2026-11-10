import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const IncidentsListPage: React.FC = () => {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [message, setMessage] = useState<string>('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents({
        category: category !== 'all' ? category : undefined,
        status: status !== 'all' ? status : undefined,
        search: search.trim() ? search.trim() : undefined,
      });
      setIncidents(data.incidents || []);
    } catch (err: any) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [category, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIncidents();
  };

  const handleClearDemo = async () => {
    if (!window.confirm('Are you sure you want to delete all seeded sample incidents? Real incidents will remain.')) {
      return;
    }

    try {
      const res = await api.clearDemoIncidents();
      setMessage(res.message);
      fetchIncidents();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-700" /> Incident Evidence Manager
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Securely record and chronologicalize harassment, cyber threats, and physical security incidents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleClearDemo} className="text-rose-600 hover:text-rose-700">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Demo Data
          </Button>

          <Link to="/incidents/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" /> New Incident
            </Button>
          </Link>
        </div>
      </div>

      {message && <Alert type="info">{message}</Alert>}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0e1422] p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search title or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs text-stone-700 dark:text-stone-200 bg-white dark:bg-[#0e1422] focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Categories</option>
            <option value="online-harassment">Online Harassment</option>
            <option value="physical-threat">Physical Threat</option>
            <option value="stalking">Stalking</option>
            <option value="phishing-scam">Phishing / Scam</option>
            <option value="coercion">Coercion / Extortion</option>
            <option value="impersonation">Impersonation</option>
            <option value="other">Other</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs text-stone-700 dark:text-stone-200 bg-white dark:bg-[#0e1422] focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-400 dark:text-stone-500">Loading incident records...</div>
      ) : incidents.length === 0 ? (
        <Card className="text-center py-16">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base">No Incidents Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {search || category !== 'all' || status !== 'all'
              ? 'No records match your selected filter criteria.'
              : 'You have not recorded any incidents yet. Document threats early to maintain accurate timelines.'}
          </p>
          <div className="mt-5">
            <Link to="/incidents/new">
              <Button size="sm">Record First Incident</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <Card
              key={inc.id}
              className="hover:border-teal-400 hover:shadow-md transition-all cursor-pointer p-5"
            >
              <div
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-stone-900 dark:text-white text-base">{inc.title}</h3>
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
                    {inc.isDemoData && (
                      <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        Demo Record
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-stone-400 dark:text-stone-500 pt-1 flex-wrap">
                    <span className="capitalize font-medium text-teal-700">
                      {inc.category.replace('-', ' ')}
                    </span>
                    {inc.incidentDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Date: {inc.incidentDate}
                      </span>
                    )}
                    <span>{inc.notes?.length || 0} dated note(s)</span>
                    <span>{inc.evidenceExcerpts?.length || 0} evidence excerpt(s)</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Inspect Timeline →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


