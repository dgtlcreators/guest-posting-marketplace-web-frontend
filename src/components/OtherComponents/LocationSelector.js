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
    cityCode: "",
    stateIsocode: "",
    newCity: "",
  });
  const [isAddingCity, setIsAddingCity] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${localhosturl}/locationroute/country`);
        const data = await response.json();
        if (data.countries) {
          setCountries(
            data.countries.map((country) => ({
              code: country.countryCode,
              name: country.countryName,
            }))
          );
        } else {
          console.error("Error fetching countries:", data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [localhosturl]);

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode }),
      });
      const data = await response.json();
      if (data.states) {
        setStates(
          data.states.map((state) => ({
            code: state.adminCode1,
            name: state.name,
            isocode: state.adminCodes1.ISO3166_2,
          }))
        );
        setCities([]);
        setSelectedLocation((prev) => ({
          ...prev,
          state: "",
          city: "",
          stateCode: "",
          cityCode: "",
          stateIsocode: "",
        }));
      } else {
        console.error("Error fetching states:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryCode, stateCode, stateIsocode) => {
    try {
      const response = await fetch(`${localhosturl}/locationroute/city`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, stateCode, stateIsocode }),
      });
      const data = await response.json();
      if (data.cities) {
        setCities(
          data.cities.map((city) => ({
            code: city.geonameId.toString(),
            name: city.name,
          }))
        );
      } else {
        console.log("No cities found for this state");
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.code === selectedCountryCode
    );
    const countryName = selectedCountry?.name || "";

    setSelectedLocation((prev) => ({
      ...prev,
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      city: "",
      stateCode: "",
      cityCode: "",
      stateIsocode: "",
    }));

    fetchStates(selectedCountryCode);
    onSelectLocation({
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      city: "",
      stateCode: "",
      cityCode: "",
      stateIsocode: "",
    });
  };

  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find((state) => state.code === selectedStateCode);
    const stateName = selectedState?.name || "";
    const stateIsocode = selectedState?.isocode || "";

    setSelectedLocation((prev) => ({
      ...prev,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: "",
      stateIsocode,
    }));

    fetchCities(selectedLocation.countryCode, selectedStateCode, stateIsocode);
    onSelectLocation({
      ...selectedLocation,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: "",
      stateIsocode,
    });
  };

  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
    const selectedCity = cities.find((city) => city.code === selectedCityCode);
    const cityName = selectedCity?.name || "";

    setSelectedLocation((prev) => ({
      ...prev,
      city: cityName,
      cityCode: selectedCityCode,
    }));

    onSelectLocation({
      ...selectedLocation,
      city: cityName,
      cityCode: selectedCityCode,
    });
  };

  const handleAddCityChange = (e) => {
    setSelectedLocation((prev) => ({ ...prev, newCity: e.target.value }));
  };

  const handleAddCitySubmit = () => {
    if (selectedLocation.newCity) {
      setSelectedLocation((prev) => ({
        ...prev,
        city: selectedLocation.newCity,
        cityCode: selectedLocation.newCity,
      }));
      onSelectLocation({
        ...selectedLocation,
        city: selectedLocation.newCity,
        cityCode: selectedLocation.newCity,
      });
      setIsAddingCity(false);
    }
  };

  return (
    <div className="location-selector">
      <div className="flex flex-col">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={selectedLocation.countryCode}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={selectedLocation.stateCode}
          onChange={handleStateChange}
          disabled={!selectedLocation.countryCode}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={selectedLocation.cityCode}
          onChange={handleCityChange}
          disabled={!selectedLocation.stateCode}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
          <option value="add-city">Add City</option>
        </select>
        {isAddingCity && (
          <div>
            <input
              type="text"
              value={selectedLocation.newCity}
              onChange={handleAddCityChange}
              placeholder="Enter new city"
            />
            <button onClick={handleAddCitySubmit}>Add City</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
