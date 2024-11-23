import { useEffect, useState } from 'react';
import useFetchTripRoute from '../utils/useFetchTripRoute'; // Import the custom hook for fetching the trip data
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';
import { useRouter } from 'next/navigation';

const Trip = () => {
  const router = useRouter();
  const [tripInfo, setTripInfo] = useState(null);
  useEffect(() => {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem('data');
    console.log("data:\n" + data);
    
    // Check if data exists and parse it
    setTripInfo(JSON.parse(data.data));
    console.log("tripInfo file trip:\n" + tripInfo);
  }, []);
  
  // Prepare the locations from the trip data
  const locations = tripInfo ? tripInfo.trips.flatMap(trip => trip.places) : [];

  return (
    <div className={styles.container}>
      <Map locations={locations} />
    </div>
  );
};

export default Trip;
