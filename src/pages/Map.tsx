import { useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CAMP_CENTER, CAMP_POINTS } from '../data/campMap';

// === FIX иконок Leaflet ===
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LatLng = [number, number];

function MapClick({
  onClick,
}: {
  onClick: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Map() {
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const [query, setQuery] = useState('');
  const mapRef = useRef<L.Map | null>(null);

  const filteredPoints = CAMP_POINTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  function flyTo(lat: number, lng: number) {
    mapRef.current?.flyTo([lat, lng], 18, { duration: 0.6 });
  }

  return (
    <div className="fixed inset-0 bg-white">
      {/* 🟧 ВЕРХНЯЯ ПЛАШКА */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3 pointer-events-none">
        <div className="rounded-2xl bg-orange-500 text-white px-4 py-3 shadow-md pointer-events-auto text-center">
          <div className="text-sm font-bold uppercase tracking-wide">
            КАРТА ЛАГЕРЯ
          </div>
          <div className="text-xs opacity-90 mb-2">
            Нажми на карту или найди объект
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: сцена, корпус, столовая…"
            className="w-full rounded-xl px-3 py-2 text-sm text-gray-800 outline-none"
          />

          {query && (
            <div className="mt-2 max-h-40 overflow-auto rounded-xl bg-white text-gray-800 text-left">
              {filteredPoints.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-400">
                  Ничего не найдено
                </div>
              )}

              {filteredPoints.map((p) => (
                <button
                  key={p.id}
                  onClick={() => flyTo(p.lat, p.lng)}
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
          ref={mapRef}
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

          {/* 📍 Мы здесь */}
          {currentPos && (
            <Marker position={currentPos}>
              <Popup>
                <div className="text-sm font-semibold text-orange-600">
                  Мы здесь
                </div>
                <div className="text-xs text-gray-500">
                  Текущая точка
                </div>
              </Popup>
            </Marker>
          )}

          {/* 🏕 Объекты лагеря */}
          {CAMP_POINTS.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="text-sm font-semibold text-gray-800">
                  {p.name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
