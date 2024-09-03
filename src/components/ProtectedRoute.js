/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const ProtectedRoute = ({  children, requiredRole }) => {
  const { userData } = useContext(UserContext);
  // console.log(userData);
//   localStorage.setItem("user", JSON.stringify(userData));
  //if (!userData) {
  //  return <Navigate to="/login" />;
 // }
 /*if (!userData || (requiredRole && userData.role !== requiredRole)) {
  return <Navigate to="/login" />;
}

  return children;*/
  if (!userData) {
    return <Navigate to="/login" />;
  }

  
  if (userData.role === "Super Admin" || (requiredRole && userData.role === requiredRole)) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
