import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Button, Card, Alert } from '../components/UI';

export const ReportHazardPage: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<string>('broken-streetlight');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('12.9716');
  const [longitude, setLongitude] = useState<string>('77.5946');
  const [loading, setLoading] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError(`Unable to retrieve location: ${err.message}. Please enter coordinates manually.`);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please provide a valid latitude between -90 and 90.');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Please provide a valid longitude between -180 and 180.');
      return;
    }

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }

    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    try {
      setLoading(true);
      await api.createHazard({
        category,
        title: title.trim(),
        description: description.trim(),
        latitude: lat,
        longitude: lng,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/map');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
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
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Report Public Hazard
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Submit a real physical hazard observed in your community to help fellow commuters.
          </p>
        </div>
      </div>

      {success && (
        <Alert type="success" title="Hazard Reported Successfully">
          Your report has been saved to the database and is now visible on the safety map. Redirecting...
        </Alert>
      )}

      {error && <Alert type="error" title="Submission Error">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Hazard Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white bg-white dark:bg-[#0e1422] focus:ring-2 focus:ring-teal-600 focus:outline-none"
            >
              <option value="broken-streetlight">Broken / Non-functional Streetlight</option>
              <option value="road-construction">Road Construction / Open Trench</option>
              <option value="road-closure">Road Closure / Barricade</option>
              <option value="blocked-footpath">Blocked / Damaged Footpath</option>
              <option value="stray-dog">Aggressive Stray Dog Sighting</option>
              <option value="other">Other Public Safety Concern</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Report Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken streetlamps between 12th Main and Trinity station"
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide objective visual details (e.g. two poles unlit, pitch black sidewalk after 8 PM, forced onto active road). Do not accuse specific named individuals."
              className="w-full rounded-xl border border-stone-700 dark:border-stone-700 p-3 text-sm text-white dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Coordinates & Browser Locate */}
          <div className="bg-[#0f172a] p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-100 dark:text-stone-200 uppercase tracking-wider">
                Geographic Coordinates
              </label>
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                disabled={locating}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                {locating ? 'Locating...' : 'Use My GPS Location'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-300 block mb-1">Latitude</span>
                <input
                  type="text"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="12.9716"
                  className="w-full rounded-lg border border-stone-700 dark:border-stone-700 p-2.5 text-xs font-mono text-white dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white dark:bg-[#0e1422]"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-300 block mb-1">Longitude</span>
                <input
                  type="text"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="77.5946"
                  className="w-full rounded-lg border border-stone-700 dark:border-stone-700 p-2.5 text-xs font-mono text-white dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white dark:bg-[#0e1422]"
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-300">
              Defaults to central demonstration coordinates if GPS is unavailable.
            </p>
          </div>

          {/* Guidelines Notice */}
          <div className="text-xs text-stone-300 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
            <strong>Community Notice:</strong> Reports are published immediately with an 'unverified' badge.
            Avoid submitting unsubstantiated allegations against individuals.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="px-6">
              Publish Hazard Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};



