
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";

const LocationSelector = ({ onSelectLocation }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    state: "",
    city: "",
    countryCode: "",
    stateCode: "",
    cityCode: ""
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch countries from the server
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/country`);
      const data = await response.json();
      if (data.countries) {
        setCountries(data.countries.map(country => ({ code: country.countryCode, name: country.countryName })));
      } else {
        console.error("Error fetching countries:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode })
      });
      const data = await response.json();
      if (data.states) {
        setStates(data.states.map(state => ({ code: state.adminCode1, name: state.name })));
        setCities([]); // Clear cities when changing state
        setSelectedLocation(prev => ({
          ...prev,
          state: "",
          city: "",
          stateCode: "",
          cityCode: ""
        }));
      } else {
        console.error("Error fetching states:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch cities based on selected state
  const fetchCities = async (countryCode, stateCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/city`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode, stateCode })
      });
      const data = await response.json();
      if (data.cities) {
        setCities(data.cities.map(city => ({ code: city.geonameId.toString(), name: city.name })));
      } else {
        console.warn("No cities found for this state");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(country => country.code === selectedCountryCode);
    const countryName = selectedCountry?.name || "";

    setSelectedLocation(prev => ({
      ...prev,
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      city: "",
      stateCode: "",
      cityCode: ""
    }));

    fetchStates(selectedCountryCode);
    onSelectLocation({
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      stateCode: "",
      city: "",
      cityCode: ""
    });
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find(state => state.code === selectedStateCode);
    const stateName = selectedState?.name || "";

    setSelectedLocation(prev => ({
      ...prev,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: ""
    }));

    fetchCities(selectedLocation.countryCode, selectedStateCode);
    onSelectLocation(prev => ({
      ...prev,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: ""
    }));
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
    const selectedCity = cities.find(city => city.code === selectedCityCode);
    const cityName = selectedCity?.name || "";

    setSelectedLocation(prev => ({
      ...prev,
      city: cityName,
      cityCode: selectedCityCode
    }));

    onSelectLocation({
      ...selectedLocation,
      city: cityName,
      cityCode: selectedCityCode
    });
  };

  // Log selected location for debugging
  useEffect(() => {
    console.log("Selected Location has been updated:", selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="location-selector">
      <div className="flex flex-col">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={selectedLocation.countryCode || ""}
          onChange={handleCountryChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={`country-${country.code}`} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={selectedLocation.stateCode || ""}
          onChange={handleStateChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.countryCode}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={`state-${state.code}`} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={selectedLocation.cityCode || ""}
          onChange={handleCityChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.stateCode}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={`city-${city.code}`} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;



/*import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../../context/userContext';

const LocationSelector = ({ onSelectLocation }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    state: "",
    city: ""
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/country`);
      const data = await response.json();
      if (data.countries) {
        setCountries(data.countries.map(country => ({ code: country.countryCode, name: country.countryName })));
      } else {
        console.error("Error fetching countries:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode })
      });
      const data = await response.json();
      if (data.states) {
        setStates(data.states.map(state => ({ code: state.adminCode1, name: state.name })));
        setCities([]);
        // Reset selected location
        setSelectedLocation(prev => ({ ...prev, state: "", city: "" }));
      } else {
        console.error("Error fetching states:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryCode, stateCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/city`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode, stateCode })
      });
      const data = await response.json();
      if (data.cities) {
        setCities(data.cities.map(city => ({ code: city.geonameId.toString(), name: city.name })));
      } else {
        console.warn("No cities found for this state");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(country => country.code === e.target.value);
    const countryName = selectedCountry?.name || "";
    setSelectedCountryCode(selectedCountry?.code || "");
    setSelectedLocation(prev => {
      const updatedLocation = { ...prev, country: countryName, state: "", city: "" };
      console.log("Updated Location after Country Change:", updatedLocation); // Log for debugging
      return updatedLocation;
    });
   // setSelectedLocation({ country: countryName, state: "", city: "" });
    fetchStates(selectedCountry?.code);
    onSelectLocation({ country: countryName, state: "", city: "" });
  };

  const handleStateChange = (e) => {
    const selectedState = states.find(state => state.code === e.target.value);
    const stateName = selectedState?.name || "";
    setSelectedLocation(prev => {
      const updatedLocation = { ...prev, state: stateName, city: "" };
      console.log("Updated Location after State Change:", updatedLocation); // Log for debugging
      return updatedLocation;
    });
   // setSelectedLocation(prev => ({ ...prev, state: stateName, city: "" }));
    fetchCities(selectedCountryCode, selectedState?.code);
    onSelectLocation(prev => ({ ...prev, state: stateName, city: "" }));
  };

  const handleCityChange = (e) => {
    const selectedCity = cities.find(city => city.code === e.target.value);
    const cityName = selectedCity ? selectedCity.name : "";
    setSelectedLocation(prev => {
      const newLocation = { ...prev, city: cityName };
      console.log("Updated Location after City Change:", newLocation); 
      onSelectLocation(newLocation);
      return newLocation;
    });
  };



  useEffect(() => {
    console.log("Selected Location has been updated:", selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="location-selector">
      <div className="flex flex-col">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          key={selectedLocation.country}
          value={selectedLocation.country || ""}
          onChange={handleCountryChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={`country-${country.code}`} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="state">State</label>
        <select
          id="state"
          
          key={selectedLocation.state}
          value={selectedLocation.state || ""}
          onChange={handleStateChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.country}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={`state-${state.code}-${state.name}`} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="city">City</label>
        <select
          id="city"
          key={selectedLocation.city}
          value={selectedLocation.city || ""}
          onChange={handleCityChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.state}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={`city-${city.code}`} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
*/

/*import React, { useContext,useState, useEffect } from "react";

import { UserContext } from '../../context/userContext';

const LocationSelector = ({ onSelectLocation }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    state: "",
    city: ""
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/country`);
      const data = await response.json();
      if (data.countries) {
        setCountries(data.countries.map(country => ({ code: country.countryCode, name: country.countryName })));
      } else {
        console.error("Error fetching countries:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode })
      });
      const data = await response.json();
      if (data.states) {
        setStates(data.states.map(state => ({ code: state.adminCode1, name: state.name })));
        setCities([]);
      } else {
        console.error("Error fetching states:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryCode, stateCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/city`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode, stateCode })
      });
      const data = await response.json();
      if (data.cities) {
        setCities(data.cities.map(city => ({ code: city.geonameId.toString(), name: city.name })));
      } else {
        console.warn("No cities found for this state");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(country => country.code === e.target.value);
    setSelectedCountryCode(selectedCountry?.code || "");
    setSelectedLocation({ country: selectedCountry?.name || "", state: "", city: "" });
    fetchStates(selectedCountry?.code);
    onSelectLocation({ country: selectedCountry?.name || "", state: "", city: "" });
  };

  const handleStateChange = (e) => {
    const selectedState = states.find(state => state.code === e.target.value);
    setSelectedLocation(prev => ({ ...prev, state: selectedState?.name || "", city: "" }));
    fetchCities(selectedCountryCode, selectedState?.code);
    onSelectLocation({ ...selectedLocation, state: selectedState?.name || "", city: "" });
  };

  const handleCityChange = (e) => {
    const selectedCity = cities.find(city => city.code === e.target.value);
    const cityName = selectedCity ? selectedCity.name : "";

    setSelectedLocation(prev => {
      const newLocation = { ...prev, city: cityName };
      onSelectLocation(newLocation);
      return newLocation;
    });
  };
 
  
  useEffect(() => {
    onSelectLocation(selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="location-selector">
    <div className="flex flex-col">
      <label htmlFor="country">Country</label>
      <select
        id="country"
        value={selectedLocation.country}
        onChange={handleCountryChange}
        className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={`country-${country.code}`} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label htmlFor="state">State</label>
      <select
        id="state"
        value={selectedLocation.state}
        onChange={handleStateChange}
        className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        disabled={!selectedLocation.country}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={`state-${state.code}-${state.name}`} value={state.code}>
            {state.name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label htmlFor="city">City</label>
      <select
        id="city"
        value={selectedLocation.city}
        onChange={handleCityChange}
        className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        disabled={!selectedLocation.state}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={`city-${city.code}`} value={city.code}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  </div>
    /*<div className="location-selector">
      <div className="flex flex-col">
        <label htmlFor="country">Country</label>
        <select id="country" value={selectedLocation.country} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={`country-${country.code}`} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="state">State</label>
        <select id="state" value={selectedLocation.state} onChange={handleStateChange} disabled={!selectedLocation.country}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={`state-${state.code}`} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="city">City</label>
        <select id="city" value={selectedLocation.city} onChange={handleCityChange} disabled={!selectedLocation.state}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={`city-${city.code}`} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>/
  );
};

export default LocationSelector;*/


/*import React, { useState, useEffect } from "react";

const LocationSelector = ({ onSelectLocation }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    state: "",
    city: ""
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`http://api.geonames.org/countryInfoJSON?username=roja1`);
      const data = await response.json();
      if (data.geonames) {
        setCountries(data.geonames.map(country => ({ code: country.countryCode, name: country.countryName })));
      } else {
        console.error("Error fetching countries:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`http://api.geonames.org/searchJSON?country=${countryCode}&featureCode=ADM1&username=roja1`);
      const data = await response.json();
      if (data.geonames) {
        setStates(data.geonames.map(state => ({ code: state.adminCode1, name: state.name })));
        setCities([]); 
      } else {
        console.error("Error fetching states:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryCode, stateCode) => {
    try {
    //  console.log("Fetching cities for", { countryCode, stateCode });
      const response = await fetch(`http://api.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=PPL&username=roja1`);
      const data = await response.json();
      if (data.geonames && data.geonames.length > 0) {
       // console.log("Cities found from API:", data.geonames); // Log the API response
        setCities(data.geonames.map(city => ({ code: city.geonameId.toString(), name: city.name }))); // Ensure code is a string
      } else {
        console.warn("No cities found for this state");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(country => country.code === e.target.value);
    setSelectedCountryCode(selectedCountry?.code || "");
    setSelectedLocation({ country: selectedCountry?.name || "", state: "", city: "" });
    fetchStates(selectedCountry?.code); 
    onSelectLocation({ country: selectedCountry?.name || "", state: "", city: "" });
  };

  const handleStateChange = (e) => {
    const selectedState = states.find(state => state.code === e.target.value);
    setSelectedLocation(prev => ({ ...prev, state: selectedState?.name || "", city: "" }));
    fetchCities(selectedCountryCode, selectedState?.code); 
    onSelectLocation({ ...selectedLocation, state: selectedState?.name || "", city: "" });
  };

  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
   // console.log("Selected City Code:", selectedCityCode); // Log the code we are searching for
  
    // Log the cities array to see its structure
  //  console.log("Cities Array:", cities);
  
    // Check what properties each city object has
    cities.forEach(city => {
     // console.log("City Object:", city);
    });
  

    const selectedCity = cities.find(city => city.code.toString() === selectedCityCode); 
  
    
    //console.log("Selected City Found:", selectedCity);
  
    const cityName = selectedCity ? selectedCity.name : "";
    //console.log("City Name: ", cityName); 
  
   
    setSelectedLocation(prev => {
      const newLocation = { ...prev, city: cityName };
     
      onSelectLocation(newLocation);
      return newLocation;
    });
  
    
  //  console.log("Location after update (may not be updated yet): ", selectedLocation);
  };
  
  

  return (
    <div className="location-selector">
      <div className="flex flex-col">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={selectedLocation.country}
          onChange={handleCountryChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={`country-${country.code}`} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={selectedLocation.state}
          onChange={handleStateChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.country}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={`state-${state.code}-${state.name}`} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={selectedLocation.city}
          onChange={handleCityChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
          disabled={!selectedLocation.state}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={`city-${city.code}`} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;


*/