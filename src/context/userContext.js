

import axios from "axios";
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [userData, setUserData] = useState(() => {
   
    const storedUser = localStorage.getItem("user");
   
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        return null; 
      }
    }
    return null; 
  });
 

const localhosturl="http://localhost:5000"
//const localhosturl="https://guest-posting-marketplace-web-backend.onrender.com"
//const localhosturl="https://guest-posting-marketplace-web-backend-1.onrender.com"
//const localhosturl="https://guest-posting-marketplace-web-backend-2.onrender.com"
//const localhosturl="https://guest-posting-marketplace-web-backend-mu57.onrender.com"




  const updateUserData = useCallback(
    (data) => {
      
      setUserData(data);
      console.log("localStorage ",data)
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        localStorage.removeItem("user");
      }
    },
    [setUserData]
  );




  const signOut = useCallback(() => {
    setUserData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logout successfully")
  }, []);

  useEffect(() => {
    
    
   
    if (userData !== null) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  }, [userData]);

  

  const userId = userData?.id;
  

  const [notifications, setNotifications] = useState([]);


  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`); 

      setNotifications(response.data.data);
  
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };
  useEffect(() => {
    fetchNotifications()
   
  }, [fetchNotifications, localhosturl]);


  return (
    <UserContext.Provider value={{ userData, setUserData: updateUserData ,signOut,localhosturl,notifications, fetchNotifications, addNotification ,setNotifications}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };