import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapaInteractivoProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  onMapLinkGenerated: (link: string) => void;
}

// Custom ReservaGol marker icon
const createCustomIcon = () => {
  const svgIcon = `
    <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <!-- Pin background -->
      <path d="M20 2C11.2 2 4 9.2 4 18c0 8.8 16 28 16 28s16-19.2 16-28c0-8.8-7.2-16-16-16z" 
            fill="#39ff14" stroke="#2dd10f" stroke-width="2" filter="url(#shadow)"/>
      <!-- White circle background for soccer ball -->
      <circle cx="20" cy="18" r="9" fill="white" stroke="#ddd" stroke-width="1"/>
      <!-- Custom soccer ball SVG -->
      <foreignObject x="11" y="9" width="18" height="18">
        <img src="/assets/pelota.svg" width="18" height="18" style="display: block;"/>
      </foreignObject>
    </svg>
  `;
  
  return new L.DivIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });
};

const customIcon = createCustomIcon();

// Component for handling map events
const MapEventHandler: React.FC<{ onLocationChange: (lat: number, lng: number) => void }> = ({ onLocationChange }) => {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Component for updating map view
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapaInteractivo: React.FC<MapaInteractivoProps> = ({
  lat,
  lng,
  onLocationChange,
  onMapLinkGenerated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lat, lng });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentPosition({ lat, lng });
    generateMapLink(lat, lng);
  }, [lat, lng]);

  const generateMapLink = (latitude: number, longitude: number) => {
    const link = `https://maps.google.com/?q=${latitude},${longitude}`;
    onMapLinkGenerated(link);
  };

  const searchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ar&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando sugerencias:', error);
    }
  }, []);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchSuggestions(value);
    }, 300);
  };

  const selectSuggestion = (suggestion: any) => {
    const newLat = parseFloat(suggestion.lat);
    const newLng = parseFloat(suggestion.lon);
    
    setCurrentPosition({ lat: newLat, lng: newLng });
    onLocationChange(newLat, newLng, suggestion.display_name);
    generateMapLink(newLat, newLng);
    
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en este navegador.');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        
        setCurrentPosition({ lat: newLat, lng: newLng });
        onLocationChange(newLat, newLng);
        generateMapLink(newLat, newLng);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
        setIsSearching(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleMarkerDrag = (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setCurrentPosition({ lat: position.lat, lng: position.lng });
    onLocationChange(position.lat, position.lng);
    generateMapLink(position.lat, position.lng);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Buscador */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Buscar dirección (ej: Av. Corrientes, Buenos Aires)"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: showSuggestions ? '8px 8px 0 0' : '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            />
            
            {/* Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ 
                      color: 'var(--text-primary)', 
                      fontWeight: '500',
                      marginBottom: '0.25rem'
                    }}>
                      <i className="fas fa-map-marker-alt" style={{ 
                        marginRight: '0.5rem', 
                        color: 'var(--primary-color)' 
                      }} />
                      {suggestion.name || suggestion.display_name.split(',')[0]}
                    </div>
                    <div style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.85rem'
                    }}>
                      {suggestion.display_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={detectCurrentLocation}
            disabled={isSearching}
            style={{
              background: isSearching ? 'var(--text-secondary)' : 'var(--primary-color)',
              color: 'var(--bg-dark)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              minWidth: '50px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            title="Detectar mi ubicación"
          >
            <i className={isSearching ? "fas fa-spinner fa-spin" : "fas fa-crosshairs"} />
          </button>
        </div>
        
        {/* Overlay para cerrar sugerencias */}
        {showSuggestions && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999
            }}
            onClick={() => setShowSuggestions(false)}
          />
        )}
      </div>

      {/* Mapa interactivo con Leaflet */}
      <div style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        border: '2px solid var(--border-color)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <MapContainer
          center={[currentPosition.lat, currentPosition.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEventHandler onLocationChange={(lat, lng) => {
            setCurrentPosition({ lat, lng });
            onLocationChange(lat, lng);
            generateMapLink(lat, lng);
          }} />
          <MapUpdater center={[currentPosition.lat, currentPosition.lng]} />
          <Marker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag
            }}
          />
        </MapContainer>
        
        {/* Información de coordenadas */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          zIndex: 500,
          backdropFilter: 'blur(4px)'
        }}>
          {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
        </div>

        {/* Instrucciones */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(57, 255, 20, 0.95)',
          color: 'var(--bg-dark)',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '600',
          maxWidth: '200px',
          textAlign: 'center',
          zIndex: 500,
          backdropFilter: 'blur(4px)'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }} />
          Haz clic o arrastra el pin
        </div>
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-lightbulb" style={{ color: 'var(--primary-color)' }} />
          <strong>Consejos:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Busca por dirección aproximada y luego ajusta con el pin</li>
          <li>Usa el botón de ubicación para detectar tu posición actual</li>
          <li>Haz clic en el mapa para posicionar exactamente tu predio</li>
          <li>Las coordenadas se actualizan automáticamente</li>
        </ul>
      </div>

      <style>{`
        .leaflet-container {
          border-radius: 12px;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          z-index: 400 !important;
        }
        .leaflet-control-zoom a {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-color) !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--bg-secondary) !important;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
          cursor: grab;
          transition: transform 0.2s ease;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        .custom-marker:active {
          cursor: grabbing;
          transform: scale(1.05);
        }
        .custom-marker svg {
          animation: bounce 2s infinite;
        }
        .custom-marker img {
          pointer-events: none;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default MapaInteractivo;