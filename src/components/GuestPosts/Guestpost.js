/* eslint-disable react/prop-types */

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GuestpostTable from "./GuestpostTable.js";
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext.js";
import { useTheme } from "../../context/ThemeProvider.js";
import SaveSearch from "../OtherComponents/SaveSearch.js";
import { useLocation } from "react-router-dom";


const Guestpost = () => {
 
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext); 
  const userId = userData?._id;
 // console.log(userData,userId)

  const initialFormData = {
    userId:userData?._id || "",
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
    publisherName: "",
    userId:userId
  };

  const [formData, setFormData] = useState(initialFormData);
 


  const [users, setUsers] = useState([]);


  const location = useLocation();
  const [toastShown, setToastShown] = useState(false);
  useEffect(() => {
    if (location?.state?.formData) {
      const formData = location.state.formData;
     
      const flattenedFormData = formData["0"] || formData; 
      console.log("Flattened FormData", flattenedFormData);
  
      setFormData(prevState => ({
        ...initialFormData,
        ...flattenedFormData
      }));
      fetchUsers(formData)
      location.state.formData = null; 
    }
  }, [location?.state?.formData]);
  
const fetchUsers=async(formData)=>{
  try {
    const response = await axios.post(
      `${localhosturl}/form/getFilteredData`
     
      , formData);
    console.log("Fetched data:", response.data);
    setUsers(response.data);

   
    if (!toastShown) {
      toast.success("Saved Data Fetch Successfully");
      setToastShown(true); 
    }
   // toast.success("Saved Data Fetch Successfully");
  } catch (error) {
    console.log("Error fetching data:", error);
    toast.error(error.message);
  }
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value || "",
    });
  };

  

  const handleReset = () => {
    setFormData(initialFormData)
  }
  const pastactivitiesAdd=async(users)=>{
    const description = [
      formData.mozDA ? `Moz DA from ${formData.mozDA}` : '',
    formData.DAto ? `to ${formData.DAto}` : '',
    formData.ahrefsDR ? `Ahrefs DR from ${formData.ahrefsDR}` : '',
    formData.DRto ? `to ${formData.DRto}` : '',
    formData.price ? `Price from ${formData.price}` : '',
    formData.priceTo ? `to ${formData.priceTo}` : '',
    formData.categories ? `Categories: ${formData.categories}` : '',
    formData.websiteLanguage ? `Website Language: ${formData.websiteLanguage}` : '',
    formData.linkType ? `Link Type: ${formData.linkType}` : '',
    formData.monthlyTraffic ? `Monthly Traffic: ${formData.monthlyTraffic}` : '',
    formData.mozSpamScore ? `Moz Spam Score: ${formData.mozSpamScore}` : '',
    formData.publisherURL ? `Publisher URL: ${formData.publisherURL}` : '',
    formData.publisherName ? `Publisher Name: ${formData.publisherName}` : '',
     
      
      `Total results: ${users.length}`
    ]
    .filter(Boolean)
    .join(', ');
    const shortDescription = `You searched ${formData.mozDA ? 'Moz DA' : 'Ahrefs DR'} from ${formData.mozDA || formData.ahrefsDR} to ${formData.DAto || formData.DRto} and got ${users.length} results`;

   try {
    const activityData={
      userId:userData?._id,
      action:"Performed a search for guest posts",//"Searched for guest posts",
      section:"Guest Post",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"filter",
        filter:{formData,total:users.length},
        description,
        shortDescription
        

      }
    }
    
   
    axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData)
   } catch (error) {
    console.log(error);
    
   }
  }

  axios.defaults.withCredentials = true;

  
    /*const handleSubmit = async(e) => {
    e.preventDefault();
   const response =  await axios
      .post("http://localhost:5000/form/getFilteredData", formData)
    //.post("https://guest-posting-marketplace-web-backend.onrender.com/form/getFilteredData", formData)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
         pastactivitiesAdd(response.data)
        toast.success("Data Fetch Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };*/
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${localhosturl}/form/getFilteredData`
       
        , formData);
      console.log("Fetched data:", response.data);
      setUsers(response.data);
  
      // Call pastactivitiesAdd without await since handleSubmit is already async
      pastactivitiesAdd(response.data);
  
      toast.success("Data Fetch Successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error(error.message);
    }
  };

  const handleSaveSearch = () => {
    // Save the form data to local storage or send it to the server
    //localStorage.setItem("savedSearch", JSON.stringify(formData));
    toast.success("Search saved successfully!");
  };
  console.log("Checking FormData ",formData)

  return (
    <div className="p-4">
      <h1 className="text-2xl  p-2 my-2"//text-white bg-blue-700
      >FAQ</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-xl p-4 relative"
      >
       
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
            <label htmlFor="publisherURL" //className="font-medium"
            >
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
          <div className="flex flex-col">
            <label htmlFor="publisherName" //className="font-medium"
            >
            Publisher Name
            </label>
            <input
              type="text"
              id="publisherName"
              name="publisherName"
             // title="Please ensure to provide proper format of the name"
              //pattern="https?://.*"
              placeholder="Publisher Name"
              value={formData.publisherName}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
        </div>

        
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

       
        <div className="flex items-center justify-end space-x-2">
       {/* <button
            type="button"
            onClick={handleSaveSearch}
            className="py-2 px-4 bg-green-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105"
          >
            Save Search
          </button>*/}
           <SaveSearch section="Guestpost" formDataList={formData}/>
          <button
          
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Reset
          </button>
          <button
           disabled={userData?.permissions?.guestPost?.filter !== undefined ? !userData.permissions.guestPost.filter : true}

           title={!userData?.permissions?.guestPost?.filter
              ? "You are not allowed to access this feature":undefined
              // : ""
           }
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>

      {/* Display User Fetched Data */}
      <div className="mt-4">
          <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
        >
          Guestpost List
          </h2>
      <GuestpostTable users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default Guestpost;