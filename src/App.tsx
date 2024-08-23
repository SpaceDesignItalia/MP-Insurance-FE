import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { API_URL } from "./API/API";
import Navbar from "./Components/Layout/Navbar";

import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import AddCustomerPage from "./Pages/Customer/AddCustomerPage";
import ViewCustomerPage from "./Pages/Customer/ViewCustomerPage";
import CalendarDashboard from "./Pages/Calendar/CalendarDashboard";
import AddPolicyPage from "./Pages/Policy/AddPolicyPage";

const App: React.FC = () => {
  axios.defaults.baseURL = API_URL;
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/Authentication/GET/CheckSession", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Errore durante il controllo della sessione:", error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="absolute left-0 w-full h-full flex flex-col justify-center items-center">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <>
      {isAuth && <Navbar />}
      <Routes>
        {!isAuth && <Route element={<Login />} path="/login" />}
        <Route
          path="/*"
          element={
            isAuth ? (
              <EmployeeProtectedRoutes />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

const EmployeeProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerDashboard />} />
        <Route path="/customers/add-customer" element={<AddCustomerPage />} />
        <Route
          path="/customers/view-customer-data/:id/:fullname"
          element={<ViewCustomerPage />}
        />
        <Route path="/policy/add-policy" element={<AddPolicyPage />} />
        <Route path="/calendar" element={<CalendarDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
