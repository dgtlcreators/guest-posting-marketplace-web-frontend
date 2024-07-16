/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../context/userContext";

const EditAdminForm = () => {
  const { userData } = useContext(UserContext);

 
console.log(userData)
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    publisherName: "",
    publisherEmail: "",
    publisherNumber: "",
    publisherURL: "",
    ahrefsDR: "",
    mozDA: "",
    websiteLanguage: "",
    linkType: "",
    price: "",
    mozSpamScore: "",
    monthlyTraffic: "",
    categories: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        
      //  const response = await axios.get(`http://localhost:5000/superAdmin/getOneAdminData/${id}`);
      const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/getOneAdminData/${id}`);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
     // await axios.put(`http://localhost:5000/superAdmin/updateOneAdminData/${id}`, adminData);
     await axios.put(`https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/updateOneAdminData/${id}`, adminData);
      toast.success("Admin data updated successfully");
      navigate("/superadmin");
    } catch (error) {
      toast.error("Error updating admin data");
      console.error("Error updating admin data:", error);
    }
  };
  if (!userData || userData.role !== "Admin" ) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Admin Data</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisherName">
            Publisher Name
          </label>
          <input
            type="text"
            name="publisherName"
            value={adminData.publisherName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
            <label htmlFor="categories" className="font-medium">
              Categories
            </label>
            <select
              id="categories"
              name="categories"
              required
              value={adminData.categories}
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisherEmail">
            Publisher Email
          </label>
          <input
            type="email"
            name="publisherEmail"
            value={adminData.publisherEmail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisherNumber">
            Publisher Number
          </label>
          <input
            type="text"
            name="publisherNumber"
            value={adminData.publisherPhoneNo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisherURL">
            Publisher URL
          </label>
          <input
            type="text"
            name="publisherURL"
            value={adminData.publisherURL}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ahrefsDR">
            Ahrefs DR
          </label>
          <input
            type="number"
            name="ahrefsDR"
            value={adminData.ahrefsDR}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mozDA">
            Moz DA
          </label>
          <input
            type="number"
            name="mozDA"
            value={adminData.mozDA}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
            <label htmlFor="websiteLanguage" className="font-medium">
              Website Language
            </label>
            <select
              id="websiteLanguage"
              name="websiteLanguage"
              required
              value={adminData.websiteLanguage}
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
            <label htmlFor="linkType" className="font-medium">
              Link Type
            </label>
            <select
              id="linkType"
              name="linkType"
              required
              value={adminData.linkType}
              onChange={handleChange}
              className="form-input border rounded p-2"
            >
              <option value="Do Follow">Do Follow</option>
              <option value="No Follow">No Follow</option>
            </select>
          </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={adminData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col">
            <label htmlFor="mozSpamScore" className="font-medium">
              Moz Spam Score
            </label>
            <select
              id="mozSpamScore"
              name="mozSpamScore"
              required
              value={adminData.mozSpamScore}
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
        <div className="flex flex-col">
            <label htmlFor="monthlyTraffic" className="font-medium">
              Monthly Traffic
            </label>
            <select
              id="monthlyTraffic"
              name="monthlyTraffic"
              required
              value={adminData.monthlyTraffic}
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Update Admin
        </button>
      </form>
    </div>
  );
};

export default EditAdminForm;














/*import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const AdminRoute = ({ children }) => {
  const { userData } = useContext(UserContext);

  if (!userData || userData.role !== "Admin") {
    return <Navigate to="/login" />;
  }
console.log(userData)
  return children;
};

export default AdminRoute;*/
