import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NewSuperAdminTable from "./NewSuperAdminTable.js"
import { useTheme } from '@emotion/react';
import { UserContext } from '../../context/userContext.js';
import { toast } from 'react-toastify';



const NewSuperAdmin = () => {
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
        bookmark: true,
        apply: true,
        profile: true, 
        showprofile: true, 
        filter: true
      },
      youtube: {
        add: false,
        edit: false,
        delete: false,
        bookmark: true,
        apply: true,
        profile: true, 
        showprofile: true, 
        filter: true
      },
      contentWriter: {
        add: false,
        edit: false,
        delete: false,
        bookmark: true,
        apply: true,
        profile: true, 
        showprofile: true, 
        filter: true
      },
      guestPost: {
        add: false,
        edit: false,
        delete: false,
        bookmark: true,
        apply: true,
        profile: true, 
        showprofile: true, 
        filter: true
      }
    }
  }
  const [formData, setFormData] = useState(initialUser);
  const [refreshKey, setRefreshKey] = useState(0);

  const [tooltip, setTooltip] = useState(null);

  const handleMouseEnter = (e, message) => {
    setTooltip({ message, top: e.clientY, left: e.clientX });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handlePermissionChange = (e, module, field) => {

    if (formData.role === 'User' || formData.role === 'Brand User') {
      // Don't allow toggling permissions for User and Brand User
      return;
    }

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
          setFormData(initialUser);
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'Brand User',
            permissions: {
              instagram: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
              youtube: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
              contentWriter: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
              guestPost: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true }
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

  useEffect(() => {
    
    if (formData.role === 'Admin' || formData.role === 'Super Admin') {
      // Automatically check 'add', 'edit', 'delete' for Admin and Super Admin
      setFormData((prevState) => ({
        ...prevState,
        permissions: {
          instagram: { add: true, edit: true, delete: true,bookmark: true, apply: true, profile: true,showprofile:true,filter:true },
          youtube: { add: true, edit: true, delete: true,bookmark: true, apply: true, profile: true,showprofile:true,filter:true },
          contentWriter: { add: true, edit: true, delete: true,bookmark: true, apply: true, profile: true,showprofile:true,filter:true },
          guestPost: { add: true, edit: true, delete: true,bookmark: true, apply: true, profile: true,showprofile:true,filter:true },
        },
      }));
    } else {
      // Disable 'add', 'edit', 'delete' for User and Brand User
      setFormData((prevState) => ({
        ...prevState,
        permissions: {
          instagram: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true,showprofile:true,filter:true  },
            youtube: { add: false, edit: false, delete: false, bookmark: true, apply: true , profile: true,showprofile:true,filter:true },
            contentWriter: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true,showprofile:true,filter:true },
            guestPost: { add: false, edit: false, delete: false, bookmark: true, apply:true, profile: true,showprofile:true,filter:true  }
         },
      }));
    }
  }, [formData.role]);

  /**
   * another 
   * useEffect(() => {
    if (formData.role === 'Admin' || formData.role === 'Super Admin') {
      setFormData(prevState => ({
        ...prevState,
        permissions: {
          instagram: { add: true, edit: true, delete: true, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          youtube: { add: true, edit: true, delete: true, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          contentWriter: { add: true, edit: true, delete: true, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          guestPost: { add: true, edit: true, delete: true, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        permissions: {
          instagram: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          youtube: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          contentWriter: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
          guestPost: { add: false, edit: false, delete: false, bookmark: true, apply: true, profile: true, showprofile: true, filter: true },
        },
      }));
    }
  }, [formData.role]);
  /*
   */


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-3 p-3"//"text-2xl font-bold mb-4 text-blue-600 text-white bg-blue-700 "
      >Users</h2>
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
              <label className="text-lg mb-2">{module.charAt(0).toUpperCase() + module.slice(1)}</label>
              <div className="flex flex-wrap gap-4">
                {['add', 'edit', 'delete', "bookmark", "apply", "profile", "showprofile", "filter"].map((action) => (
                  <label key={action} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`${module}_${action}`}
                      checked={formData.permissions[module][action]}
                      onChange={(e) => handlePermissionChange(e, module, action)}
                      className="btn-dis form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                      disabled={(formData.role === 'User' || formData.role === 'Brand User') &&
                        (action === 'add' || action === 'edit' || action === 'delete')}
                      title={((formData.role === 'User' || formData.role === 'Brand User') &&
                        (action === 'add' || action === 'edit' || action === 'delete'))
                        ? `${formData.role} are not allowed to access this feature`
                        : undefined //: "Click to toggle permission"
                      }
                    />
                    <span className="">{action}</span>

                  </label>
                ))}
              </div>
            </div>
          ))}
          {/*tooltip && (
          <div
            className="absolute bg-gray-800 text-white text-xs p-2 rounded"
            style={{ top: tooltip.top, left: tooltip.left }}
          >
            {tooltip.message}
          </div>
        )*/}
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
      <NewSuperAdminTable key={refreshKey} users={users} setUsers={setUsers} />


    </div>
  );
};

export default NewSuperAdmin;
