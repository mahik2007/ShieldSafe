import React, { useEffect, useState } from 'react';
import { CheckSquare, RotateCcw, Printer, CheckCircle2, Circle, AlertCircle, Shield } from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { api } from '../services/api';
import { ChecklistItem } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const SafetyPlanPage: React.FC = () => {
  const { mode } = useSafetyMode();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [notes, setNotes] = useState<{ [id: number]: string }>({});

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const data = await api.getChecklist(mode);
      setItems(data.items || []);
      const initialNotes: { [id: number]: string } = {};
      (data.items || []).forEach((item) => {
        if (item.note) initialNotes[item.id] = item.note;
      });
      setNotes(initialNotes);
    } catch (err: any) {
      console.error('Failed to load checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [mode]);

  const handleToggle = async (item: ChecklistItem) => {
    const newStatus = !item.completed;
    try {
      const res = await api.updateChecklistItem(item.id, {
        completed: newStatus,
        note: notes[item.id] || item.note,
      });

      setItems((prev) => prev.map((i) => (i.id === item.id ? res.item : i)));
    } catch (err: any) {
      console.error('Failed to update task:', err);
    }
  };

  const handleNoteBlur = async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      await api.updateChecklistItem(id, {
        completed: item.completed,
        note: notes[id] || undefined,
      });
    } catch (err: any) {
      console.error('Failed to save note:', err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all checklist progress back to uncompleted?')) return;
    try {
      await api.resetChecklist();
      fetchChecklist();
      setMessage('Safety checklist has been reset.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0e1422] p-5 rounded-2xl border border-stone-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-teal-700" /> Safety Action Planner
            </h1>
            <Badge variant="blue" className="capitalize">
              {mode} Mode
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Personalized safety habits, digital hygiene routines, and emergency preparedness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </Button>

          <Button size="sm" variant="ghost" onClick={handleReset} className="text-stone-500 gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
        </div>
      </div>

      {message && <Alert type="info">{message}</Alert>}

      {/* Progress Bar Card */}
      <Card className="print:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Checklist Completion Progress
          </span>
          <span className="text-sm font-extrabold text-teal-700 font-mono">
            {completedCount} / {items.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-700 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

      {/* Checklist Items Grouped */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-400 dark:text-stone-500">Loading checklist guidelines...</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`transition-all p-5 ${
                item.completed ? 'bg-stone-50/70 border-stone-200' : 'hover:border-teal-400'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="mt-0.5 text-teal-700 hover:text-teal-900 focus:outline-none cursor-pointer"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-teal-600" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`font-bold text-sm ${
                        item.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{item.description}</p>

                  {/* Personal note input */}
                  <div className="pt-2 print:hidden">
                    <input
                      type="text"
                      placeholder="Add personal note (e.g. Completed for Instagram & Google account)..."
                      value={notes[item.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                      onBlur={() => handleNoteBlur(item.id)}
                      className="w-full text-[11px] bg-white dark:bg-[#0e1422] border border-stone-200 rounded-lg p-2 text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


