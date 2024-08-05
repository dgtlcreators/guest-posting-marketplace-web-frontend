/* eslint-disable react/prop-types */

import axios from "axios";
import { useContext, useState } from "react";
import FormTable from "./FormTable.js";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext.js";

const Form = () => {
  const { userData } = useContext(UserContext); 
  const userId = userData?._id;
 // console.log(userData,userId)

  const initialFormData = {
    mozDA: "1",
    DAto: "100",
    categories: "",
    websiteLanguage: "",
    ahrefsDR: "1",
    DRto: "100",
    linkType: "",
    price: "1",
    priceTo: "100000",
    monthlyTraffic: "",
    mozSpamScore: "",
    publisherURL: "",
    userId:userId
  };

  const [formData, setFormData] = useState(initialFormData);

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData(initialFormData)
  }

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
    
     // .post("http://localhost:5000/form/getFilteredData", formData)
    .post("https://guest-posting-marketplace-web-backend.onrender.com/form/getFilteredData", formData)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
        toast.success("Data Fetch Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-white bg-blue-700 p-2 my-2">FAQ</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-xl p-4 relative"
      >
        {/* 1st Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col">
            <label htmlFor="mozDA">Moz DA</label>
            <input
              type="number"
              id="mozDA"
              name="mozDA"
              min="1"
              max="100"
              value={formData.mozDA}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="DAto">To</label>
            <input
              type="number"
              id="DAto"
              name="DAto"
              min="1"
              max="100"
              value={formData.DAto}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="categories">Categories</label>
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="allCategories">All</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Animals and Pets">Animals and Pets</option>
              <option value="Art">Art</option>
              <option value="Automobiles">Automobiles</option>
              <option value="Business">Business</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Career and Employment">
                Career and Employment
              </option>
              <option value="Computer">Computer</option>
              <option value="Construction and Repairs">
                Construction and Repairs
              </option>
              <option value="Culture">Culture</option>
              <option value="Ecommerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Environment">Environment</option>
              <option value="Fashion">Fashion</option>
              <option value="Finance">Finance</option>
              <option value="Web Development">Web Development</option>
              <option value="App Development">App Development</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="websiteLanguage">Website Language</label>
            <select
              id="websiteLanguage"
              name="websiteLanguage"
              value={formData.websiteLanguage}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="allLanguage">All</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Urdu">Urdu</option>
              <option value="Odia">Odia</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
        </div>

        {/* 2nd Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-4">
          <div className="flex flex-col">
            <label htmlFor="ahrefsDR">Ahrefs DR</label>
            <input
              type="number"
              id="ahrefsDR"
              name="ahrefsDR"
              min="1"
              max="100"
              value={formData.ahrefsDR}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="DRto">To</label>
            <input
              type="number"
              id="DRto"
              name="DRto"
              min="1"
              max="100"
              value={formData.DRto}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="linkType">Link Type</label>
            <select
              id="linkType"
              name="linkType"
              value={formData.linkType}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="All">All</option>
              <option value="Do Follow">Do Follow</option>
              <option value="No Follow">No Follow</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="publisherURL" className="font-medium">
              Publisher URL
            </label>
            <input
              type="url"
              id="publisherURL"
              name="publisherURL"
              title="Please ensure to provide proper format of the url"
              pattern="https?://.*"
              placeholder="https://www.google.com"
              value={formData.publisherURL}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
        </div>

        {/* 3rd Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
          <div className="flex flex-col">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="priceTo">To</label>
            <input
              type="number"
              id="priceTo"
              name="priceTo"
              min="1"
              max="100000"
              value={formData.priceTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="monthlyTraffic">Monthly Traffic</label>
            <select
              id="monthlyTraffic"
              name="monthlyTraffic"
              value={formData.monthlyTraffic}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="allMonthlyTraffic">All</option>
              <option value="Monthly Traffic >= 1000">
                Monthly Traffic {">="} 1000
              </option>
              <option value="Monthly Traffic >= 10000">
                Monthly Traffic {">="} 10,000
              </option>
              <option value="Monthly Traffic >= 50000">
                Monthly Traffic {">="} 50,000
              </option>
              <option value="Monthly Traffic >= 100000">
                Monthly Traffic {">="} 100,000
              </option>
              <option value="Monthly Traffic >= 200000">
                Monthly Traffic {">="} 200,000
              </option>
              <option value="Monthly Traffic >= 300000">
                Monthly Traffic {">="} 300,000
              </option>
              <option value="Monthly Traffic >= 400000">
                Monthly Traffic {">="} 400,000
              </option>
              <option value="Monthly Traffic >= 500000">
                Monthly Traffic {">="} 500,000
              </option>
              <option value="Monthly Traffic >= 600000">
                Monthly Traffic {">="} 600,000
              </option>
              <option value="Monthly Traffic >= 700000">
                Monthly Traffic {">="} 700,000
              </option>
              <option value="Monthly Traffic >= 800000">
                Monthly Traffic {">="} 800,000
              </option>
              <option value="Monthly Traffic >= 900000">
                Monthly Traffic {">="} 900,000
              </option>
              <option value="Monthly Traffic >= 1000000">
                Monthly Traffic {">="} 1,000,000
              </option>
              <option value="Monthly Traffic >= 10000000">
                Monthly Traffic {">="} 10,000,000
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="mozSpamScore">Moz Spam Score</label>
            <select
              id="mozSpamScore"
              name="mozSpamScore"
              value={formData.mozSpamScore}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="allMozSpamScore">All</option>
              <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
              <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
              <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
              <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
              <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
              <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-2">
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </div>
      </form>

      {/* Display User Fetched Data */}
      <FormTable users={users} />
    </div>
  );
};

export default Form;