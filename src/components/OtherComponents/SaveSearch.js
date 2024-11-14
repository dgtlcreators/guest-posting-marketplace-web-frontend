import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider.js';
import { toast } from 'react-toastify';

const SaveSearch = ({ section, formDataList }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();
  const userId = userData?._id;
  // const publisherId = publisher?._id;
  const handleSaveSearch =async () => {
  //  const response = await axios.post(`${localhosturl}/applyroute/apply`)
  try {
    const response = await axios.post(`${localhosturl}/savefilterroute/createsavefilter`, {
      userId,
     // publisherId,
     formData:formDataList,
      section,
    });
    toast.success("Save Search Successfully");
  } catch (error) {
    console.log("Error Save Search data:", error);
      toast.error(error.message);
  }
   }

  return (
    <div>
      
      <button
        type="button"
        onClick={handleSaveSearch}
        className="py-2 px-4 bg-green-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105"
      >
        Save Search
      </button>
    </div>
  )
}

export default SaveSearch