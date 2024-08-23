/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import axios from "axios";
import SuperAdminTable from "./SuperAdminTable.js";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext.js";
import { useTheme } from "../context/ThemeProvider.js";


const SuperAdmin = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { userData } = useContext(UserContext); 
  const userId = userData?._id;
 
  const initialFormData = {
    publisherURL: "",
    publisherName: "",
    publisherEmail: "",
    publisherPhoneNo: "",
    mozDA: "1",
    categories: "Agriculture",
    websiteLanguage: "English",
    ahrefsDR: "1",
    linkType: "Do Follow",
    price: "1",
    monthlyTraffic: "Monthly Traffic >= 1000",
    mozSpamScore: "Spam Score <= 01",
    userId:userId,
    // siteWorkedWith: "",
    // publisherRole: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value === "0" ? "" : value,
    }));
  };
  const pastactivitiesAdd1=async(users)=>{
    
    const description = [
      "You created a new guest post with ",
      formData.publisherURL?`Publisher URL: ${formData.publisherURL}`:"",
      formData.publisherName?`Publisher Name: ${formData.publisherName}`:"",
      formData.publisherEmail?`Publisher Email: ${formData.publisherEmail}`:"",
      formData.publisherPhoneNo?`Publisher Phone No: ${formData.publisherPhoneNo}`:"",
      formData.mozDA?`MozDA: ${formData.mozDA}`:"",
      formData.categories?`Categories: ${formData.categories}`:"",
      formData.websiteLanguage?`Website Language: ${formData.websiteLanguage}`:"",
      formData.ahrefsDR?`Ahrefs DR: ${formData.ahrefsDR}`:"",
      formData.linkType?`Link Type: ${formData.linkType}`:"",
      formData.price?`Price: ${formData.price}`:"",
      formData.monthlyTraffic?`Monthly Traffic: ${formData.monthlyTraffic}`:"",
      formData.mozSpamScore?`MozSpam Score: ${formData.mozSpamScore}`:"",
      
      `Total results: ${users.length}`
    ]
    .filter(Boolean)
    .join(', ');
   // const shortDescription = `You searched ${formData.mozDA ? 'Moz DA' : 'Ahrefs DR'} from ${formData.mozDA || formData.ahrefsDR} to ${formData.DAto || formData.DRto} and got ${users.length} results`;

   const getShortDescription = () => {
    const elements = [];

    // List of possible fields in priority order
    const fields = [
        formData.mozDA ? `Moz DA ${formData.mozDA}` : "",
        formData.ahrefsDR ? `Ahrefs DR ${formData.ahrefsDR}` : "",
        formData.linkType ? `Link Type ${formData.linkType}` : "",
        formData.price ? `Price ${formData.price}` : "",
        formData.categories ? `Categories ${formData.categories}` : "",
        formData.websiteLanguage?`Website Language: ${formData.websiteLanguage}`:"",
        formData.monthlyTraffic?`Monthly Traffic: ${formData.monthlyTraffic}`:"",
      formData.mozSpamScore?`MozSpam Score: ${formData.mozSpamScore}`:"",

        formData.publisherURL?`Publisher URL: ${formData.publisherURL}`:"",
      formData.publisherName?`Publisher Name: ${formData.publisherName}`:"",
      formData.publisherEmail?`Publisher Email: ${formData.publisherEmail}`:"",
      formData.publisherPhoneNo?`Publisher Phone No: ${formData.publisherPhoneNo}`:"",
    ];

    for (const field of fields) {
        if (field) {
            elements.push(field);
        }
        if (elements.length === 2) break;  
    }

    // Construct the short description
    return `You created a new guest post with ${elements.join(' and ')} successfully.`;//and got ${users.length} results.
};


const shortDescription = getShortDescription();
   try {
    const activityData={
      userId:userData?._id,
      action:"Created a new guest post",
      section:"Guest Post",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"create",
        filter:{formData,total:users.length},
        description,
        shortDescription
        

      }
    }
    
    axios.post("https://guest-posting-marketplace-web-backend.onrender.com/pastactivities/createPastActivities", activityData)
   // axios.post("http://localhost:5000/pastactivities/createPastActivities", activityData)
   } catch (error) {
    console.log(error);
    
   }
  }

  const createDescriptionElements = (formData, users) => {
    const elements = [
        { key: 'Publisher URL', value: formData.publisherURL },
        { key: 'Publisher Name', value: formData.publisherName },
        { key: 'Publisher Email', value: formData.publisherEmail },
        { key: 'Publisher Phone No', value: formData.publisherPhoneNo },
        { key: 'Moz DA', value: formData.mozDA },
        { key: 'Categories', value: formData.categories },
        { key: 'Website Language', value: formData.websiteLanguage },
        { key: 'Ahrefs DR', value: formData.ahrefsDR },
        { key: 'Link Type', value: formData.linkType },
        { key: 'Price', value: formData.price },
        { key: 'Monthly Traffic', value: formData.monthlyTraffic },
        { key: 'Moz Spam Score', value: formData.mozSpamScore },
        { key: 'Total results', value: users?.length }
    ];

    const formattedElements = elements
        .filter(element => element.value)
        .map(element => `${element.key}: ${element.value}`)
        .join(', ');
        return `You created ${formattedElements}`;
};
const generateShortDescription = (formData, users) => {
  const elements = createDescriptionElements(formData, users).split(', ');
  
 
  const shortElements = elements.slice(0, 2);

  return `You created a new guest post with ${shortElements.join(' and ')} successfully.`;
};

  const pastactivitiesAdd=async(users)=>{
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);
  
   try {
    const activityData={
      userId:userData?._id,
      action:"Created a new guest post",
      section:"Guest Post",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"create",
        filter:{formData,total:users.length},
        description,
        shortDescription
        

      }
    }
    
    axios.post("https://guest-posting-marketplace-web-backend.onrender.com/pastactivities/createPastActivities", activityData)
    //axios.post("http://localhost:5000/pastactivities/createPastActivities", activityData)
   } catch (error) {
    console.log(error);
    
   }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      await axios.post(
       //"http://localhost:5000/admin/createAdminData",
      "https://guest-posting-marketplace-web-backend.onrender.com/admin/createAdminData",
        formData
      );
      // console.log(initialFormData)
      toast.success("Client Created Successfully");
      setFormData(initialFormData);
      pastactivitiesAdd(formData);
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error(error.message);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3  p-3"//text-white bg-blue-700
      >
        Super Admin Page
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 md:space-y-8 bg-gray-200 shadow-xl p-4"
      >
        {/* 1st Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="mozDA" className="font-medium">
              Moz DA
            </label>
            <input
              type="number"
              id="mozDA"
              name="mozDA"
              min="1"
              max="100"
              required
              placeholder="1"
              value={formData.mozDA}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="categories" className="font-medium">
              Categories
            </label>
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              {/* Options */}
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
            <label htmlFor="websiteLanguage" className="font-medium">
              Website Language
            </label>
            <select
              id="websiteLanguage"
              name="websiteLanguage"
              value={formData.websiteLanguage}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              {/* Options */}
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
          <div className="flex flex-col">
            <label htmlFor="publisherURL" className="font-medium">
              Publisher URL
            </label>
            <input
              type="url"
              id="publisherURL"
              name="publisherURL"
              title="Please ensure to provide proper format of the url"
              required
              pattern="https?://.*"
              placeholder="https://www.google.com"
              value={formData.publisherURL}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
        </div>

        {/* 2nd Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="ahrefsDR" className="font-medium">
              Ahrefs DR
            </label>
            <input
              type="number"
              id="ahrefsDR"
              name="ahrefsDR"
              min="1"
              max="100"
              required
              placeholder="1"
              value={formData.ahrefsDR}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="linkType" className="font-medium">
              Link Type
            </label>
            <select
              id="linkType"
              name="linkType"
              value={formData.linkType}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="Do Follow">Do Follow</option>
              <option value="No Follow">No Follow</option>
            </select>
          </div>
        </div>

        {/* 3rd Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="price" className="font-medium">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="1"
              max="100000"
              required
              placeholder="1"
              value={formData.price}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="monthlyTraffic" className="font-medium">
              Monthly Traffic
            </label>
            <select
              id="monthlyTraffic"
              name="monthlyTraffic"
              value={formData.monthlyTraffic}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              {/* Options */}
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
            <label htmlFor="mozSpamScore" className="font-medium">
              Moz Spam Score
            </label>
            <select
              id="mozSpamScore"
              name="mozSpamScore"
              value={formData.mozSpamScore}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              {/* Options */}
              <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
              <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
              <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
              <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
              <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
              <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
            </select>
          </div>
        </div>

        {/* 4th Row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="siteWorkedWith" className="font-medium">
              Sites {"I've (haven't)"} Worked With
            </label>
            <select
              id="siteWorkedWith"
              name="siteWorkedWith"
              value={formData.siteWorkedWith}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="allWebsitesWorkedWith">All Websites</option>
              <option value="excludeSitesWorkedWith">
                Exclude Sites {"I've"} Worked With
              </option>
              <option value="onlySitesWorkedWith">
                Only Sites {"I've"} Worked With
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="publisherRole" className="font-medium">
              Publisher Role
            </label>
            <select
              id="publisherRole"
              name="publisherRole"
              value={formData.publisherRole}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="allWebsitesRole">All Websites</option>
              <option value="websitesByOwner">Websites added by Owner</option>
              <option value="websitesByContributors">
                Websites added by Contributors
              </option>
            </select>
          </div>
        </div> */}

        {/* 5th Row - New Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="publisherName" className="font-medium">
              Publisher Name
            </label>
            <input
              type="text"
              id="publisherName"
              name="publisherName"
              required
              value={formData.publisherName}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="publisherEmail" className="font-medium">
              Publisher Email
            </label>
            <input
              type="email"
              id="publisherEmail"
              name="publisherEmail"
              required
              value={formData.publisherEmail}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="publisherPhoneNo" className="font-medium">
              Publisher Phone No.
            </label>
            <input
              type="tel"
              id="publisherPhoneNo"
              name="publisherPhoneNo"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
              required
              value={formData.publisherPhoneNo}
              onChange={handleChange}
              className="form-input border rounded p-2"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center md:justify-end space-x-4 mt-8">
          <button
            type="reset"
            className="form-button bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
            onClick={() => setFormData(initialFormData)}
          >
            Reset
          </button>
          <button
            type="submit"
            className="form-button bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
  
      <SuperAdminTable key={refreshKey} />
    </div>
  );
};

export default SuperAdmin;