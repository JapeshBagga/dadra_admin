import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Login from "./components/Login";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewOPD from "./components/AddNewOPD";
import OPDs from "./components/opds";
import Pharmacy from "./components/Pharmacy";
import BillingForm from "./components/Billing";
import Pathology from "./components/Pathology";
import AddNewMedicine from "./components/AddNewMedicine";
import AddNewTest from "./components/AddNewTest";
import SERVER_URL from "./env";
import Register from "./components/register";

import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/user/admin/me`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/opds/:patientId" element={<OPDs />} />
        <Route path="/opd/addnew/:patientId" element={<AddNewOPD />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/pathology" element={<Pathology />} />
        <Route path="/billing" element={<BillingForm />} />
        <Route path="/pathology/addnew/:testId?" element={<AddNewTest />} />
        <Route
          path="/pharmacy/addnew/:medicineId?"
          element={<AddNewMedicine />}
        />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
