// Categories.js
import React, { useState } from 'react';
import useFetchCategories from '../utils/useFetchCategories'; // Import the custom hook

const Categories = () => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    tripDuration: '',
    maxDistance: '',
    preferredActivities: [], // Now an array to hold the fetched categories
    withHotel: false,
    travelMode: 'car',
    startLocation: '',
    endLocation: '',
    targetGroup: '',
    mandatoryToVisit: '',
    budget: 'medium'
  });

  // Use the custom hook to fetch categories
  const { categories, loading, error } = useFetchCategories();

  // Update formData when the preferredActivities change
  const handleCategoryChange = (selectedCategories) => {
    setFormData({ ...formData, preferredActivities: selectedCategories });
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Example dropdown to select categories */}
      <label htmlFor="preferredActivities">Preferred Activities:</label>
      <select
        id="preferredActivities"
        multiple
        value={formData.preferredActivities}
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
          handleCategoryChange(selectedOptions);
        }}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Categories;
