import { useEffect, useState } from 'react';
import Map from '../components/map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import styles from '../styles/trip.module.css';

const Trip = () => {
  const [locations, setLocations] = useState([]);
  const [otherTrips, setOtherTrips] = useState([]); // State for other trips
  const [selectedTrip, setSelectedTrip] = useState(null); // State for the currently selected trip
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const data = sessionStorage.getItem('data');
    console.log("data from session storage:\n", data);

    if (data) {
      // Parse the stored data and set it to state
      const parsedData = JSON.parse(data);
    
      // Create the fixed starting point using session variables
      const initialLocation = {
        country: 'PT',
        formattedAddress: '',
        id: '1',
        latitude: sessionStorage.getItem('startingLat'),
        locality: null,
        longitude: sessionStorage.getItem('startingLon'),
        name: 'Starting Point', 
        postcode: null,
        region: null,
      };

      // Function to format a date to yyyy-mm-dd
      function formatDate(dateString) {
        const date = new Date(dateString); // Convert the date string to a Date object
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      }

      // Retrieve dates from session storage and format them
      const startingDate = formatDate(sessionStorage.getItem('startingDate'));
      const endingDate = formatDate(sessionStorage.getItem('endingDate'));

      // Set the formatted dates to state
      setStartDate(startingDate);
      setEndDate(endingDate);
    
      // Retrieve places from parsed data for the first trip
      const places = parsedData.trips[0].places || [];
    
      // Merge initialLocation as the first item in the array for the first trip
      const combinedLocations = [initialLocation, ...places];
      setLocations(combinedLocations); // Update locations state for the first trip
    
      // Modify each remaining trip to add the initialLocation as the first item
      const updatedRemainingTrips = parsedData.trips.slice(1).map((trip) => {
        // Merge initialLocation with the current trip's places
        const updatedPlaces = [initialLocation, ...trip.places];
        return {
          ...trip,
          places: updatedPlaces,
        };
      });
    
      // Store the updated remaining trips in a separate state
      setOtherTrips(updatedRemainingTrips);
    }
    
  }, []); // Empty dependency array ensures this runs once after component mounts

  // Handle toggling between trips
  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip); // Update the selected trip
    setLocations(trip.places); // Update locations based on selected trip

    // zoom out and center in the map
  };

  console.log("locations:\n", locations); // Log locations to verify
  console.log("otherTrips:\n", otherTrips); // Log other trips to verify
  console.log("selectedTrip:\n", selectedTrip); // Log selected trip to verify

  return (
    <div className={styles.container}>
      {/* Section for displaying other trips */}
      <div className={styles.otherTrips}>
        <div class="d-flex justify-content-between">
          <h3>Available Trips</h3>
          <h5>{startDate} --- {endDate}</h5>
        </div>
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
