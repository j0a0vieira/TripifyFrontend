import { useEffect, useState } from 'react';
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';
import { useRouter } from 'next/navigation';

const Trip = () => {
  const router = useRouter();
  const [tripInfo, setTripInfo] = useState(null);
  const [locations, setLocations] = useState([]);
  const [otherTrips, setOtherTrips] = useState([]); // State for other trips
  const [selectedTrip, setSelectedTrip] = useState(null); // State for the currently selected trip

  useEffect(() => {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem('data');
    console.log("data from session storage:\n", data);

    if (data) {
      // Parse the stored data and set it to state
      const parsedData = JSON.parse(data);
      setTripInfo(parsedData.trips[0]); // Store the first trip as tripInfo

      // Calculate locations for the first trip
      const firstTripLocations = parsedData.trips[0].places;
      setLocations(firstTripLocations); // Update locations state for the first trip

      // Store the rest of the trips in a separate state
      const remainingTrips = parsedData.trips.slice(1); // Exclude the first trip
      setOtherTrips(remainingTrips); // Set the other trips
    }
  }, []); // Empty dependency array ensures this runs once after component mounts

  // Handle toggling between trips
  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip); // Update the selected trip
    setLocations(trip.places); // Update locations based on selected trip

    // zoom out and center in the map
  };

  // Handle toggling off the selected trip (deselecting)
  const handleDeselectTrip = () => {
    setSelectedTrip(null);
    setLocations([]); // Clear locations if no trip is selected
  };

  console.log("locations:\n", locations); // Log locations to verify
  console.log("otherTrips:\n", otherTrips); // Log other trips to verify
  console.log("selectedTrip:\n", selectedTrip); // Log selected trip to verify

  return (
    <div className={styles.container}>
      

      {/* Section for displaying other trips */}
      <div className={styles.otherTrips}>
        <h5>Other Trips</h5>
        {otherTrips.length > 0 && (
          <ul>
            {otherTrips.map((trip, index) => (
              <li key={index}>
                <button onClick={() => handleSelectTrip(trip)}>
                  Trip {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Map locations={locations} />
    </div>
  );
};

export default Trip;
