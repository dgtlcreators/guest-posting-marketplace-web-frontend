import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewSuperAdminTable from "./NewSuperAdminTable.js"
import { useTheme } from '@emotion/react';
import { UserContext } from '../../context/userContext.js';
import { toast } from 'react-toastify';



const SuperAdmin = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const [users, setUsers] = useState([]);
  
  const initialUser = {
    name: '',
    email: '',
    password: '',
    role: 'Brand User',
    permissions: {
      instagram: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      youtube: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      contentWriter: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      },
      guestPost: {
        add: false,
        edit: false,
        delete: false,
        bookmark: false,
        apply: false
      }
    }
  }
  const [formData, setFormData] = useState(initialUser);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handlePermissionChange = (e, module, field) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [field]: e.target.checked
        }
      }
    });
  };


  


  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:5000/user/deleteUser/${id}`)
      .then(() => setUsers(users.filter(user => user._id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleReset = () => {
    setFormData(initialUser);

  }

  const createDescriptionElements = (formData, users) => {
    const formatValue = (value) => {
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2); // Pretty-print object
      }
      return value;
    };
  
    const elements = [
      { key: 'Name', value: formData.name },
      { key: 'Email', value: formData.email },
      { key: 'Role', value: formData.role },
      { key: 'Bio', value: formData.bio },
      { key: 'Permissions (Instagram)', value: formatValue(formData.permissions.instagram) },
      { key: 'Permissions (YouTube)', value: formatValue(formData.permissions.youtube) },
      { key: 'Permissions (ContentWriter)', value: formatValue(formData.permissions.contentWriter) },
      { key: 'Permissions (GuestPost)', value: formatValue(formData.permissions.guestPost) },
      { key: 'Total Results', value: users?.length }
    ];


    const formattedElements = elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
    return `${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You created a new User with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Created a new User",
        section: "User",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "create",
          filter: { formData, total: users.length },
          description,
          shortDescription


        }
      }
      axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData)
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    axios.post(`${localhosturl}/user/addUser`, formData)
    .then(response => {
      setUsers([...users, response.data.user]);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Brand User',
        permissions: {
          instagram: { add: false, edit: false, delete: false, bookmark: false, apply: false },
          youtube: { add: false, edit: false, delete: false, bookmark: false, apply: false },
          contentWriter: { add: false, edit: false, delete: false, bookmark: false, apply: false },
          guestPost: { add: false, edit: false, delete: false, bookmark: false, apply: false }
        }
      });
    })
    toast.success("User Added Successfully")
    
  } catch (error) {
    toast.error(`Error Adding User: ${error.message}`);
    console.error("Error Adding User:", error);
  }
   
  };
  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${localhosturl}/user/getAllUser`)
            console.log(response.data.users)
            setUsers(response.data.users)
            //setOriginalUsers(response.data.users)
        } catch (error) {
            console.error("Error fetching Users", error);
        }
    }

    fetchUsers();

}, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-3 p-3"//"text-2xl font-bold mb-4 text-blue-600 text-white bg-blue-700 "
      >Users</h1>
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="block">
            <label className="text-gray-700">Name</label>
            <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={formData.name} 
            onChange={handleChange}  
            className="p-2 border border-gray-300 rounded w-full" 
            required />
          </div>
          <div className="block">
            <label className="text-gray-700">Email</label>
            <input type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange}  
            className="p-2 border border-gray-300 rounded w-full" required />
          </div>
          <div className="block">
            <label className="text-gray-700">Password</label>
            <input type="text" 
            name="password" 
            placeholder="Password" 
            value={formData.password} onChange={handleChange}  
            className="p-2 border border-gray-300 rounded w-full" required />
          </div>
          <div className="block">
            <label className="text-gray-700">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
           className="p-2 border border-gray-300 rounded w-full" required  >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Brand User">Brand User</option>
        </select>
          </div>
        </div>


       
        
       
        <div className="mt-4">
    {['instagram', 'youtube', 'contentWriter', 'guestPost'].map((module) => (
      <div key={module} className="mb-4">
        <label className="text-lg  mb-2">{module.charAt(0).toUpperCase() + module.slice(1)}</label>
        <div className="flex flex-wrap gap-4">
          {['add', 'edit', 'delete',// 'bookmark', 'apply'

          ].map((action) => (
            <label key={action} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`${module}_${action}`}
                checked={formData.permissions[module][action]}
                onChange={(e) => handlePermissionChange(e, module, action)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span className="">{action}</span>
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>


      
        

        <div className="flex items-center justify-end space-x-2 mt-3">
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:animate-resetColorChange"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-submitColorChange"
          >
            Add User
          </button>
        </div>
      </form>


      <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
      >
        Users List
      </h2>
      <NewSuperAdminTable key={refreshKey} users={users} setUsers={setUsers}/>

    
    </div>
  );
};

export default SuperAdmin;












/* 
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
              
              <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
              <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
              <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
              <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
              <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
              <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
            </select>
          </div>
        </div>

       
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
        </div> ///last}

        
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
*/