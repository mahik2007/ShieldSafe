import React, { useEffect, useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  Share2,
  CheckCircle,
  AlertTriangle,
  Play,
  StopCircle,
  ShieldAlert,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { Journey } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';

export const JourneyGuardianPage: React.FC = () => {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [destination, setDestination] = useState<string>('');
  const [startLocation, setStartLocation] = useState<string>('');
  const [arrivalMinutes, setArrivalMinutes] = useState<number>(30);
  const [rideProvider, setRideProvider] = useState<string>('');
  const [driverName, setDriverName] = useState<string>('');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('');
  const [bookingReference, setBookingReference] = useState<string>('');
  const [checkInInterval, setCheckInInterval] = useState<number>(15);
  const [enableGps, setEnableGps] = useState<boolean>(false);

  const [shareData, setShareData] = useState<{ token: string; expiresAt: string; warning: string } | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Check-in timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  const fetchActiveJourney = async () => {
    try {
      setLoading(true);
      const data = await api.getActiveJourney();
      setActiveJourney(data.journey);
      if (data.journey) {
        calculateRemainingTime(data.journey);
      }
    } catch (err: any) {
      console.error('Failed to load active journey:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJourney();
  }, []);

  // Interval timer for active journey
  useEffect(() => {
    if (!activeJourney || activeJourney.status !== 'active') return;

    const timer = setInterval(() => {
      calculateRemainingTime(activeJourney);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeJourney]);

  const calculateRemainingTime = (journey: Journey) => {
    if (!journey.lastCheckIn) return;

    const lastCheckInTime = new Date(journey.lastCheckIn).getTime();
    const intervalMs = (journey.checkInIntervalMinutes || 15) * 60 * 1000;
    const nextCheckInTime = lastCheckInTime + intervalMs;
    const now = Date.now();
    const diff = Math.floor((nextCheckInTime - now) / 1000);

    if (diff <= 0) {
      setTimeLeftSeconds(0);
      setIsOverdue(true);
    } else {
      setTimeLeftSeconds(diff);
      setIsOverdue(false);
    }
  };

  const handleStartJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destination.trim() || !startLocation.trim()) {
      setError('Start location and destination are required.');
      return;
    }

    try {
      setLoading(true);
      const plannedArrival = new Date(Date.now() + arrivalMinutes * 60 * 1000).toISOString();

      const data = await api.startJourney({
        destination: destination.trim(),
        startLocation: startLocation.trim(),
        plannedArrivalTime: plannedArrival,
        rideProvider: rideProvider.trim() || undefined,
        driverName: driverName.trim() || undefined,
        vehicleRegistration: vehicleRegistration.trim() || undefined,
        bookingReference: bookingReference.trim() || undefined,
        checkInIntervalMinutes: checkInInterval,
        locationSharingEnabled: enableGps,
      });

      setActiveJourney(data.journey);
      calculateRemainingTime(data.journey);
      setMessage('Journey Guardian session activated.');
    } catch (err: any) {
      setError(err.message || 'Failed to start journey.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!activeJourney) return;
    try {
      const res = await api.checkInJourney(activeJourney.id);
      setActiveJourney({ ...activeJourney, lastCheckIn: res.lastCheckIn });
      setIsOverdue(false);
      setMessage('Check-in confirmed. Timer reset.');
    } catch (err: any) {
      setError(err.message || 'Check-in failed.');
    }
  };

  const handleCompleteJourney = async () => {
    if (!activeJourney) return;
    try {
      await api.completeJourney(activeJourney.id);
      setActiveJourney(null);
      setShareData(null);
      setShareUrl('');
      setMessage('Journey completed safely. All tracking ended.');
    } catch (err: any) {
      setError(err.message || 'Failed to complete journey.');
    }
  };

  const handleCancelJourney = async () => {
    if (!activeJourney) return;
    if (!window.confirm('Are you sure you want to cancel this journey?')) return;

    try {
      await api.cancelJourney(activeJourney.id);
      setActiveJourney(null);
      setShareData(null);
      setShareUrl('');
      setMessage('Journey cancelled.');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel journey.');
    }
  };

  const handleGenerateShareLink = async () => {
    if (!activeJourney) return;
    try {
      const res = await api.shareJourney(activeJourney.id);
      setShareData(res);
      const fullUrl = `${window.location.origin}/journey/share/${res.token}`;
      setShareUrl(fullUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to create share link.');
    }
  };

  const handleRevokeShare = async () => {
    if (!activeJourney) return;
    try {
      await api.revokeJourneyShare(activeJourney.id);
      setShareData(null);
      setShareUrl('');
      setMessage('Shared access link revoked immediately.');
    } catch (err: any) {
      setError(err.message || 'Failed to revoke link.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopyStatus('Copied to clipboard!');
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#0e1422] p-6 rounded-2xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Navigation className="w-6 h-6 text-teal-700" /> Journey Guardian
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
          Automated check-in countdown, vehicle transit details, and secure cryptographic sharing links
          with trusted contacts. No background tracking without consent.
        </p>
      </div>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* If Active Journey Exists */}
      {activeJourney ? (
        <div className="space-y-6">
          {/* Overdue Warning Notification */}
          {isOverdue && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-sm sm:text-base">Check-in Timer Overdue!</h3>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Your scheduled check-in window has elapsed. Confirm you are safe now.
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={handleCheckIn} className="bg-rose-600 hover:bg-rose-700 text-white px-6">
                I Am Safe (Check In)
              </Button>
            </div>
          )}

          {/* Active Status Card */}
          <Card className="border-teal-200 ring-2 ring-teal-600/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">In Transit</Badge>
                  <span className="text-xs text-stone-500">ID #{activeJourney.id}</span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                  {activeJourney.startLocation} → {activeJourney.destination}
                </h2>
              </div>

              {/* Countdown Display */}
              <div className="text-center sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 block uppercase tracking-wider">
                  Next Check-In Due
                </span>
                <span
                  className={`text-2xl font-black font-mono ${
                    isOverdue ? 'text-rose-600' : 'text-teal-700'
                  }`}
                >
                  {isOverdue ? 'OVERDUE' : formatTimer(timeLeftSeconds)}
                </span>
              </div>
            </div>

            {/* Journey Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Planned Arrival</span>
                <span className="font-semibold text-stone-800 dark:text-stone-100">
                  {new Date(activeJourney.plannedArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Ride Provider</span>
                <span className="font-semibold text-stone-800 dark:text-stone-100">
                  {activeJourney.rideProvider || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Vehicle License</span>
                <span className="font-semibold text-stone-800 dark:text-stone-100 font-mono">
                  {activeJourney.vehicleRegistration || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Driver Name</span>
                <span className="font-semibold text-stone-800 dark:text-stone-100">
                  {activeJourney.driverName || 'Not specified'}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleCheckIn} className="gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Check In Now
                </Button>

                {!shareUrl ? (
                  <Button size="sm" variant="outline" onClick={handleGenerateShareLink} className="gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Generate Share Link
                  </Button>
                ) : (
                  <Button size="sm" variant="danger" onClick={handleRevokeShare} className="gap-1.5">
                    Revoke Share Link
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handleCancelJourney} className="text-stone-500">
                  Cancel Trip
                </Button>
                <Button size="sm" variant="outline" onClick={handleCompleteJourney} className="gap-1.5 text-emerald-700 border-emerald-300">
                  <StopCircle className="w-3.5 h-3.5" /> Arrived Safely (Complete)
                </Button>
              </div>
            </div>
          </Card>

          {/* Share Link Card (if generated) */}
          {shareUrl && (
            <Card className="bg-teal-50/40 border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-teal-700" /> Cryptographic Share Link Active
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">Expires in 24 hours</span>
              </div>

              <p className="text-xs text-indigo-950/80 mb-3 leading-relaxed">
                Send this link to a trusted contact. They can view your destination, vehicle details, and check-in status
                without creating an account.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-white dark:bg-[#0e1422] p-2.5 rounded-xl border border-teal-200 text-xs font-mono text-stone-800 dark:text-stone-100 select-all"
                />
                <Button size="sm" onClick={handleCopyLink} className="gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>

              {copyStatus && <div className="text-xs font-semibold text-emerald-600 mt-2">{copyStatus}</div>}

              <div className="mt-3 text-[11px] text-stone-500">
                Notice: If you are running on localhost, external devices cannot access this URL unless connected to your local network.
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* Create New Journey Form */
        <Card>
          <form onSubmit={handleStartJourney} className="space-y-5">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Start a New Safe Journey</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
                  Starting Point *
                </label>
                <input
                  type="text"
                  required
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g. Office / Indiranagar 100ft Road"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 p-3 text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Home / Koramangala 4th Block"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 p-3 text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
                  Estimated Trip Duration
                </label>
                <select
                  value={arrivalMinutes}
                  onChange={(e) => setArrivalMinutes(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 p-3 text-sm text-stone-900 dark:text-white bg-white dark:bg-[#0e1422] focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2">
                  Check-In Alert Interval
                </label>
                <select
                  value={checkInInterval}
                  onChange={(e) => setCheckInInterval(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 p-3 text-sm text-stone-900 dark:text-white bg-white dark:bg-[#0e1422] focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value={10}>Every 10 Minutes</option>
                  <option value={15}>Every 15 Minutes</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={45}>Every 45 Minutes</option>
                </select>
              </div>
            </div>

            {/* Optional Ride / Driver Details Section */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider block">
                Transit & Vehicle Details (Optional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Provider (Uber/Ola/Auto)</span>
                  <input
                    type="text"
                    value={rideProvider}
                    onChange={(e) => setRideProvider(e.target.value)}
                    placeholder="e.g. Uber Auto"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-[#0e1422] focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Driver Name</span>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Ramesh K"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-[#0e1422] focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">License Plate</span>
                  <input
                    type="text"
                    value={vehicleRegistration}
                    onChange={(e) => setVehicleRegistration(e.target.value)}
                    placeholder="e.g. KA-01-AB-1234"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-[#0e1422] font-mono focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <Button type="submit" isLoading={loading} className="gap-2 px-8">
                <Play className="w-4 h-4 fill-white" /> Start Journey Guardian Session
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};


