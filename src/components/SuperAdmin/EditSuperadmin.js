import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { UserContext } from '../../context/userContext.js';
import { useParams } from 'react-router-dom';

const EditSuperadmin = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const {id}=useParams()
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const response = await axios.get(`${localhosturl}/user/getUserId/${id}`);
        console.log(response.data.data)
        setUsers(response.data.data);
        setFormData(response.data.data)
        //pastactivitiesAdd(response.data.users);
      } catch (error) {
        console.error('Error fetching influencer data:', error);
      }
    };

    fetchUsers();
  }, [id]);


  

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.put(`${localhosturl}/user/updateUse/${id}`, formData)
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
      
    } catch (error) {    
    }
 
    };
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
       {/* <button
          type="reset"
          onClick={handleReset}
          className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:animate-resetColorChange"
        >
          Reset
        </button>*/}
        <button
          type="submit"
          className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-submitColorChange"
        >
          Update User
        </button>
      </div>
    </form>


    

  
  </div>
  )
}

export default EditSuperadmin