/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContextProvider";

const ProtectedRoute = ({ children }) => {
  const { account, contractOwner } = useGlobalContext();

  console.log(account);

  if (!account) {
    return <Navigate to="/" replace />;
  }

  if (account.toLowerCase() !== contractOwner.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
