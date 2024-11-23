import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTripRoute = (tripData) => {
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripRoute = async () => {
      // Avoid sending the request if tripData is missing
      console.log("entrou executar");
      if (!tripData) return;

      setLoading(true);
      try {
        console.log("bora executar");
        const response = await axios.post(
          'https://tripifybackend-g4ebf9g0ftapf6h5.westeurope-01.azurewebsites.net/api/Routes/tripRoute',
          tripData, // Axios automatically handles JSON.stringify
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("response:\n" + response.data); 
        setTripInfo(response.data); // Save the response data
      } catch (error) {
        console.log("error:\n" + error);
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

  }, [tripData]);

  return { tripInfo, loading, error};
};

export default useFetchTripRoute;
