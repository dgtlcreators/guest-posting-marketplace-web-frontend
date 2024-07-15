/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(UserContext);
  // console.log(userData);
//   localStorage.setItem("user", JSON.stringify(userData));
  if (!userData) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
