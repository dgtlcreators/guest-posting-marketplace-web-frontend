/* eslint-disable react/prop-types */

// import { createContext, useState, useEffect } from "react";

// const UserContext = createContext();

// const UserProvider = ({children}) => {
//     const [userData, setUserData] = useState(() => {
//       // Retrieve user data from localStorage if available
//       const storedUser = localStorage.getItem("user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     });

//     useEffect(() => {
//       // Update localStorage whenever userData changes
//       if (userData) {
//         localStorage.setItem("user", JSON.stringify(userData));
//       } else {
//         localStorage.removeItem("user");
//       }
//     }, [userData]);
    
//     return (
//       <UserContext.Provider value={{ userData, setUserData }}>
//         {children}
//       </UserContext.Provider>
//     );
// }

// export {UserContext, UserProvider}




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
 /* const [userData, setUserData] = useState(() => {
    
    const storedUser = localStorage.getItem("user");
console.log("storedUser ",storedUser)
try {
  return storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Failed to parse user data from localStorage", error);
  return null;
}
   
   // return storedUser ? JSON.parse(storedUser) : null;
  });*/

//const localhosturl="http://localhost:5000"
//const localhosturl="https://guest-posting-marketplace-web-backend.onrender.com"
//const localhosturl="https://guest-posting-marketplace-web-backend-1.onrender.com"
const localhosturl="https://guest-posting-marketplace-web-backend-2.onrender.com"


const [loading, setLoading] = useState(true);


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
  

 /* useEffect(() => {
    console.log("checking userData 6 ",userData)
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${localhosturl}/user/getUserId/${userId}`);
        console.log("This is response ",response)
        const data = await response.json();
        updateUserData(data);
        console.log("checking userData 7 ",userData)
      } catch (error) {
        toast.error("Unable to fetch user data");
      } finally {
        //setLoading(false);
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [userData, updateUserData, localhosturl]);*/

  const [notifications, setNotifications] = useState([]);

 // const fetchNotifications = async (localhosturl) => {
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`); 
          //console.log("response.data ",response.data)
         // console.log("response.data.data ",response.data.data)
     // const response = await axios.get(`${localhosturl}/notificationroute/getAllNotifications`);
      //console.log(response.data.data)
      setNotifications(response.data.data);
  //  const userNotifications = response.data.data.filter(notification =>
   //   notification.userStatus.some(status => status.userId === userData?._id)
  //  );
   
    //setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };
  useEffect(() => {
    fetchNotifications()
   // fetchNotifications(localhosturl);
  }, [fetchNotifications, localhosturl]);

//console.log("Use conrext bnotificatinsn ",notifications)
  return (
    <UserContext.Provider value={{ userData, setUserData: updateUserData ,signOut,localhosturl,notifications, fetchNotifications, addNotification ,setNotifications}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };