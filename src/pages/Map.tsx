import { useState } from 'react';
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

export default function Map() {
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);

  function MapClick() {
    useMapEvents({
      click(e) {
        setCurrentPos([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
      }}
    >
      <MapContainer
        center={[CAMP_CENTER.lat, CAMP_CENTER.lng]}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClick />

        {/* Мы здесь */}
        {currentPos && (
          <Marker position={currentPos}>
            <Popup>Мы здесь</Popup>
          </Marker>
        )}

        {/* Объекты лагеря */}
        {CAMP_POINTS.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.name}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
