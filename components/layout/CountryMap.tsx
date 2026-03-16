'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Country {
  code: string;
  name: string;
  flag: string;
  active: boolean;
  coords: [number, number];
}

interface CountryMapProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
  selectedCountry: Country | null;
}

// Custom marker icons
const createFlagIcon = (flag: string, active: boolean) => {
  return L.divIcon({
    className: 'custom-flag-marker',
    html: `<div class="flag-marker ${active ? 'active' : 'inactive'}">${flag}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to fit bounds
function FitBounds({ countries }: { countries: Country[] }) {
  const map = useMap();

  useEffect(() => {
    if (countries.length > 0) {
      const bounds = L.latLngBounds(countries.map(c => c.coords));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, countries]);

  return null;
}

export default function CountryMap({ countries, onCountryClick, selectedCountry }: CountryMapProps) {
  return (
    <>
      <style jsx global>{`
        .flag-marker {
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: transform 0.2s;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .flag-marker:hover {
          transform: scale(1.3);
        }
        .flag-marker.active {
          animation: pulse 2s infinite;
        }
        .flag-marker.inactive {
          filter: grayscale(0.5) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          opacity: 0.7;
        }
        .flag-marker.inactive:hover {
          filter: grayscale(0) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          opacity: 1;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .country-popup {
          padding: 12px 16px;
          text-align: center;
        }
        .country-popup-flag {
          font-size: 32px;
          margin-bottom: 4px;
        }
        .country-popup-name {
          font-weight: 600;
          font-size: 14px;
          color: #111;
        }
        .country-popup-status {
          font-size: 11px;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
        }
        .country-popup-status.active {
          background: #0066CC;
          color: white;
        }
        .country-popup-status.inactive {
          background: #e5e5e5;
          color: #666;
        }
      `}</style>

      <MapContainer
        center={[-15, -60]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds countries={countries} />

        {countries.map((country) => (
          <Marker
            key={country.code}
            position={country.coords}
            icon={createFlagIcon(country.flag, country.active)}
            eventHandlers={{
              click: () => onCountryClick(country),
            }}
          >
            <Popup>
              <div className="country-popup">
                <div className="country-popup-flag">{country.flag}</div>
                <div className="country-popup-name">{country.name}</div>
                <div className={`country-popup-status ${country.active ? 'active' : 'inactive'}`}>
                  {country.active ? '✓ Disponible' : 'Próximamente'}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
