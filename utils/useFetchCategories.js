import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://tripifybackend-g4ebf9g0ftapf6h5.westeurope-01.azurewebsites.net/api/FrontSupport/categoryList'
        );
        const categoryList = response.data; // Assuming the data comes directly as an array
        setCategories(categoryList);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 200 range
          console.error('Error response:', error.response.data);
          setError(`Server Error: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response was received
          console.error('Error request:', error.request);
          setError('Network Error: No response received');
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useFetchCategories;
