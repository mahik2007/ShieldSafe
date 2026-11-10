import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Filter,
  RefreshCw,
  Plus,
  ExternalLink,
  ThumbsUp,
  AlertTriangle,
  Layers,
  List,
  Map as MapIcon,
} from 'lucide-react';
import { api } from '../services/api';
import { Hazard } from '../types';
import { Button, Card, Badge, Alert } from '../components/UI';
import L from 'leaflet';

export const SafetyMapPage: React.FC = () => {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [filteredHazards, setFilteredHazards] = useState<Hazard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapError, setMapError] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [confirmStatus, setConfirmStatus] = useState<{ [id: number]: string }>({});

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: number]: any }>({});

  // Generate or fetch anonymous session ID for rate-preventing confirmations
  const sessionId = React.useMemo(() => {
    let sid = localStorage.getItem('shieldsafe_session_id');
    if (!sid) {
      sid = 'ss_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('shieldsafe_session_id', sid);
    }
    return sid;
  }, []);

  const fetchHazards = async () => {
    try {
      setLoading(true);
      const data = await api.getHazards();
      setHazards(data.hazards || []);
    } catch (err) {
      console.error('Failed to load hazards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHazards();
  }, []);

  // Filter hazards based on category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredHazards(hazards);
    } else {
      setFilteredHazards(hazards.filter((h) => h.category === selectedCategory));
    }
  }, [hazards, selectedCategory]);

  // Request browser location on demand
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Requesting browser permission...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('Location located.');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 14);
          if (typeof L !== 'undefined') {
            L.circleMarker([coords.lat, coords.lng], {
              radius: 8,
              fillColor: '#4f61e6',
              color: '#ffffff',
              weight: 3,
              fillOpacity: 1,
            })
              .addTo(mapInstanceRef.current)
              .bindPopup('Your Current Approximate Location')
              .openPopup();
          }
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err.message);
        setLocationStatus('Permission denied or location unavailable.');
      },
      { timeout: 8000 }
    );
  };

  // Initialize or re-render Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map') return;

    // Check if Leaflet is present in window
    if (typeof L === 'undefined') {
      setMapError(true);
      return;
    }

    try {
      if (!mapInstanceRef.current && mapContainerRef.current) {
        // Default center: Bengaluru demo cluster or initial coords
        const initialLat = 12.9716;
        const initialLng = 77.5946;

        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);

        // OpenStreetMap Tile Layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });

        tileLayer.on('tileerror', () => {
          console.warn('Map tiles failed to load. Showing list view option.');
          setMapError(true);
        });

        tileLayer.addTo(map);
        mapInstanceRef.current = map;
      }

      // Sync markers
      if (mapInstanceRef.current) {
        // Clear old markers
        Object.values(markersRef.current).forEach((m) => m.remove());
        markersRef.current = {};

        filteredHazards.forEach((hazard) => {
          const marker = L.circleMarker([hazard.latitude, hazard.longitude], {
            radius: 9,
            fillColor:
              hazard.category === 'broken-streetlight'
                ? '#f59e0b'
                : hazard.category === 'stray-dog'
                ? '#ef4444'
                : hazard.category === 'road-closure'
                ? '#8b5cf6'
                : '#3b82f6',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9,
          });

          marker.bindPopup(`
            <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 2px;">
              <strong style="color: #0f172a;">${hazard.title}</strong>
              <div style="color: #64748b; font-size: 11px; margin: 4px 0;">Category: ${hazard.category.replace('-', ' ')}</div>
              <p style="color: #334155; margin: 4px 0 8px 0;">${hazard.description}</p>
              <div style="font-size: 11px; color: #4f61e6; font-weight: 600;">Status: ${hazard.status}</div>
            </div>
          `);

          marker.on('click', () => {
            setSelectedHazard(hazard);
          });

          marker.addTo(mapInstanceRef.current);
          markersRef.current[hazard.id] = marker;
        });
      }
    } catch (e) {
      console.error('Error mounting Leaflet map:', e);
      setMapError(true);
    }
  }, [filteredHazards, viewMode]);

  // Confirm hazard handler
  const handleConfirmHazard = async (id: number) => {
    try {
      setConfirmStatus((prev) => ({ ...prev, [id]: 'Submitting...' }));
      const result = await api.confirmHazard(id, sessionId);
      setConfirmStatus((prev) => ({ ...prev, [id]: 'Confirmed! Thank you.' }));

      // Update local state
      setHazards((prev) =>
        prev.map((h) =>
          h.id === id
            ? { ...h, confirmationCount: result.confirmationCount, status: result.status as any }
            : h
        )
      );

      if (selectedHazard && selectedHazard.id === id) {
        setSelectedHazard((prev) =>
          prev ? { ...prev, confirmationCount: result.confirmationCount, status: result.status as any } : null
        );
      }
    } catch (err: any) {
      setConfirmStatus((prev) => ({ ...prev, [id]: err.message || 'Already confirmed.' }));
    }
  };

  const categories = [
    { id: 'all', label: 'All Hazards' },
    { id: 'broken-streetlight', label: 'Streetlight Issues' },
    { id: 'road-construction', label: 'Road Construction' },
    { id: 'road-closure', label: 'Road Closures' },
    { id: 'blocked-footpath', label: 'Blocked Footpaths' },
    { id: 'stray-dog', label: 'Stray Dogs' },
    { id: 'other', label: 'Other Hazards' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1424] p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[#00E5BE]" /> Local Safety Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Community-verified physical public hazards. Powered by OpenStreetMap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Map / List */}
          <div className="flex rounded-xl bg-[#080d18] p-1 border border-stone-700">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#00E5BE] text-[#070a12] shadow-md shadow-teal-500/20'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#00E5BE] text-[#070a12] shadow-md shadow-teal-500/20'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
          </div>

          <Button size="sm" variant="outline" onClick={fetchHazards} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          <Link to="/report-hazard">
            <Button size="sm" variant="primary" className="gap-1.5 font-bold shadow-md shadow-teal-500/20">
              <Plus className="w-4 h-4" /> Report Hazard
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Filter Pills & Location Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0d1424] p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#00E5BE] text-[#070a12] shadow-md shadow-teal-500/20'
                  : 'bg-[#141f33] text-stone-200 hover:bg-[#1c2a44] hover:text-white border border-stone-700/60'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
          <button
            onClick={handleRequestLocation}
            className="text-[#00E5BE] font-semibold hover:text-teal-300 flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" /> Locate Me
          </button>
          {locationStatus && <span className="text-stone-400 dark:text-stone-300 text-[11px]">{locationStatus}</span>}
        </div>
      </div>

      {/* Map Error Banner if OpenStreetMap fails or offline */}
      {mapError && viewMode === 'map' && (
        <Alert type="warning" title="Map Tiles Offline or Unreachable">
          External OpenStreetMap tiles could not be reached. You can switch to the{' '}
          <button
            onClick={() => setViewMode('list')}
            className="font-bold underline text-amber-900 hover:text-amber-950"
          >
            List View
          </button>{' '}
          to see and interact with all registered hazards.
        </Alert>
      )}

      {/* Main View Area: Leaflet Map or Accessible List */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2 bg-[#0d1424] rounded-2xl border border-stone-800 p-2 overflow-hidden shadow-sm">
            <div
              ref={mapContainerRef}
              className="w-full h-[520px] rounded-xl z-10 bg-[#141f33]"
              style={{ minHeight: '520px' }}
            />
            <div className="p-3 text-[11px] text-stone-400 dark:text-stone-300 flex items-center justify-between">
              <span>Markers: Amber = Streetlights, Red = Dogs, Purple = Closures, Blue = Footpaths</span>
              <span>Click any marker to inspect</span>
            </div>
          </div>

          {/* Selected Hazard Detail / Quick List Panel */}
          <div className="space-y-4">
            {selectedHazard ? (
              <Card className="border-teal-500/30 ring-2 ring-teal-600/10">
                <div className="flex items-start justify-between">
                  <Badge
                    variant={
                      selectedHazard.status === 'community-confirmed'
                        ? 'emerald'
                        : selectedHazard.status === 'resolved'
                        ? 'slate'
                        : 'amber'
                    }
                  >
                    {selectedHazard.status}
                  </Badge>
                  {selectedHazard.isDemoData && (
                    <span className="text-[10px] font-semibold text-stone-300 bg-[#141f33] px-2 py-0.5 rounded-full">
                      Seeded Demo
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white  text-lg mt-3">{selectedHazard.title}</h3>
                <p className="text-xs text-stone-300 uppercase tracking-wider font-semibold mt-1">
                  Category: {selectedHazard.category.replace('-', ' ')}
                </p>

                <p className="text-sm text-stone-200 dark:text-stone-300 mt-3 leading-relaxed bg-[#0f172a] p-3 rounded-xl border border-stone-800">
                  {selectedHazard.description}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Coordinates:</span>
                    <span className="font-mono text-stone-100 ">
                      {selectedHazard.latitude.toFixed(4)}, {selectedHazard.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Community Confirmations:</span>
                    <span className="font-bold text-white ">{selectedHazard.confirmationCount}</span>
                  </div>

                  {/* Open Directions externally */}
                  <a
                    href={`https://www.openstreetmap.org/directions?from=&to=${selectedHazard.latitude}%2C${selectedHazard.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <ExternalLink className="w-3.5 h-3.5" /> View on OpenStreetMap
                    </Button>
                  </a>

                  {/* Confirm Hazard Button */}
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleConfirmHazard(selectedHazard.id)}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Confirm Hazard
                  </Button>

                  {confirmStatus[selectedHazard.id] && (
                    <div className="text-xs text-center font-medium text-[#00E5BE]">
                      {confirmStatus[selectedHazard.id]}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <MapPin className="w-8 h-8 text-stone-400  mx-auto mb-3" />
                <h4 className="font-semibold text-white  text-sm">Select a Hazard Marker</h4>
                <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
                  Click any marker on the map to review details, coordinates, and confirm reports.
                </p>
              </Card>
            )}

            {/* Proximity Notice */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-500/30 dark:border-teal-900/50 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
              <span className="font-bold">Community Responsibility:</span> Please confirm hazards only if you have
              directly observed them recently. False reports mislead other commuters.
            </div>
          </div>
        </div>
      ) : (
        /* Accessible List View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHazards.map((h) => (
              <Card key={h.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white  text-base">{h.title}</h3>
                    <Badge
                      variant={
                        h.status === 'community-confirmed'
                          ? 'emerald'
                          : h.status === 'resolved'
                          ? 'slate'
                          : 'amber'
                      }
                    >
                      {h.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-[#00E5BE] font-semibold mt-1 capitalize">
                    {h.category.replace('-', ' ')}
                  </div>

                  <p className="text-xs text-stone-200 dark:text-stone-300 mt-2 leading-relaxed">{h.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-xs text-stone-300">
                    <span className="font-bold text-stone-100 ">{h.confirmationCount}</span> confirmation(s)
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.openstreetmap.org/directions?from=&to=${h.latitude}%2C${h.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="ghost" className="p-1.5" title="Open Directions">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfirmHazard(h.id)}
                      className="gap-1 text-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Confirm
                    </Button>
                  </div>
                </div>

                {confirmStatus[h.id] && (
                  <div className="text-[11px] text-right font-medium text-[#00E5BE] mt-1">
                    {confirmStatus[h.id]}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};




