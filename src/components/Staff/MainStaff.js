import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import Orders from "./Order";
import Layout from "./LayoutStaff";
import Customer from "./../Staff/Customer";

function MainStaff() {
  return (
    <Router>
      <Routes>
        <Route path="/staff" element={<Layout />}>
          <Route index={true} element={<Dashboard />} />
          <Route path="order" element={<Orders />} />
          <Route path="customer" element={<Customer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default MainStaff;
