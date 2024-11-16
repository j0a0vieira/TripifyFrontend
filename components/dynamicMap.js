import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/map.module.css'; // Import custom styles (create this file)

const DynamicMap = ({ locations }) => {
    const center = locations.length ? [locations[0].latitude, locations[0].longitude] : [0, 0];
    const zoom = locations.length ? 12 : 6; // Zoom in if locations are available
  
    // Function to create a custom icon for each location
    const createIcon = (iconUrl) => {
      return L.icon({
        iconUrl: iconUrl,
        iconSize: [50, 50], // Adjust the size of the icon
        iconAnchor: [20, 40], // Adjust anchor to the center bottom
        popupAnchor: [0, -40], // Position of popup relative to the icon
        className: 'custom-icon' // Add a custom class for styling
      });
    };
  
    return (
      <MapContainer center={center} zoom={zoom} className={styles.mapContainer}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlvZ29sZW9uYXJkbyIsImEiOiJjbTNrcnZsMDEwaW9iMmxwZW1mZDhybnRzIn0.o3zaq7mYrcXG3bgiGMORdg"
          attribution='&copy; Tripify Planner'
        />
  
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            icon={createIcon(location.iconUrl)} // Use custom icons
          >
            <h2>{location.pos}</h2>
            <Popup className={styles.customPopup}>
              <div>
                <h3>{location.name}</h3>
                <img src={location.image} alt={location.name} className={styles.locationImage} />
                <p>{location.description}</p>
                <p><strong>Info:</strong> {location.additionalInfo}</p>
              </div>
            </Popup>
  
            {/* Floating number next to the pin */}
            <div className={styles.stopNumber}>
              {location.pos}
            </div>
          </Marker>
        ))}
  
        <Polyline
          positions={locations.map(loc => [loc.latitude, loc.longitude])}
          color="blue"
          weight={3}
          opacity={0.7}
          dashArray="5, 10"
        />
      </MapContainer>
    );
  };

export default DynamicMap;
