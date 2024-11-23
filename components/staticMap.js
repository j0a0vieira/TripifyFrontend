import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icon
import 'leaflet/dist/leaflet.css';
import styles from '../styles/map.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import React, { useEffect, useState } from 'react';

const FullScreenMap = ({ onMapClick, lockMap, type }) => {
  const center = [39, -7]; // Centro aproximado de Portugal
  const zoom = 8;

  const [startingPoint, setStartingPoint] = useState(null); // Estado para o ponto inicial
  const [destinationPoint, setDestinationPoint] = useState(null); // Estado para o ponto de destino
  const [locations, setLocations] = useState([]); // Para armazenar os dois pontos

 // Component to adjust map view based on selected points
 const FitBounds = ({ startingPoint, destinationPoint }) => {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (startingPoint && destinationPoint) {
      const bounds = L.latLngBounds([startingPoint, destinationPoint]);
      
      // Adjust the zoom and center with padding
      map.fitBounds(bounds, {
        padding: [400, 150], // Increase these numbers for more padding (left/right, top/bottom)
      });
    }
  }, [startingPoint, destinationPoint, map]);

  return null;
};

  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;

        if (type === 'start' && destinationPoint == null) {
          setStartingPoint([lat, lng]); // Define o ponto inicial
          setLocations([ [lat, lng] ]); // Apenas o ponto de partida no começo
        } else if (type === 'start' && destinationPoint != null) {
          setStartingPoint([lat, lng]); // Define o ponto inicial
          setLocations([ [lat, lng], destinationPoint ]); // Apenas o ponto de partida no começo
        } else if (type === 'destination') {
          setDestinationPoint([lat, lng]); // Define o ponto de destino
          setLocations([startingPoint, [lat, lng]]); // Atualiza para incluir o ponto de destino
        }
        lockMap();
        onMapClick(lat, lng);
      }
    });
    return null;
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer center={center} zoom={zoom} className={styles.mapContainer} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlvZ29sZW9uYXJkbyIsImEiOiJjbTNrcnZsMDEwaW9iMmxwZW1mZDhybnRzIn0.o3zaq7mYrcXG3bgiGMORdg"
          attribution='&copy; Tripify Planner'
        />
        
        <MapClickHandler />

        {/* Add FitBounds Component */}
        <FitBounds startingPoint={startingPoint} destinationPoint={destinationPoint} />

        {/* Renderiza apenas o marcador de ponto inicial */}
        {startingPoint && !destinationPoint && (
          <Marker 
            position={startingPoint} 
            icon={new L.Icon({
              iconUrl: './marker.png',
              iconSize: [75, 75],
              iconAnchor: [25, 50],
            })}
          />
        )}

        {/* Quando ambos os pontos (inicial e destino) forem definidos, renderiza ambos os marcadores e a linha */}
        {locations.length > 1 && (
          <>
            <Marker
              position={locations[0]} 
              icon={new L.Icon({
                iconUrl: './marker.png',
                iconSize: [75, 75],
                iconAnchor: [25, 50],
              })}
            />
            <Marker
              position={locations[1]} 
              icon={new L.Icon({
                iconUrl: './marker.png',
                iconSize: [75, 75],
                iconAnchor: [25, 50],
              })}
            />
            
            <Polyline
              positions={locations}
              color="blue"
              weight={3}
              opacity={0.7}
              dashArray="5, 10"
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default FullScreenMap;
