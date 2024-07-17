import { useGetUserQuery } from "@/store/slices/userSlices";
import React, { useState, useEffect } from "react";
import { Navigate, Route } from "react-router-dom";

const AuthPrivateRoute = ({ children, ...rest }) => {
  const [user, setUser] = useState([]);
  const { data, isSuccess, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (data && isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess]);

  if (isLoading && !isSuccess) {
    return null;
  }
  return <div>{!user ? children : <Navigate to="/" />}</div>;
};

export default AuthPrivateRoute;
