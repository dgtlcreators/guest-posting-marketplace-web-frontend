import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeProvider.js";
import { UserContext } from "../context/userContext.js";


const ContactForm = ({ publisher, onClose ,url}) => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext); 
  console.log(publisher)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    publisherId: publisher._id,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send contact form data to backend
      const response = await axios.post(
        `${localhosturl}/${url}/addContact`,
      // `https://guest-posting-marketplace-web-backend.onrender.com/${url}/addContact`,
       // "http://localhost:5000/superAdmin/addContact",
       //  "https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/addContact",
        {
          publisherId: publisher._id,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }
      );
      console.log(response)
      toast.success("Contact form submitted successfully");
      onClose(); 
    } catch (error) {
      console.log("Error submitting contact form:", error)
      toast.error("Error submitting contact form");
      console.error("Error submitting contact form:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Contact Publisher</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label className="font-medium mb-2">Your Name</label>
          <input
            type="text"
            className="form-input border rounded p-2"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-medium mb-2">Your Email</label>
          <input
            type="email"
            className="form-input border rounded p-2"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-medium mb-2">Message</label>
          <textarea
            className="form-input border rounded p-2"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ContactForm;
