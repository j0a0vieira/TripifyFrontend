import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the Map component with SSR disabled
const DynamicMap = dynamic(() => import('./dynamicMap'), { ssr: false });

const Map = ({ locations }) => {
  return (
    <div>
      <DynamicMap locations={locations} />
    </div>
  );
};

export default Map;
