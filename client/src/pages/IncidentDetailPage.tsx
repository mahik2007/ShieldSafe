import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Calendar,
  Download,
  Trash2,
  Edit3,
  Plus,
  Clock,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { api } from '../services/api';
import { Incident } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [noteContent, setNoteContent] = useState<string>('');
  const [submittingNote, setSubmittingNote] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchIncident = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getIncident(parseInt(id, 10));
      setIncident(data.incident);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch incident details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !incident) return;

    try {
      setSubmittingNote(true);
      await api.addIncidentNote(incident.id, noteContent.trim());
      setNoteContent('');
      setMessage('Timeline note added successfully.');
      fetchIncident();
    } catch (err: any) {
      setError(err.message || 'Failed to add note.');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!incident) return;
    if (!window.confirm('Are you sure you want to delete this incident record permanently?')) {
      return;
    }

    try {
      await api.deleteIncident(incident.id);
      navigate('/incidents');
    } catch (err: any) {
      setError(err.message || 'Failed to delete incident.');
    }
  };

  // Generate local PDF report using jsPDF
  const handleDownloadPdf = () => {
    if (!incident) return;

    try {
      const doc = new jsPDF();
      const margin = 15;
      let y = 20;

      // Header Branding
      doc.setFontSize(20);
      doc.setTextColor(79, 97, 230); // Indigo
      doc.text('ShieldSafe Incident Evidence Report', margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Reference ID: SS-INC-${incident.id}  |  Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 12;

      // Line separator
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, 195, y);
      y += 10;

      // Metadata Block
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Title: ${incident.title}`, margin, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Category: ${incident.category.replace('-', ' ').toUpperCase()}`, margin, y);
      y += 6;
      doc.text(`Status: ${incident.status.toUpperCase()}`, margin, y);
      y += 6;
      doc.text(`Incident Date: ${incident.incidentDate || 'Not specified'}`, margin, y);
      y += 6;
      doc.text(`Source / Platform: ${incident.sourceLabel || 'Direct Entry'}`, margin, y);
      y += 10;

      // Narrative Description
      doc.setFont('helvetica', 'bold');
      doc.text('Description of Events:', margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(incident.description, 180);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 8;

      // Evidence Excerpts
      if (incident.evidenceExcerpts && incident.evidenceExcerpts.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Documented Evidence Excerpts:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');

        incident.evidenceExcerpts.forEach((ex, idx) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          const exLines = doc.splitTextToSize(`[${idx + 1}] "${ex}"`, 175);
          doc.text(exLines, margin + 4, y);
          y += exLines.length * 5 + 3;
        });
        y += 6;
      }

      // Chronological Notes Timeline
      if (incident.notes && incident.notes.length > 0) {
        if (y > 230) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Chronological Action Notes Timeline:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');

        incident.notes.forEach((note) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          const noteHeader = `• ${note.createdAt}:`;
          doc.setFont('helvetica', 'bold');
          doc.text(noteHeader, margin, y);
          y += 5;
          doc.setFont('helvetica', 'normal');
          const noteLines = doc.splitTextToSize(note.content, 175);
          doc.text(noteLines, margin + 4, y);
          y += noteLines.length * 5 + 4;
        });
        y += 6;
      }

      // Legal & Procedural Disclaimer
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, 195, y);
      y += 8;

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const disclaimer =
        'DISCLAIMER: This report is a user-generated incident summary produced by ShieldSafe. It is designed to assist in compiling personal records for discussions with legal counsel, workplace HR, or cybercrime authorities. It does not constitute a certified forensic report or police complaint receipt.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, 180);
      doc.text(disclaimerLines, margin, y);

      doc.save(`ShieldSafe_Incident_${incident.id}.pdf`);
    } catch (err: any) {
      console.error('PDF error:', err);
      setError('Failed to generate PDF document.');
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-400">Loading incident timeline...</div>;
  }

  if (!incident) {
    return (
      <Card className="text-center py-16">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Incident Record Not Found</h3>
        <p className="text-xs text-stone-500 mt-1">The requested ID does not exist or was deleted.</p>
        <div className="mt-4">
          <Link to="/incidents">
            <Button size="sm">Back to Incident List</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => navigate('/incidents')} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-teal-700">SS-INC-{incident.id}</span>
              <Badge
                variant={
                  incident.status === 'open'
                    ? 'rose'
                    : incident.status === 'in-progress'
                    ? 'amber'
                    : 'emerald'
                }
              >
                {incident.status}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{incident.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadPdf} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF Report
          </Button>

          <Button size="sm" variant="ghost" onClick={handleDelete} className="text-rose-600 hover:text-rose-700 p-2">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details & Evidence */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Incident Narrative
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-200">
              {incident.description}
            </p>

            {/* Documented Evidence Excerpts */}
            {incident.evidenceExcerpts && incident.evidenceExcerpts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Documented Evidence Excerpts ({incident.evidenceExcerpts.length})
                </h4>
                <div className="space-y-2">
                  {incident.evidenceExcerpts.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-rose-800"
                    >
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Chronological Action Timeline */}
          <Card>
            <div className="flex items-center gap-2 pb-4 border-b border-stone-100 mb-4">
              <Clock className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Chronological Timeline & Actions Taken
              </h3>
            </div>

            {incident.notes && incident.notes.length > 0 ? (
              <div className="space-y-4 mb-6">
                {incident.notes.map((note) => (
                  <div key={note.id} className="relative pl-6 pb-2 border-l-2 border-teal-200">
                    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-teal-700" />
                    <div className="text-[11px] font-semibold text-slate-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mb-6">No follow-up action notes logged yet.</p>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold text-slate-700">
                Log New Follow-up Note or Action Taken
              </label>
              <textarea
                rows={2}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="e.g. Blocked user on WhatsApp, filed cybercrime report ref #10948, spoke with college counselor."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <div className="flex justify-end">
                <Button size="sm" type="submit" isLoading={submittingNote}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Timeline Note
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="space-y-6">
          <Card className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-stone-100 pb-2">
              Record Metadata
            </h3>

            <div>
              <span className="text-slate-400 block mb-0.5">Category</span>
              <span className="font-semibold text-slate-800 capitalize">
                {incident.category.replace('-', ' ')}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Incident Date</span>
              <span className="font-semibold text-slate-800">
                {incident.incidentDate || 'Not specified'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Source / Platform</span>
              <span className="font-semibold text-slate-800">
                {incident.sourceLabel || 'Direct user input'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Created In ShieldSafe</span>
              <span className="font-semibold text-slate-800">
                {new Date(incident.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Last Updated</span>
              <span className="font-semibold text-slate-800">
                {new Date(incident.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </Card>

          {/* Legal Advisory Notice */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-indigo-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <ShieldAlert className="w-4 h-4 text-teal-700" /> Preservation Advice:
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-900/80">
              Preserve original screenshots, email headers, or chat exports on an external drive.
              Timestamps and unaltered headers are critical evidence for cybercrime investigators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

