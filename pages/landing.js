import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import Categories from "../components/Categories";
import useFetchTripRoute from '../utils/useFetchTripRoute';
import TextBoxComponent from '../components/inputTags';
import { useRouter } from 'next/navigation';

const StaticMap = dynamic(() => import('../components/staticMap'), { ssr: false });

export default function TripifyLanding() {
  const [formData, setFormData] = useState({
    StartingLat: 0,
    StartingLon: 0,
    DestinationLat: 0,
    DestinationLon: 0,
    StartDate: '',
    EndDate: '',
    Categories: [],
    MandatoryToVisit: [],
    BackHome: false,
  });

  const { tripInfo, loading, error, fetchTripRoute } = useFetchTripRoute(formData);
  
  const router = useRouter()
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('User Preferences:', formData);
  
    // Call the fetchTripRoute function
    await fetchTripRoute(formData); // Manually triggers the fetch when the form is submitted
  };
  
  useEffect(() => {
    if (tripInfo) {
      // Only redirect when tripInfo is populated
      sessionStorage.setItem('data', JSON.stringify(tripInfo));
      sessionStorage.setItem('startingLat', formData.StartingLat);
      sessionStorage.setItem('startingLon', formData.StartingLon);
      sessionStorage.setItem('startingDate', formData.StartDate);
      sessionStorage.setItem('endingDate', formData.EndDate);
      router.push('/trip'); // Redirect to /trip page
    }
  }); // Runs whenever tripInfo changes

  // Function to update the preferredActivities from the Categories component
  const handleCategoryChange = (selectedCategories) => {
    setFormData({ ...formData, Categories: selectedCategories });
  };

  // Function to update the mandatoryToVisit from the TextBoxComponent component
  const handleMandatoriesChange = (selectedMandatories) => {
    setFormData({ ...formData, MandatoryToVisit: selectedMandatories });
  };

  // Function to update the backHome from the checkbox
  const handleBachHomeChange = (e) => {
    const { checked } = e.target;
    setFormData({ ...formData, BackHome: checked });
  };

  const CustomDateButton = React.forwardRef(({ value, onClick, defaultText}, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      style={styles.button2}
    >
      {value || defaultText}
    </button>
  ));

  //const [coordinates, setCoordinates] = useState(null); // State to hold lat and lon
  //const [startingPoint, setStartingPoint] = useState(null);
  //const [destinationPoint, setDestinationPoint] = useState(null);
  const [buttonStartText, setButtonStartText] = useState('At'); // Initial button text
  const [buttonDestinationText, setButtonDestinationText] = useState('Going To'); // Initial button text
  const [type, setType] = useState('start'); // Initial button text
  const [disableState, setDisableState] = useState(true);

  const setLocation = (lat, lon) => {
    if (type === 'start') {
      //setStartingPoint([lat, lon]);
      setFormData({ ...formData, StartingLat: lat, StartingLon: lon });
      reverseGeocode(lat, lon).then((locality) => {
        setButtonStartText(locality);
      });
      lockMap();
    } else {
      //setDestinationPoint([lat, lon]);
      setFormData({ ...formData, DestinationLat: lat, DestinationLon: lon });
      reverseGeocode(lat, lon).then((locality) => {
         setButtonDestinationText(locality);
      });
      lockMap();
    }
  };


  const lockMap = () => {
    // disable the map inteteraction
    const pickMap = document.getElementById('pickMap');
    pickMap.style.pointerEvents = 'none';
    // set formContainer id element to display: block
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'block';
    // hide the h1 element with the text "Click on the map to select your location"
    const pickLocationH1 = document.getElementById('pickLocationH1');
    pickLocationH1.style.display = 'none';
  }

  const pickLocationStart = () => {
    // set formContainer id element to display: none
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'none';
    // display the h1 element with the text "Click on the map to select your location"
    const pickLocationH1 = document.getElementById('pickLocationH1');
    pickLocationH1.style.display = 'block';
    // enable the map interaction
    const pickMap = document.getElementById('pickMap');
    pickMap.style.pointerEvents = 'auto';    
    // set onMapClick type to start
    setType('start');
    setDisableState(false);
  }

  const pickLocationDestination = () => {
    // set formContainer id element to display: none
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'none';
    // display the h1 element with the text "Click on the map to select your location"
    const pickLocationH1 = document.getElementById('pickLocationH1');
    pickLocationH1.style.display = 'block';
    // enable the map interaction
    const pickMap = document.getElementById('pickMap');
    pickMap.style.pointerEvents = 'auto';    
    // set onMapClick type to destination
    setType('destination');
  }

  const reverseGeocode = async (lat, lng) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiZGlvZ29sZW9uYXJkbyIsImEiOiJjbTNrcnZsMDEwaW9iMmxwZW1mZDhybnRzIn0.o3zaq7mYrcXG3bgiGMORdg`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.features && data.features.length > 0) {
        // Look for a feature with a type 'place' (usually city or town)
        const placeFeature = data.features.find(feature => 
          feature.place_type.includes('place') || feature.place_type.includes('locality')
        );
  
        // If a locality is found, return its text (name), otherwise fallback to place_name
        if (placeFeature) {
          return placeFeature.text; // Returns only the locality name
        } else {
          return 'Unknown locality';
        }
      } else {
        return 'Unknown locality';
      }
    } catch (error) {
      console.error('Error fetching locality:', error);
      return 'Error fetching location';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pickMap} id="pickMap">
        <StaticMap onMapClick={setLocation} lockMap={lockMap} type={type}/>
      </div>
      <h1 style={styles.h1PickLocation} id="pickLocationH1">Click on the map to select your location</h1>
      <div style={styles.formContainer} id="formContainer">
        <h1 style={styles.header}>Build Your Trip</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
            <h5>I want to travel...</h5>
            <div style={styles.inputGroupBtns}>
            <DatePicker
              selected={formData.StartDate}
              onChange={(date) => setFormData({ ...formData, StartDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data de início"
              customInput={<CustomDateButton defaultText="From" />}
            />
            <DatePicker
              selected={formData.EndDate}
              onChange={(date) => setFormData({ ...formData, EndDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data de Fim"
              customInput={<CustomDateButton defaultText="To"/>}
            />
          </div>
          <h5>Initiating my trip...</h5>
          <div style={styles.inputGroupBtns}>
            <button
              type="button"
              style={styles.button2}
              onClick={pickLocationStart}>{buttonStartText}</button>
            <button
              type="button"
              style={styles.button2}
              disabled={disableState}
              onClick={pickLocationDestination}>{buttonDestinationText}</button>
          </div>
          <div style={styles.inputGroup}>
          <h5>I would prefer to see...</h5>
            {/* Use Categories component and pass the category change handler */}
          <Categories onCategoryChange={handleCategoryChange} />
          </div>
          <h5>It's mandatory to visit...</h5>
          <TextBoxComponent onMandatoriesChange={handleMandatoriesChange} />
          <div class="d-flex">
            <input type="checkbox" name="backToStart" value={formData.BackHome} onChange={handleBachHomeChange} class="me-2" style={{width: "1.2rem"}} /> 
            <h6 class="mb-1" style={styles.label}>Finish my trip at the starting point?</h6>
          </div>
          <button type="submit" style={styles.button2} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  mapContainer: {
    width: '70%', // Map takes 70% of the screen width
    height: '100vh',
  },
  formContainer: {
    width: '30%', // Form takes 30% of the screen width
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '2rem',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    top: 0,
    height: '100vh',
    right: 0,
    zIndex: 10000,
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
  },
  select: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
  },
  button: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  button2: {
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    minWidth: '10rem',
  },
  inputGroupBtns: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  h1PickLocation: {
    position: 'absolute',
    top: '5rem',
    color: '#fff',
    display: 'none',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
  },
  pickMap: {
    // disable the map inteteraction
    pointerEvents: 'none',
  },
  
};
