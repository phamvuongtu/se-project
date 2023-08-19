import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Layout from "./LayoutAdmin";
import Staff from "./Staff";
import Shipper from "./Shipper";
import Menu from "./Menu";
import Order from "../Staff/Order";
import Customer from "../Staff/Customer";

function MainAdmin() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index={true} element={<Dashboard />} />
          <Route path="admin/staff" element={<Staff/>} />
          <Route path="admin/shipper" element={<Shipper />} />
          <Route path="admin/menu" element={<Menu />} />
          <Route path="order" element={<Order />} />
          <Route path="customer" element={<Customer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default MainAdmin;
