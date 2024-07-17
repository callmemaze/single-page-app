import React, { useState, useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { useGetUserQuery } from "../store/slices/userSlices";

const PrivateRoute = ({ children, ...rest }) => {
  const [user, setUser] = useState([]);
  const { data, isSuccess, isLoading, error } = useGetUserQuery();
  console.log(error);
  useEffect(() => {
    if (data && isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess]);

  if (isLoading && !isSuccess) {
    return null;
  }
  if (error) {
    return <div>{<Navigate to="/login" />}</div>;
  }

  return <div>{user ? children : <Navigate to="/login" />}</div>;
};

export default PrivateRoute;
