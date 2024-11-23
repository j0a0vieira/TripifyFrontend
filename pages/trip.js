import { useEffect, useState } from 'react';
import useFetchTripRoute from '../utils/useFetchTripRoute'; // Import the custom hook for fetching the trip data
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';

const Trip = () => {
  const [formData, setFormData] = useState({
    StartingLat: 0,
    StartingLon: 0,
    DestinationLat: 0,
    DestinationLon: 0,
    StartDate: "",
    EndDate: "",
    Categories: [], // Assuming the categories array is empty by default
    MandatoryToVisit: [],
    BackHome: false,
  });
  console.log("trip file triggerd");
  // Use the custom hook to fetch trip route data
  const { tripInfo, loading, error } = useFetchTripRoute(formData);

  useEffect(() => {
    // Optionally, you can update formData dynamically here if needed
  }, [formData]);

  // Handle loading and error states
  if (loading) return <div>Loading trip information...</div>;
  if (error) return <div>Error: {error}</div>;

  // Prepare the locations from the trip data
  const locations = tripInfo ? tripInfo.trips.flatMap(trip => trip.places) : [];

  return (
    <div className={styles.container}>
      <Map locations={locations} />
    </div>
  );
};

export default Trip;
