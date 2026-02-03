import { useState } from 'react';
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
  if (point) map.flyTo(point, 18, { duration: 0.6 });
  return null;
}

/* === ИКОНКИ В СТИЛЕ VITA === */
const icon = (emoji: string, bg: string) =>
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
        box-shadow:0 4px 10px rgba(0,0,0,.25);
        font-size:18px;
        color:white;
      ">${emoji}</div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  });

const ICONS = {
  medical: icon('🩺', '#E11D48'),
  pool: icon('🏊', '#0EA5E9'),
  edu: icon('🧠', '#8B5CF6'),
  food: icon('🍽', '#F59E0B'),
  shop: icon('🛍', '#F97316'),
  home: icon('🏠', '#10B981'),
  gate: icon('🚪', '#64748B'),
  sport: icon('🏃', '#22C55E'),
  default: icon('📍', '#FB923C'),
};

function getIconByName(name: string) {
  const n = name.toLowerCase();
  if (n.includes('бассейн')) return ICONS.pool;
  if (n.includes('изолятор') || n.includes('анализ')) return ICONS.medical;
  if (n.includes('центр') || n.includes('мк')) return ICONS.edu;
  if (n.includes('магазин') || n.includes('сувенир')) return ICONS.shop;
  if (n.includes('кают') || n.includes('столов')) return ICONS.food;
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

  const filteredPoints = CAMP_POINTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white">
      {/* 🟧 ВЕРХ */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-3 pointer-events-none">
        <div className="rounded-2xl bg-orange-500 text-white px-4 py-3 shadow-lg pointer-events-auto text-center">
          <div className="text-sm font-bold uppercase tracking-wide">
            КАРТА ЛАГЕРЯ
          </div>
          <div className="text-xs opacity-90 mb-2">
            Найди объект или нажми на карту
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: корпус, бассейн, магазин…"
            className="w-full rounded-xl px-3 py-2 text-sm text-gray-800 outline-none"
          />

          {query && (
            <div className="mt-2 max-h-48 overflow-auto rounded-xl bg-white text-gray-800 text-left">
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
                    setQuery('');
                  }}
                  className="block w-full px-3 py-2 text-sm hover:bg-orange-50"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🗺 КАРТА */}
      <div className="pt-28 h-full">
        <MapContainer
          center={[CAMP_CENTER.lat, CAMP_CENTER.lng]}
          zoom={17}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
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
