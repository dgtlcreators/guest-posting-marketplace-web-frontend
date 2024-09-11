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




/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Retrieve user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

 // const localhosturl="http://localhost:5000"
//const localhosturl="https://guest-posting-marketplace-web-backend.onrender.com"
const localhosturl="https://guest-posting-marketplace-web-backend-1.onrender.com"
  const updateUserData = useCallback(
    (data) => {
      setUserData(data);
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
    // Synchronize localStorage whenever userData changes
    if (userData !== null) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData: updateUserData ,signOut,localhosturl}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };