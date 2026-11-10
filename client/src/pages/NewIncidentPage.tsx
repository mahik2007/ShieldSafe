import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Plus, X } from 'lucide-react';
import { api } from '../services/api';
import { Button, Card, Alert } from '../components/UI';

export const NewIncidentPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('online-harassment');
  const [description, setDescription] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [sourceLabel, setSourceLabel] = useState<string>('');
  const [evidenceExcerpts, setEvidenceExcerpts] = useState<string[]>([]);
  const [newExcerpt, setNewExcerpt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Check if prefill data exists from Harassment Defender analyzer
  useEffect(() => {
    const prefillStr = sessionStorage.getItem('shieldsafe_incident_prefill');
    if (prefillStr) {
      try {
        const p = JSON.parse(prefillStr);
        if (p.title) setTitle(p.title);
        if (p.description) setDescription(p.description);
        if (p.category) setCategory(p.category);
        if (p.evidenceExcerpts) setEvidenceExcerpts(p.evidenceExcerpts);
        if (p.sourceLabel) setSourceLabel(p.sourceLabel);
      } catch (e) {
        console.error('Failed to parse prefill:', e);
      } finally {
        sessionStorage.removeItem('shieldsafe_incident_prefill');
      }
    }
  }, []);

  const handleAddExcerpt = () => {
    if (!newExcerpt.trim()) return;
    setEvidenceExcerpts([...evidenceExcerpts, newExcerpt.trim()]);
    setNewExcerpt('');
  };

  const handleRemoveExcerpt = (idx: number) => {
    setEvidenceExcerpts(evidenceExcerpts.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await api.createIncident({
        title: title.trim(),
        category: category as any,
        description: description.trim(),
        incidentDate: incidentDate || undefined,
        sourceLabel: sourceLabel.trim() || undefined,
        evidenceExcerpts,
        status: 'open',
      });

      navigate(`/incidents/${data.incident.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to record incident.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-700" /> Record Incident Evidence
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Create an objective incident record and maintain an organized timeline.
          </p>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Threatening WhatsApp messages received from unknown number"
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white bg-white dark:bg-[#0e1422] focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="online-harassment">Online Harassment</option>
                <option value="physical-threat">Physical Threat</option>
                <option value="stalking">Stalking</option>
                <option value="phishing-scam">Phishing / Scam</option>
                <option value="coercion">Coercion / Extortion</option>
                <option value="impersonation">Impersonation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
                Incident Date
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white dark:bg-[#0e1422]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Source / Platform
            </label>
            <input
              type="text"
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
              placeholder="e.g. WhatsApp, Instagram DM, Workplace email, In-person transit"
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Comprehensive Description *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred with facts, sequence of events, and timestamps. Avoid exaggerations."
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3.5 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Evidence Excerpts */}
          <div className="bg-[#0f172a] p-4 rounded-xl border border-stone-800 space-y-3">
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider">
              Specific Message or Evidence Quotes
            </label>

            {evidenceExcerpts.length > 0 && (
              <div className="space-y-2">
                {evidenceExcerpts.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#0e1422] border border-stone-800 text-xs text-white dark:text-stone-100"
                  >
                    <span className="font-mono truncate mr-2">"{ex}"</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExcerpt(i)}
                      className="text-stone-400 dark:text-stone-300 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                placeholder="Paste verbatim threat quote..."
                className="flex-1 rounded-lg border border-stone-700 dark:border-stone-700 p-2 text-xs bg-white dark:bg-[#0e1422] focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddExcerpt}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Quote
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="px-6">
              Save Incident Record
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};



