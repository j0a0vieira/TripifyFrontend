import { useEffect, useState } from 'react';
import { mockTripData } from '../utils/mockTripData'; // Import the mock data
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';

const Trip = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(mockTripData);
  }, []);

  return (
      <div className={styles.container}>
        <Map locations={locations} />
      </div>
  );
};

export default Trip;