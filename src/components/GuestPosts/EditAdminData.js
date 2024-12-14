
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../context/userContext.js";



const EditAdminForm = () => {

  const { userData, localhosturl } = useContext(UserContext);



  const { id } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    userId: userData?._id,
    publisherName: "",
    verifiedStatus:false,
    publisherEmail: "",
    publisherPhoneNo: "",
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

        const response = await axios.get(`${localhosturl}/superAdmin/getOneAdminData/${id}`);
        console.log("data get ", response.data)
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminData({
      ...adminData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  

  const createDescriptionElements = ( users) => {
    const elements = [
      { key: 'Publisher URL', value: users.publisherURL },
      { key: 'Publisher Name', value: users.publisherName },
      { key: 'Publisher Email', value: users.publisherEmail },
      {key: 'Verified',value: users.verifiedStatus},
      { key: 'Publisher Phone No', value: users.publisherPhoneNo },
      { key: 'Moz DA', value: users.mozDA },
      { key: 'Categories', value: users.categories },
      { key: 'Website Language', value: users.websiteLanguage },
      { key: 'Ahrefs DR', value: users.ahrefsDR },
      { key: 'Link Type', value: users.linkType },
      { key: 'Price', value: users.price },
      { key: 'Monthly Traffic', value: users.monthlyTraffic },
      { key: 'Moz Spam Score', value: users.mozSpamScore },
      { key: 'Total results', value: users?.length }
    ];
    return elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
  };

  const generateShortDescription = (formData, users) => {

    const elements = createDescriptionElements(formData, users).split(', ');

    const shortElements = elements.slice(0, 2);

    return `You updated a guest post ${shortElements.length > 0 ? "" : "with"} ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);
    try {
      const activityData = {
        userId: userData?._id,
        action: "Updated a guest post",
        section: "Guest Post",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "update",
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
    e.preventDefault();
    try {
      const response =
        await axios.put(`${localhosturl}/superAdmin/updateOneAdminData/${id}`, adminData);
      console.log("data get ", adminData, response)
      toast.success("Admin data updated successfully");
      await pastactivitiesAdd(adminData);
     // navigate("/superadmn");
     navigate(-1)
    } catch (error) {
      toast.error("Error updating admin data");
      console.error("Error updating admin data:", error);
    }
  };


  return (
<div className="container mx-auto max-w-2xl p-5 bg-gray-50 shadow-lg rounded-lg">
<h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Edit Guestpost</h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Publisher Name */}
    <div>
      <label
        htmlFor="publisherName"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Publisher Name
      </label>
      <input
        type="text"
        id="publisherName"
        name="publisherName"
        value={adminData.publisherName}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
        required
      />
    </div>

         {/* Categories */}
    <div>
      <label
        htmlFor="categories"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Categories
      </label>
      <select
        id="categories"
        name="categories"
        value={adminData.categories}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
        required
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

        {/* Publisher Email */}
    <div>
      <label
        htmlFor="publisherEmail"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Publisher Email
      </label>
      <input
        type="email"
        id="publisherEmail"
        name="publisherEmail"
        value={adminData.publisherEmail}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
        required
      />
    </div>
       
          {/* Publisher Phone Number */}
    <div>
      <label
        htmlFor="publisherPhoneNo"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Publisher Phone No
      </label>
      <input
        type="text"
        id="publisherPhoneNo"
        name="publisherPhoneNo"
        value={adminData.publisherPhoneNo}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
      />
    </div>

        {/* Publisher URL */}
    <div>
      <label
        htmlFor="publisherURL"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Publisher URL
      </label>
      <input
        type="text"
        id="publisherURL"
        name="publisherURL"
        value={adminData.publisherURL}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
      />
    </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="ahrefsDR">
            Ahrefs DR
          </label>
          <input
            type="number"
            name="ahrefsDR"
            value={adminData.ahrefsDR}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="mozDA">
            Moz DA
          </label>
          <input
            type="number"
            name="mozDA"
            value={adminData.mozDA}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="websiteLanguage" className="block text-sm font-semibold text-gray-700 mb-1">
            Website Language
          </label>
          <select
            id="websiteLanguage"
            name="websiteLanguage"
            required
            value={adminData.websiteLanguage}
            onChange={handleChange}
            className=" w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
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
          <label htmlFor="linkType" className="block text-sm font-semibold text-gray-700 mb-1">
            Link Type
          </label>
          <select
            id="linkType"
            name="linkType"
            required
            value={adminData.linkType}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
          >
            <option value="Do Follow">Do Follow</option>
            <option value="No Follow">No Follow</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={adminData.price}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="mozSpamScore" className="block text-sm font-semibold text-gray-700 mb-1">
            Moz Spam Score
          </label>
          <select
            id="mozSpamScore"
            name="mozSpamScore"
            required
            value={adminData.mozSpamScore}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
          >

            <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
            <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
            <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
            <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
            <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
            <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="monthlyTraffic" className="block text-sm font-semibold text-gray-700 mb-1">
            Monthly Traffic
          </label>
          <select
            id="monthlyTraffic"
            name="monthlyTraffic"
            required
            value={adminData.monthlyTraffic}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm p-3"
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


           {/* Verified Checkbox */}
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id="verifiedStatus"
        name="verifiedStatus"
        checked={adminData.verifiedStatus}
        onChange={handleChange}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor="verifiedStatus" className="text-sm font-medium text-gray-800">
        Verified
      </label>
    </div>

    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Guestpost
      </button>
    </div>
      </form>
    </div>
  );
};

export default EditAdminForm;
