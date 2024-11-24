import React, { useState } from 'react';
import useFetchCategories from '../utils/useFetchCategories'; // Import the custom hook
import Select from 'react-select'; // Import react-select

const Categories = ({onCategoryChange}) => {
  const [formData, setFormData] = useState({
    preferredActivities: [], // This will hold the IDs of selected categories
  });

  // Use the custom hook to fetch categories
  const { categories, loading, error } = useFetchCategories();

  // Map categories to the format needed by react-select
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // Handle changes in selected options
  const handleSelectChange = (selectedOptions) => {
    const selectedCategories = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onCategoryChange(selectedCategories);
    setFormData((prevData) => ({
      ...prevData,
      preferredActivities: selectedCategories,
    }));
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Select
        isMulti
        options={categoryOptions}
        value={categoryOptions.filter(option => formData.preferredActivities.includes(option.value))}
        onChange={handleSelectChange}
        placeholder="Preferred activities (All by default)"
        closeMenuOnSelect={false} // Allow multiple selections
        noOptionsMessage={() => 'No categories available'}
        isClearable
      />
    </div>
  );
};

export default Categories;
