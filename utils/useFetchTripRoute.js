import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTripRoute = (tripData) => {
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTripRoute = async () => {
    // Avoid sending the request if tripData is missing
    if (!tripData) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'https://tripifybackend-g4ebf9g0ftapf6h5.westeurope-01.azurewebsites.net/api/Routes/tripRoute',
        tripData, // Axios automatically handles JSON.stringify
        {
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
          },
        }
      );

      setTripInfo(response.data); // Save the response data
    } catch (error) {
      console.log("error:\n" + error);
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return { tripInfo, loading, error, fetchTripRoute };
};

export default useFetchTripRoute;
