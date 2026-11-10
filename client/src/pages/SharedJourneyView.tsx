import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Navigation, Clock, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { api } from '../services/api';
import { Card, Badge, Alert } from '../components/UI';

export const SharedJourneyView: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [journey, setJourney] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Missing share token');
      setLoading(false);
      return;
    }

    const fetchShared = async () => {
      try {
        setLoading(true);
        const data = await api.getSharedJourney(token);
        setJourney(data.sharedJourney);
      } catch (err: any) {
        setError(err.message || 'This shared journey link is invalid, expired, or has been revoked.');
      } finally {
        setLoading(false);
      }
    };

    fetchShared();
    // Auto-refresh every 20 seconds
    const interval = setInterval(fetchShared, 20000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-200 mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white dark:text-white tracking-tight">
          ShieldSafe Journey Guardian
        </h1>
        <p className="mt-1 text-xs text-stone-300">
          Secure, read-only contact journey status view
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        {loading && !journey ? (
          <Card className="text-center py-12 text-xs text-stone-400 dark:text-stone-300">
            Fetching verified journey status...
          </Card>
        ) : error ? (
          <Card className="text-center py-10 space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="font-bold text-white dark:text-stone-100 text-sm">Link Expired or Inactive</h3>
            <p className="text-xs text-stone-300 max-w-xs mx-auto">{error}</p>
          </Card>
        ) : journey ? (
          <Card className="space-y-5 border-teal-200 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-700" /> Live Trip Status
              </span>
              <Badge
                variant={
                  journey.status === 'active'
                    ? 'blue'
                    : journey.status === 'completed'
                    ? 'emerald'
                    : 'slate'
                }
              >
                {journey.status.toUpperCase()}
              </Badge>
            </div>

            <div>
              <span className="text-[11px] text-stone-400 dark:text-stone-300 font-medium block">Route</span>
              <h2 className="text-base font-bold text-white dark:text-white mt-0.5">
                {journey.startLocation} → {journey.destination}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#0f172a] p-3.5 rounded-xl border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 dark:text-stone-300 block mb-0.5">Planned Arrival</span>
                <span className="font-semibold text-white dark:text-stone-100">
                  {new Date(journey.plannedArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-300 block mb-0.5">Last Check-in</span>
                <span className="font-semibold text-white dark:text-stone-100">
                  {journey.lastCheckIn
                    ? new Date(journey.lastCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Awaiting first'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-300 block mb-0.5">Vehicle / License</span>
                <span className="font-semibold font-mono text-white dark:text-stone-100">
                  {journey.vehicleRegistration || 'Not provided'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 dark:text-stone-300 block mb-0.5">Ride Provider</span>
                <span className="font-semibold text-white dark:text-stone-100">
                  {journey.rideProvider || 'Direct Commute'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>This trip is currently monitored. This link refreshes automatically.</span>
            </div>

            <div className="text-[11px] text-stone-400 dark:text-stone-300 text-center">
              Shared securely via ShieldSafe. No personal account or login required.
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};



