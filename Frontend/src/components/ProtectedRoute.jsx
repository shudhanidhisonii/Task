import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/me", {
          withCredentials: true,
        });
        if (res.data?._id) {
          setUser(res.data);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
  console.log("Auth error:", err.response?.status, err.response?.data);
  setIsAuth(false);
}

    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
