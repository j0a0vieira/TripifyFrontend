import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the Map component with SSR disabled
const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false });

const Map = ({ locations }) => {
  return (
    <div>
      <DynamicMap locations={locations} />
      <div className="destination-list">
        <ul>
          {locations.map((location, index) => (
            <li key={index}>
              <strong>{location.name}</strong><br />
              {location.description} - {location.pos}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;
