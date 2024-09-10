import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import NewSuperAdminTable from "./NewSuperAdminTable"

const Superadmin = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    instagramAdd: false,
    instagramEdit: false,
    instagramDelete: false,
    instagramBookmark: false,
    instagramApply: false,
    youtubeAdd: false,
    youtubeEdit: false,
    youtubeDelete: false,
    youtubeBookmark: false,
    youtubeApply: false,
    contentWriterAdd: false,
    contentWriterEdit: false,
    contentWriterDelete: false,
    contentWriterBookmark: false,
    contentWriterApply: false,
    guestPostAdd: false,
    guestPostEdit: false,
    guestPostDelete: false,
    guestPostBookmark: false,
    guestPostApply: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${localhosturl}/user/userFilters`, formData);
      console.log(response.data);
      setUsers(response.data.data)
      // pastactivitiesAdd(response.data.data);
      toast.success("Data Fetch Successfully");
    } catch (error) {
      console.error('Error fetching users:', error);

    }
  };
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      const formattedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, typeof value === 'boolean' ? value.toString() : value])
      );
  
      const response = await axios.post(`${localhosturl}/user/userFilters`, formattedFormData);
      //console.log(response.data);
      setUsers(response.data.data)
      toast.success("Data Fetch Successfully");
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Error fetching users");
    }
  };
  

  return (
    <div>
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
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="block">
            <label className="text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Role</option>
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
              <label className="text-lg mb-2">{module.charAt(0).toUpperCase() + module.slice(1)}</label>
              <div className="flex flex-wrap gap-4">
                {['add', 'edit', 'delete', 'bookmark', 'apply'].map((action) => (
                  <label key={action} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`${module}${action.charAt(0).toUpperCase() + action.slice(1)}`}
                      checked={formData[`${module}${action.charAt(0).toUpperCase() + action.slice(1)}`]}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span>{action}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-2 mt-3">
          <button
            type="reset"
            onClick={() => setFormData({
              name: '',
              email: '',
              role: '',
              instagramAdd: false,
              instagramEdit: false,
              instagramDelete: false,
              instagramBookmark: false,
              instagramApply: false,
              youtubeAdd: false,
              youtubeEdit: false,
              youtubeDelete: false,
              youtubeBookmark: false,
              youtubeApply: false,
              contentWriterAdd: false,
              contentWriterEdit: false,
              contentWriterDelete: false,
              contentWriterBookmark: false,
              contentWriterApply: false,
              guestPostAdd: false,
              guestPostEdit: false,
              guestPostDelete: false,
              guestPostBookmark: false,
              guestPostApply: false,
            })}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Filter
          </button>
        </div>
      </form>
      <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
      >
        Users List
      </h2>
      <NewSuperAdminTable key={refreshKey} users={users} setUsers={setUsers}/>

    </div>
  )
};

export default Superadmin;
