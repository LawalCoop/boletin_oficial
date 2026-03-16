'use client';

import { useState, useEffect } from 'react';
import { X, Construction, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';

interface Country {
  code: string;
  name: string;
  flag: string;
  active: boolean;
  coords: [number, number]; // [lat, lng]
}

const countries: Country[] = [
  { code: 'ar', name: 'Argentina', flag: '🇦🇷', active: true, coords: [-34.6, -58.4] },
  { code: 'br', name: 'Brasil', flag: '🇧🇷', active: false, coords: [-15.8, -47.9] },
  { code: 'cl', name: 'Chile', flag: '🇨🇱', active: false, coords: [-33.4, -70.6] },
  { code: 'uy', name: 'Uruguay', flag: '🇺🇾', active: false, coords: [-34.9, -56.2] },
  { code: 'py', name: 'Paraguay', flag: '🇵🇾', active: false, coords: [-25.3, -57.6] },
  { code: 'bo', name: 'Bolivia', flag: '🇧🇴', active: false, coords: [-16.5, -68.1] },
  { code: 'pe', name: 'Perú', flag: '🇵🇪', active: false, coords: [-12.0, -77.0] },
  { code: 'co', name: 'Colombia', flag: '🇨🇴', active: false, coords: [4.7, -74.1] },
  { code: 'mx', name: 'México', flag: '🇲🇽', active: false, coords: [19.4, -99.1] },
  { code: 'es', name: 'España', flag: '🇪🇸', active: false, coords: [40.4, -3.7] },
];

// Dynamic import for the map to avoid SSR issues
const MapComponent = dynamic(() => import('./CountryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-bg-surface animate-pulse flex items-center justify-center">
      <span className="text-text-muted">Cargando mapa...</span>
    </div>
  ),
});

export function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryClick = (country: Country) => {
    if (country.active) {
      setIsOpen(false);
    } else {
      setSelectedCountry(country);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Flag button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-surface transition-colors"
        title="Cambiar país"
      >
        <span className="text-xl">🇦🇷</span>
        <span className="hidden lg:flex items-center gap-1 text-xs text-text-muted">
          <Globe className="w-3 h-3" />
          Cambiar país
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setSelectedCountry(null); }}
          />

          {/* Content */}
          <div className="relative bg-bg rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary">
                  Boletines oficiales del mundo
                </h2>
                <p className="text-sm text-text-muted mt-0.5">
                  Tocá un país en el mapa para ver su boletín oficial
                </p>
              </div>
              <button
                onClick={() => { setIsOpen(false); setSelectedCountry(null); }}
                className="p-2 hover:bg-bg-surface rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Map */}
            <div className="relative h-[400px]">
              <MapComponent
                countries={countries}
                onCountryClick={handleCountryClick}
                selectedCountry={selectedCountry}
              />

              {/* "En construcción" overlay */}
              {selectedCountry && !selectedCountry.active && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-in fade-in duration-200">
                  <div className="bg-bg rounded-xl p-6 text-center max-w-xs mx-4 shadow-xl">
                    <span className="text-5xl mb-3 block">{selectedCountry.flag}</span>
                    <Construction className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-2">
                      {selectedCountry.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      Estamos trabajando para traerte el boletín oficial de {selectedCountry.name}. ¡Pronto!
                    </p>
                    <button
                      onClick={() => setSelectedCountry(null)}
                      className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Volver al mapa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with legend */}
            <div className="p-4 bg-bg-surface border-t border-border">
              <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent"></span>
                  <span>Activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  <span>Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
