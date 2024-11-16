
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext.js";

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


