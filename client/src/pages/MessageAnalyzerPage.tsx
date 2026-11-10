import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquareWarning,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  BookmarkPlus,
  RotateCcw,
  BookOpen,
  Info,
  Shield,
} from 'lucide-react';
import { api } from '../services/api';
import { AnalysisResult } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const MessageAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [samples, setSamples] = useState<{ id: string; label: string; message: string; context: string }[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    api.getSampleMessages()
      .then((data) => setSamples(data.samples || []))
      .catch((e) => console.error('Could not load samples:', e));
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please input or load message text to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await api.analyzeMessage(message.trim(), context.trim());
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample: { message: string; context: string }) => {
    setMessage(sample.message);
    setContext(sample.context);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
    setMessage('');
    setContext('');
    setResult(null);
    setError('');
  };

  const handleSaveAsIncident = () => {
    if (!result) return;
    // Store in sessionStorage to pre-fill incident form
    sessionStorage.setItem(
      'shieldsafe_incident_prefill',
      JSON.stringify({
        title: result.flags[0] ? `Threat detected: ${result.flags[0].label}` : 'Harassment evaluation record',
        description: `Message analyzed:\n"${message}"\n\nContext:\n${context || 'None provided'}`,
        category:
          result.flags.some((f) => f.type === 'credential-phishing')
            ? 'phishing-scam'
            : result.flags.some((f) => f.type === 'direct-threat')
            ? 'physical-threat'
            : result.flags.some((f) => f.type === 'coercive-demand' || f.type === 'intimate-material-pressure')
            ? 'coercion'
            : 'online-harassment',
        evidenceExcerpts: result.flags.map((f) => f.excerpt),
        sourceLabel: 'Analyzed via Digital Harassment Defender',
      })
    );

    navigate('/incidents/new');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-violet-700 text-xs font-semibold border border-amber-100 mb-2">
              <Shield className="w-3.5 h-3.5" /> Deterministic Rules-Based Engine
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareWarning className="w-6 h-6 text-amber-600" /> Digital Harassment Defender
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Evaluate suspicious or intimidating communications for coercion, intimate material threats,
              and phishing indicators. Operates locally on your server without sending text to public AI models.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Fictional Samples Selector */}
      <div className="bg-stone-100/70 p-4 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Load Fictional Demonstration Cases:
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => handleLoadSample(s)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 font-medium transition-all cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Input Box Card */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Message Text to Evaluate *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste the received message, email, or chat excerpt here..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Received from unknown Instagram account, sender claims to be my manager"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={handleClear} className="w-full sm:w-auto">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear Text
            </Button>

            <Button
              size="md"
              onClick={handleAnalyze}
              isLoading={loading}
              className="w-full sm:w-auto px-8 bg-amber-600 hover:bg-violet-700 shadow-sm"
            >
              Analyze Message Patterns
            </Button>
          </div>
        </div>
      </Card>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Summary Card */}
          <Card
            className={`border-2 ${
              result.severity === 'urgent'
                ? 'border-rose-400 bg-rose-50/20'
                : result.severity === 'concerning'
                ? 'border-amber-400 bg-amber-50/20'
                : result.severity === 'context-needed'
                ? 'border-blue-400 bg-blue-50/20'
                : 'border-emerald-400 bg-emerald-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {result.severity === 'urgent' ? (
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                ) : result.severity === 'concerning' ? (
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                ) : result.severity === 'context-needed' ? (
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Evaluation Outcome</div>
                  <h3 className="text-lg font-extrabold text-slate-900 capitalize">
                    {result.severity.replace('-', ' ')} Severity
                  </h3>
                </div>
              </div>

              <Button size="sm" onClick={handleSaveAsIncident} className="gap-1.5 shrink-0">
                <BookmarkPlus className="w-4 h-4" /> Save as Incident Record
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-800 leading-relaxed font-medium bg-white/80 p-4 rounded-xl border border-stone-200">
              {result.summary}
            </p>
          </Card>

          {/* Identified Pattern Flags */}
          {result.flags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Detected Pattern Excerpts ({result.flags.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {result.flags.map((flag, idx) => (
                  <Card key={idx} className="p-4 border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">{flag.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-slate-600">
                        {flag.type}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 font-mono text-xs text-rose-800 mb-2">
                      "{flag.excerpt}"
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{flag.explanation}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Steps */}
          {result.nextSteps.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Recommended Practical Actions
              </h3>
              <ul className="space-y-2">
                {result.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Engine Disclaimer */}
          <div className="p-4 rounded-2xl bg-stone-100 text-[11px] text-stone-500 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{result.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};

