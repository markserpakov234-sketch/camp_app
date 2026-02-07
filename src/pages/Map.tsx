import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMP_CENTER, CAMP_POINTS } from '../data/campMap';

/* === FIX иконок Leaflet === */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LatLng = [number, number];

/* === ВСПОМОГАТЕЛЬНЫЕ === */

function MapClick({ onClick }: { onClick: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function FlyToPoint({ point }: { point: LatLng | null }) {
  const map = useMap();

  useEffect(() => {
    if (point) {
      map.flyTo(point, 18, { duration: 0.6 });
    }
  }, [point, map]);

  return null;
}

/* === SVG ИКОНКИ === */

const svgIcon = (path: string, bg: string) =>
  new L.DivIcon({
    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:18px;
        background:${bg};
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 6px 16px rgba(0,0,0,.25);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          ${path}
        </svg>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  });

const ICONS = {
  medical: svgIcon('<path d="M12 2v20M2 12h20" />', '#E11D48'),
  pool: svgIcon('<path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />', '#0EA5E9'),
  edu: svgIcon(
    '<path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" /><path d="M21 10v6" />',
    '#8B5CF6'
  ),
  food: svgIcon('<path d="M3 3h18v4H3z" /><path d="M8 7v14" />', '#F59E0B'),
  shop: svgIcon(
    '<path d="M6 2l1 5h10l1-5" /><path d="M3 7h18v13H3z" />',
    '#F97316'
  ),
  home: svgIcon('<path d="M3 12l9-9 9 9v9H3z" />', '#10B981'),
  gate: svgIcon('<path d="M6 3h12v18H6z" />', '#64748B'),
  sport: svgIcon('<path d="M4 20l16-16" /><path d="M14 4h6v6" />', '#22C55E'),
  default: svgIcon('<circle cx="12" cy="12" r="8" />', '#FB923C'),
};

function getIconByName(name: string) {
  const n = name.toLowerCase();
  if (n.includes('бассейн')) return ICONS.pool;
  if (n.includes('изолятор') || n.includes('анализ')) return ICONS.medical;
  if (n.includes('центр') || n.includes('мк')) return ICONS.edu;
  if (n.includes('магазин') || n.includes('сувенир')) return ICONS.shop;
  if (n.includes('столов')) return ICONS.food;
  if (n.includes('корпус') || n.includes('республика')) return ICONS.home;
  if (n.includes('ворота')) return ICONS.gate;
  if (n.includes('бфп') || n.includes('бп') || n.includes('мфп'))
    return ICONS.sport;
  return ICONS.default;
}

/* === КОМПОНЕНТ === */

export default function Map() {
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const [query, setQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const markerRefs = useRef<Record<string, L.Marker>>({});

  const filteredPoints = CAMP_POINTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (selectedId && markerRefs.current[selectedId]) {
      markerRefs.current[selectedId].openPopup();
    }
  }, [selectedId]);

  return (
    <div className="fixed inset-0 bg-white">
      {/* 🔝 ШАПКА */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-4 pt-3">
        <div className="relative rounded-2xl bg-orange-500 text-white px-4 py-3 shadow-lg">
          <div className="text-sm font-bold uppercase tracking-wide text-center">
            Карта лагеря
          </div>
          <div className="text-xs opacity-90 mb-2 text-center">
            Найди объект или нажми на карту
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: корпус, бассейн, магазин…"
            className="w-full rounded-xl px-3 py-2 text-sm text-gray-800 outline-none"
          />

          {query && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-56 overflow-auto rounded-xl bg-white text-gray-800 shadow-lg z-[2000]">
              {filteredPoints.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-400">
                  Ничего не найдено
                </div>
              )}

              {filteredPoints.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPoint([p.lat, p.lng]);
                    setSelectedId(p.id);
                    setQuery('');
                  }}
                  className="block w-full px-3 py-2 text-sm text-left hover:bg-orange-50"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🗺 КАРТА */}
      <div className="pt-28 h-full relative z-0">
        <MapContainer
          center={[CAMP_CENTER.lat, CAMP_CENTER.lng]}
          zoom={17}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClick onClick={setCurrentPos} />
          <FlyToPoint point={selectedPoint} />

          {currentPos && (
            <Marker position={currentPos} icon={ICONS.default}>
              <Popup>Мы здесь</Popup>
            </Marker>
          )}

          {CAMP_POINTS.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={getIconByName(p.name)}
              ref={(ref) => {
                if (ref) markerRefs.current[p.id] = ref;
              }}
            >
              <Popup>
                <div className="font-semibold">{p.name}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
