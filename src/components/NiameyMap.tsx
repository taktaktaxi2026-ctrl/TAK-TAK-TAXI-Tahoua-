import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useApp } from '../context/AppContext';
import { NIAMEY_CENTER, NIAMEY_LANDMARKS } from '../data/niameyData';
import {
  ShieldAlert,
  Layers,
  Navigation,
  MapPin,
  Search,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Car,
  Bike,
  Footprints,
  Sparkles,
  X,
  Loader2,
  Eye
} from 'lucide-react';

interface LandmarkSelectProps {
  onSelectLandmark?: (nom: string, lat: number, lng: number) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const NiameyMap: React.FC<LandmarkSelectProps> = ({ onSelectLandmark }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const departureMarkerRef = useRef<maplibregl.Marker | null>(null);
  const arrivalMarkerRef = useRef<maplibregl.Marker | null>(null);
  const landmarkMarkersRef = useRef<maplibregl.Marker[]>([]);
  const driverMarkersRef = useRef<maplibregl.Marker[]>([]);
  const flightAnimRef = useRef<number | null>(null);

  const { chauffeurs, activeCourse, setIsSosModalOpen } = useApp();

  // State
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');
  const [is3DMode, setIs3DMode] = useState(false);
  const [transportMode, setTransportMode] = useState<'driving' | 'biking' | 'walking'>('driving');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTarget, setSearchTarget] = useState<'departure' | 'arrival'>('arrival');

  // Route points & info
  const [departure, setDeparture] = useState<{ lat: number; lng: number; address: string } | null>(() => {
    if (activeCourse) {
      return { lat: activeCourse.departLat, lng: activeCourse.departLng, address: activeCourse.departNom };
    }
    return { lat: 13.5178, lng: 2.1156, address: 'Grand Marché de Niamey' };
  });

