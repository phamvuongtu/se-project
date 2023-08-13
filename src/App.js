import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Admin/Dashboard";
import Dashboard from "./components/Staff/Dashboard";
// import Layout from "./components/Admin/Layout";
import Layout from "./components/Staff/Layout";
import LoginPage from "./components/LoginPage";
import Staff from "./components/Admin/Staff";
import Shipper from "./components/Admin/Shipper";
import Menu from "./components/Admin/Menu";
import Statistic from "./components/Admin/Statistic";
import Order from "./components/Staff/Order";
import Customer from "./components/Staff/Customer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<LoginPage />} />

        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Dashboard />} />
          <Route path="admin/staff" element={<Staff/>} />
          <Route path="admin/shipper" element={<Shipper />} />
          <Route path="admin/menu" element={<Menu />} />
          <Route path="admin/statistic" element={<Statistic />} />
          <Route path="order" element={<Order />} />
          <Route path="customer" element={<Customer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
