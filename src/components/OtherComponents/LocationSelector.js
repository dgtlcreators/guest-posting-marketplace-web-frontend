
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
    stateIsocode: "" ,
    newCity: "",
  });

  const [isAddingCity, setIsAddingCity] = useState(false);

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
   
        setStates(data.states.map(state => ({ code: state.adminCode1, name: state.name , isocode: state.adminCodes1.ISO3166_2})));
  
       
        setCities([]); 
        setSelectedLocation(prev => ({
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryCode, stateCode,stateIsocode })
      });
      const data = await response.json();
      if (data.cities) {
        
       // const filteredCities = data.cities.filter((city) => city.adminCode1 !== stateCode);
       // setCities(filteredCities.map(city => ({ code: city.geonameId.toString(), name: city.name })));
        setCities(data.cities.map(city => ({ code: city.geonameId.toString(), name: city.name })));
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
    const selectedCountry = countries.find(country => country.code === selectedCountryCode);
    const countryName = selectedCountry?.name || "";

    setSelectedLocation(prev => ({
      ...prev,
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      city: "",
      stateCode: "",
      cityCode: "",
        stateIsocode: ""
    }));

    fetchStates(selectedCountryCode);
    onSelectLocation({
      country: countryName,
      countryCode: selectedCountryCode,
      state: "",
      stateCode: "",
      city: "",
      cityCode: "",
         stateIsocode: ""
    });
  };

  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
  
    
<<<<<<< Updated upstream
    console.log("Selected State Code:", selectedStateCode);
=======
    // console.log("Selected State Code:", selectedStateCode);
>>>>>>> Stashed changes
  
  
    const selectedState = states.find(
      (state) => state.code === selectedStateCode || state.name === selectedStateCode
    );
  
   
    if (!selectedState) {
      console.error("State not found for the selected state code:", selectedStateCode);
      return;
    }
  
    const stateName = selectedState.name;
    const stateIsocode = selectedState.isocode;
  
<<<<<<< Updated upstream
    console.log("Selected State Object:", selectedState);
=======
    // console.log("Selected State Object:", selectedState);
>>>>>>> Stashed changes
  
    const updatedLocation = {
      ...selectedLocation,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: "",
      stateIsocode,
    };
  
    setSelectedLocation(updatedLocation);
  
    
    fetchCities(updatedLocation.countryCode, updatedLocation.stateCode, updatedLocation.stateIsocode);
  

    onSelectLocation(updatedLocation);
  };
  

 /* const handleStateChange1 = (e) => {
    const selectedStateCode = e.target.value;
    console.log(selectedStateCode)
    // const selectedState = states.find(state => state.code === selectedStateCode);
    const selectedState = states.find(state => state.name === selectedStateCode);
    const stateName = selectedState?.name || "";
    const stateIsocode = selectedState?.isocode || "";
console.log( selectedState)
    setSelectedLocation(prev => ({
      ...prev,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: "",
      stateIsocode: stateIsocode,
    }));
    console.log(stateIsocode)

    fetchCities(selectedLocation.countryCode, selectedStateCode, stateIsocode);
    onSelectLocation(prev => ({
      ...prev,
      state: stateName,
      stateCode: selectedStateCode,
      city: "",
      cityCode: "",
      stateIsocode: stateIsocode,
    }));
<<<<<<< Updated upstream
  };
  */
=======
  };*/
>>>>>>> Stashed changes

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

  const handleAddCityChange = (e) => {
    setSelectedLocation(prev => ({
      ...prev,
      newCity: e.target.value
    }));
  };

  const handleAddCitySubmit = () => {
    if (selectedLocation.newCity) {
      setSelectedLocation(prev => ({
        ...prev,
        city: selectedLocation.newCity,
        cityCode: selectedLocation.newCity // You may want to generate a unique code for the city
      }));
      onSelectLocation({
        ...selectedLocation,
        city: selectedLocation.newCity,
        cityCode: selectedLocation.newCity 
      });
      setIsAddingCity(false); 
    }
  };



  useEffect(() => {

  //  console.log("Selected Location has been updated:", selectedLocation);
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
            <option key={`state-${state.code}`} value={state.name}//value={state.code}
            >
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
          {cities
           .filter(city => city.name!== selectedLocation.stateCode)
          .map((city) => (
            <option key={`city-${city.code}`} value={city.code}>
              {city.name}
            </option>
          ))}
          <option value="add-city">Add City</option>
        </select>

        {selectedLocation.cityCode === "add-city" && !isAddingCity && (
          <button
            type="button"
            onClick={() => setIsAddingCity(true)}
            className="mt-2 p-2 bg-blue-500 text-white"
          >
            Add New City
          </button>
        )}

        {isAddingCity && (
          <div className="flex flex-col mt-2">
            <input
              type="text"
              value={selectedLocation.newCity}
              onChange={handleAddCityChange}
              placeholder="Enter new city name"
              className="p-2 border"
            />
            <button
              type="button"
              onClick={handleAddCitySubmit}
              className="mt-2 p-2 bg-green-500 text-white"
            >
              Add City
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;


