import { useEffect, useState } from 'react';
import { mockTripData } from '../utils/mockTripData'; // Import the mock data
import Map from '../components/map';

const Trip = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(mockTripData);
  }, []);

  return (
    <div className="container">
      <Map locations={locations} />
    </div>
  );
};

export default Trip;