import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/map.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally

// Component to handle map centering when a button is clicked
const DestinationButton = ({ location }) => {
  const map = useMap();

  const handleClick = () => {
    // Set the map's view to the clicked location's coordinates
    map.setView([location.latitude, location.longitude], 14); // Adjust the zoom level if needed
  };

  return (
    <li>
      <button onClick={handleClick} className={styles.destinationButton}>
        <div className="d-flex">
          <h1 className="pe-2">{location.pos}</h1>
          <div>
            <strong className={styles.destinationButtonText}>{location.name}</strong><br/>
            {location.description}
          </div>
        </div>
      </button>
    </li>
  );
};

const DynamicMap = ({ locations }) => {
  // Set default coordinates for the map if locations is null or empty
  const defaultCenter = [38.7169, -9.1399]; // Default coordinates (e.g., Lisbon, Portugal)
  const center = locations && locations.length ? [locations[0].latitude, locations[0].longitude] : defaultCenter;
  const zoom = locations && locations.length ? 12 : 6;

  const createIcon = (stopNumber) => {
    return L.divIcon({
      className: styles.customIcon,
      html: `
        <div style=" width: 47px; height: 47px; background-image: url(./point.png); background-size: cover; background-position: center; border-radius: 50%">
          <h1 style="position: absolute; width: 30px; height: 30px; align-content: center; text-align: center; top: -10px; left: 95%; transform: translateX(-50%); color: white; font-size: 16px; font-weight: bold; margin: 0; background-color: #2a9d8f; border-radius: 50%">${stopNumber}</h1>
        </div>
      `,
      iconSize: [50, 50], // Adjust the icon size
      iconAnchor: [25, 50], // Anchor the icon's bottom center
      popupAnchor: [0, -40], // Adjust the position of the popup
    });
  };
  

  return (
    <MapContainer center={center} zoom={zoom} className={styles.mapContainer}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlvZ29sZW9uYXJkbyIsImEiOiJjbTNrcnZsMDEwaW9iMmxwZW1mZDhybnRzIn0.o3zaq7mYrcXG3bgiGMORdg"
        attribution='&copy; Tripify Planner'
      />

      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
          icon={createIcon(index+1)}
        >
          <Popup className={styles.customPopup}>
            <div>
              <h3>{location.name}</h3>
              <image src="./background.png" alt={location.name} className={styles.locationImage} />
              {location.formattedAddress && <p><strong>Endereço:</strong> {location.formattedAddress}</p>}
            </div>
          </Popup>

          <div className={styles.stopNumber}>
            {location.pos}
          </div>
        </Marker>
      ))}

      <div className={styles.destinationList}>
        <h2>RoadTrip List</h2>
        <ul>
          {locations.map((location, index) => (
            <DestinationButton key={index} location={location} />
          ))}
        </ul>
      </div>

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
