import axios from 'axios';

export const fetchTripData = async () => {
  try {
    const response = await axios.get('https://your-backend-api/trip-data');
    return response.data; // Assume this returns an array of locations with { latitude, longitude, name, description }
  } catch (error) {
    console.error('Error fetching trip data:', error);
    return [];
  }
};
