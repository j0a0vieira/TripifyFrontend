import { useEffect, useState } from 'react';
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';
import { useRouter } from 'next/navigation';

const Trip = () => {
  const router = useRouter();
  const [tripInfo, setTripInfo] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem('data');
    console.log("data from session storage:\n", data);

    if (data) {
      // Parse the stored data and set it to state
      const parsedData = JSON.parse(data);
      setTripInfo(parsedData);

      // Calculate locations from the parsed trip info and update state
      const locations = parsedData.trips.flatMap(trip => trip.places);
      setLocations(locations); // Update locations state
    }
  }, []); // Empty dependency array ensures this runs once after component mounts

  console.log("locations:\n", locations); // Log locations to verify

  return (
    <div className={styles.container}>
      <Map locations={locations} />
    </div>
  );
};

export default Trip;