  const [arrival, setArrival] = useState<{ lat: number; lng: number; address: string } | null>(() => {
    if (activeCourse) {
      return { lat: activeCourse.arriveeLat, lng: activeCourse.arriveeLng, address: activeCourse.arriveeNom };
    }
    return { lat: 13.5042, lng: 2.1065, address: 'Pont Kennedy' };
  });

  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
    priceFcfa: number;
    coordinates: [number, number][];
  } | null>(null);

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isFlightActive, setIsFlightActive] = useState(false);
  const [isFlightPaused, setIsFlightPaused] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // Synchronize with activeCourse if present
  useEffect(() => {
    if (activeCourse) {
      setDeparture({
        lat: activeCourse.departLat,
        lng: activeCourse.departLng,
        address: activeCourse.departNom
      });
      setArrival({
        lat: activeCourse.arriveeLat,
        lng: activeCourse.arriveeLng,
        address: activeCourse.arriveeNom
      });
    }
  }, [activeCourse]);

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // CartoDB Dark Matter style definition for MapLibre
    const darkStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: darkStyle,
      center: [NIAMEY_CENTER.lng, NIAMEY_CENTER.lat],
      zoom: 13,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Force map resize on load
    map.on('load', () => {
      map.resize();
    });

    // Map click handler to set departure or arrival
    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      performReverseGeocode(lat, lng);
    });

    return () => {
      if (flightAnimRef.current) cancelAnimationFrame(flightAnimRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle ResizeObserver for tab/container resizes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Change Map Style (Dark / Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const darkStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256
        }
      },
      layers: [{ id: 'carto-dark-layer', type: 'raster', source: 'carto-dark' }]
    };

    const satelliteStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'esri-sat': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256
        },
        'esri-sat-labels': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256
        }
      },
      layers: [
        { id: 'esri-sat-layer', type: 'raster', source: 'esri-sat' },
        { id: 'esri-sat-labels-layer', type: 'raster', source: 'esri-sat-labels' }
      ]
    };

    map.setStyle(mapStyle === 'dark' ? darkStyle : satelliteStyle);

    // Re-draw route line after style load
    map.once('style.load', () => {
      if (routeInfo && routeInfo.coordinates) {
        drawRouteLayer(routeInfo.coordinates);
      }
      map.resize();
    });
  }, [mapStyle]);

  // 3. Toggle 3D Mode
  const toggle3DMode = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (is3DMode) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      setIs3DMode(false);
    } else {
      map.easeTo({ pitch: 60, bearing: -25, zoom: Math.max(map.getZoom(), 14), duration: 1200 });
      setIs3DMode(true);
    }
  };

  // 4. Reverse Geocode via Nominatim
  const performReverseGeocode = async (lat: number, lng: number) => {
    setGeocodingLoading(true);
    let address = `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          address = parts.slice(0, 3).join(', ').trim();
        }
      }
    } catch {
      // Fallback
    } finally {
      setGeocodingLoading(false);
    }

    if (searchTarget === 'departure' || !departure) {
      setDeparture({ lat, lng, address });
    } else {
      setArrival({ lat, lng, address });
    }
  };

  // 5. Search Address Autocomplete via Nominatim
  const handleSearchSubmit = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryStr + ' Niamey Niger'
        )}&countrycodes=ne&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data || []);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name.split(',').slice(0, 2).join(', ');

    if (searchTarget === 'departure') {
      setDeparture({ lat, lng, address });
    } else {
      setArrival({ lat, lng, address });
    }

    setSearchResults([]);
    setSearchQuery('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 });
    }
  };

  // 6. Calculate Route via OSRM API
  useEffect(() => {
    if (!departure || !arrival) return;

    const fetchOSRMRoute = async () => {
      setIsCalculatingRoute(true);
      const osrmProfile = transportMode === 'walking' ? 'foot' : transportMode === 'biking' ? 'bike' : 'driving';

      try {
        const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${departure.lng},${departure.lat};${arrival.lng},${arrival.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          if (data && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates: [number, number][] = route.geometry.coordinates;
            const distanceKm = Number((route.distance / 1000).toFixed(1));
            const durationMin = Math.max(1, Math.round(route.duration / 60));
            // Calculate FCFA price (1000 base + 150/km)
            const priceFcfa = Math.max(1000, Math.round((1000 + distanceKm * 150) / 100) * 100);

            setRouteInfo({ distanceKm, durationMin, priceFcfa, coordinates });
            drawRouteLayer(coordinates);
            return;
          }
        }
      } catch {
        // Fallback straight-line coordinates
      } finally {
        setIsCalculatingRoute(false);
      }

      // Fallback direct line calculation
      const R = 6371; // Earth radius in km
      const dLat = ((arrival.lat - departure.lat) * Math.PI) / 180;
      const dLon = ((arrival.lng - departure.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((departure.lat * Math.PI) / 180) *
          Math.cos((arrival.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = Number((R * c).toFixed(1));
      const dur = Math.max(2, Math.round(dist * 3));
      const price = Math.max(1000, Math.round((1000 + dist * 150) / 100) * 100);

      const straightCoords: [number, number][] = [
        [departure.lng, departure.lat],
        [arrival.lng, arrival.lat]
      ];

      setRouteInfo({ distanceKm: dist, durationMin: dur, priceFcfa: price, coordinates: straightCoords });
      drawRouteLayer(straightCoords);
    };

    fetchOSRMRoute();
  }, [departure, arrival, transportMode]);

  // Draw GeoJSON Route line on MapLibre
  const drawRouteLayer = (coords: [number, number][]) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords
      }
    };

    if (map.getSource('route-src')) {
      (map.getSource('route-src') as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource('route-src', {
        type: 'geojson',
        data: geojson
      });

      // Outer Glow layer
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#D4AF37',
          'line-width': 10,
          'line-opacity': 0.35
        }
      });

      // Inner Core Line
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#FFD700',
          'line-width': 5
        }
      });
    }

    // Fit map bounds to route
    if (coords.length > 0) {
      const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
      coords.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 1000 });
    }
  };

  // 7. Render Departure & Arrival Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Departure Marker (Draggable)
    if (departure) {
      if (departureMarkerRef.current) {
        departureMarkerRef.current.setLngLat([departure.lng, departure.lat]);
      } else {
        const depEl = document.createElement('div');
        depEl.className = 'custom-dep-pin';
        depEl.innerHTML = `
          <div style="
            background: #10B981;
            color: #fff;
            font-weight: 900;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 11px;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.6);
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: grab;
          ">
            <span>🟢</span> Départ
          </div>
        `;

        const marker = new maplibregl.Marker({ element: depEl, draggable: true })
          .setLngLat([departure.lng, departure.lat])
          .addTo(map);

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          performReverseGeocode(lngLat.lat, lngLat.lng);
        });

        departureMarkerRef.current = marker;
      }
    }

    // Arrival Marker (Draggable)
    if (arrival) {
      if (arrivalMarkerRef.current) {
        arrivalMarkerRef.current.setLngLat([arrival.lng, arrival.lat]);
      } else {
        const arrEl = document.createElement('div');
        arrEl.className = 'custom-arr-pin';
        arrEl.innerHTML = `
          <div style="
            background: #EF4444;
            color: #fff;
            font-weight: 900;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 11px;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.6);
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: grab;
          ">
            <span>🔴</span> Arrivée
          </div>
        `;

        const marker = new maplibregl.Marker({ element: arrEl, draggable: true })
          .setLngLat([arrival.lng, arrival.lat])
          .addTo(map);

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          performReverseGeocode(lngLat.lat, lngLat.lng);
        });

        arrivalMarkerRef.current = marker;
      }
    }
  }, [departure, arrival]);

  // 8. Render Landmarks & Drivers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old landmark markers (removed pinned landmark badges on map per user request)
    landmarkMarkersRef.current.forEach((m) => m.remove());
    landmarkMarkersRef.current = [];

    // Clear old driver markers
    driverMarkersRef.current.forEach((m) => m.remove());
    driverMarkersRef.current = [];

    // Render Drivers
    chauffeurs.forEach((driver) => {
      if (driver.statut !== 'en_ligne') return;

      const el = document.createElement('div');
      el.style.cssText = `
        background: #D4AF37;
        color: #000;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        box-shadow: 0 0 12px rgba(212, 175, 55, 0.8);
        border: 2px solid #000;
        cursor: pointer;
      `;
      el.innerHTML = '🚕';

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: inherit; color: #fff;">
          <h4 style="color: #D4AF37; font-weight: bold; margin: 0 0 2px 0;">Chauffeur TAK TAK TAXI</h4>
          <p style="margin: 0; font-weight: bold; font-size: 11px;">Plaque : ${driver.plaque}</p>
          <p style="margin: 2px 0 0 0; color: #aaa; font-size: 10px;">${driver.vehiculeModele}</p>
          <p style="margin: 2px 0 0 0; color: #4CAF50; font-size: 10px;">⭐ Note : ${driver.note}/5</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el }).setLngLat([driver.lng, driver.lat]).setPopup(popup).addTo(map);
      driverMarkersRef.current.push(marker);
    });
  }, [chauffeurs, onSelectLandmark]);

  // 9. Camera 3D Flight Mode Along Route (Survol 3D)
  const start3DFlightAnimation = () => {
    if (!routeInfo || !routeInfo.coordinates || routeInfo.coordinates.length < 2) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    setIsFlightActive(true);
    setIsFlightPaused(false);

    const coords = routeInfo.coordinates;
    let index = 0;
    const totalSteps = coords.length;

    map.flyTo({
      center: coords[0],
      zoom: 16,
      pitch: 65,
      bearing: calculateBearing(coords[0], coords[1]),
      duration: 1000
    });

    const stepAnimation = () => {
      if (index >= totalSteps - 1) {
        setIsFlightActive(false);
        setFlightProgress(100);
        return;
      }

      index += 1;
      const progressPercent = Math.round((index / totalSteps) * 100);
      setFlightProgress(progressPercent);

      const p1 = coords[index - 1];
      const p2 = coords[index];
      const heading = calculateBearing(p1, p2);

      map.easeTo({
        center: p2,
        pitch: 65,
        bearing: heading,
        duration: 400,
        easing: (t) => t
      });

      flightAnimRef.current = requestAnimationFrame(() => {
        setTimeout(stepAnimation, 450);
      });
    };

    setTimeout(stepAnimation, 1200);
  };

  const stop3DFlight = () => {
    if (flightAnimRef.current) cancelAnimationFrame(flightAnimRef.current);
    setIsFlightActive(false);
    setIsFlightPaused(false);
    setFlightProgress(0);

    if (mapInstanceRef.current && routeInfo && routeInfo.coordinates) {
      const bounds = new maplibregl.LngLatBounds(routeInfo.coordinates[0], routeInfo.coordinates[0]);
      routeInfo.coordinates.forEach((c) => bounds.extend(c));
      mapInstanceRef.current.fitBounds(bounds, { padding: 60, duration: 1000 });
      mapInstanceRef.current.easeTo({ pitch: is3DMode ? 60 : 0, duration: 1000 });
    }
  };

  // Helper function to calculate camera bearing heading between two points
  const calculateBearing = (p1: [number, number], p2: [number, number]) => {
    const lat1 = (p1[1] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    const dLon = ((p2[0] - p1[0]) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 1. Header Control Panel (Search & Target Selector) - Above map canvas */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-3 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Point à définir :</span>
            <button
              type="button"
              onClick={() => setSearchTarget('departure')}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition ${
                searchTarget === 'departure'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-white bg-[#121212]'
              }`}
            >
              🟢 Départ
            </button>
            <button
              type="button"
              onClick={() => setSearchTarget('arrival')}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition ${
                searchTarget === 'arrival'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'text-gray-400 hover:text-white bg-[#121212]'
              }`}
            >
              🔴 Arrivée
            </button>
          </div>
          {geocodingLoading && (
            <span className="text-amber-400 text-xs flex items-center gap-1 animate-pulse font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Localisation...
            </span>
          )}
        </div>

        {/* Address Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchSubmit(e.target.value);
            }}
            placeholder={
              searchTarget === 'departure'
                ? 'Rechercher départ (ex: Grand Marché, Aéroport)...'
                : 'Rechercher destination (ex: Pont Kennedy, Wadata)...'
            }
            className="w-full bg-[#121212] border border-[#333] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-color)]"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#121212] border border-[#333] rounded-xl divide-y divide-[#262626] shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
              {searchResults.map((res) => (
                <button
                  key={res.place_id}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2.5 hover:bg-[#262626] transition text-xs text-gray-200 flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{res.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Clear Map Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#262626] shadow-2xl bg-[#0F0F0F] select-none">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating 3D & Style Controls (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <button
            onClick={toggle3DMode}
            className={`w-9 h-9 rounded-xl border shadow-lg flex items-center justify-center backdrop-blur-md transition ${
              is3DMode
                ? 'bg-[var(--accent-color)] text-black font-bold border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                : 'bg-[#1C1C1C]/90 text-white border-[#333] hover:bg-[#262626]'
            }`}
            title="Vue 3D Immersive"
          >
            <Compass className={`w-4 h-4 ${is3DMode ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setMapStyle((prev) => (prev === 'dark' ? 'satellite' : 'dark'))}
            className="w-9 h-9 bg-[#1C1C1C]/90 hover:bg-[#262626] text-white rounded-xl border border-[#333] shadow-lg flex items-center justify-center backdrop-blur-md transition"
            title="Basculer Carte Sombre / Satellite"
          >
            <Layers className="w-4 h-4 text-[var(--accent-color)]" />
          </button>

          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo({
                  center: [NIAMEY_CENTER.lng, NIAMEY_CENTER.lat],
                  zoom: 13,
                  pitch: is3DMode ? 60 : 0,
                  duration: 1200
                });
              }
            }}
            className="w-9 h-9 bg-[#1C1C1C]/90 hover:bg-[#262626] text-white rounded-xl border border-[#333] shadow-lg flex items-center justify-center backdrop-blur-md transition"
            title="Centrer sur Niamey"
          >
            <Navigation className="w-4 h-4 text-[var(--accent-color)]" />
          </button>
        </div>

        {/* Bottom Floating SOS button inside map */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-red-400/40 text-xs transition"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* 3. Dedicated Itinerary & Route Info Card (Outside Map Canvas) */}
      {routeInfo && (
        <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#333]">
              <button
                type="button"
                onClick={() => setTransportMode('driving')}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 font-bold ${
                  transportMode === 'driving' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'
                }`}
                title="Voiture / Taxi"
              >
                <Car className="w-3.5 h-3.5" />
                <span className="text-[10px]">Taxi</span>
              </button>
              <button
                type="button"
                onClick={() => setTransportMode('biking')}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 font-bold ${
                  transportMode === 'biking' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'
                }`}
                title="Moto"
              >
                <Bike className="w-3.5 h-3.5" />
                <span className="text-[10px]">Moto</span>
              </button>
              <button
                type="button"
                onClick={() => setTransportMode('walking')}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 font-bold ${
                  transportMode === 'walking' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'
                }`}
                title="Piéton"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span className="text-[10px]">Pied</span>
              </button>
            </div>

            <div className="flex flex-col">
              <span className="font-black text-white text-sm text-[var(--accent-color)]">{routeInfo.priceFcfa} FCFA</span>
              <span className="text-[11px] text-gray-300 font-semibold">
                {routeInfo.distanceKm} km • ~{routeInfo.durationMin} min
              </span>
            </div>
          </div>

          <div>
            {!isFlightActive ? (
              <button
                onClick={start3DFlightAnimation}
                className="bg-[var(--accent-color)] hover:brightness-110 text-black font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Survol 3D</span>
              </button>
            ) : (
              <button
                onClick={stop3DFlight}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Stop ({flightProgress}%)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
