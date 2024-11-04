/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({  children, requiredRoles }) => {
  const { userData } = useContext(UserContext);
  // console.log(userData);
//   localStorage.setItem("user", JSON.stringify(userData));
  //if (!userData) {
  //  return <Navigate to="/login" />;
 // }
 /*if (!userData || (requiredRoles && userData.role !== requiredRoles)) {
  return <Navigate to="/login" />;
}

  return children;*/
  /*if (!userData) {
    return <Navigate to="/login" />;
  }
  if(userData.role === "Super Admin"){
    return children;
  }
  if ((requiredRoles && userData.role !== requiredRoles)) {
    return <Navigate to="/login" />;
  }
  return  children;*/
 // console.log("User Data:", userData);
 // console.log("Required Roles:", requiredRoles);



  if (!userData) {
    console.log("User is not logged in");
    return <Navigate to="/login" />;
  }

  if (!userData.isVerified) {
   // toast.error("Please verify your email to log in.");
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = requiredRoles ? requiredRoles.includes(userData.role) : true;
 //console.log('Has Required Role:', hasRequiredRole);

  if (!hasRequiredRole) {
    //console.log("User does not have the required role");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
