import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardAdmin from "./components/Admin/Dashboard";
import DashboardStaff from "./components/Staff/Dashboard";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import LayoutStaff from "./components/Staff/LayoutStaff";
import LoginPage from "./components/LoginPage";
import Staff from "./components/Admin/Staff";
import Shipper from "./components/Admin/Shipper";
import Menu from "./components/Admin/Menu";
import Order from "./components/Staff/Order";
import Customer from "./components/Staff/Customer";

function App() {
  const [role, setRole] = useState(""); // Store the role of the logged-in user

  return (
    <Router>
      <Routes>
        <Route
          path="login"
          element={<LoginPage setRole={setRole} />} // Pass the setRole function as a prop
        />

        {role === "Admin" && ( // Render admin routes based on the role
          <Route path="/" element={<LayoutAdmin />}>
            <Route index={true} element={<DashboardAdmin />} />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/shipper" element={<Shipper />} />
            <Route path="admin/menu" element={<Menu />} />
            <Route path="order" element={<Order />} />
            <Route path="customer" element={<Customer />} />
          </Route>
        )}

        {role === "Staff" && ( // Render staff routes based on the role
          <Route path="/" element={<LayoutStaff />}>
            <Route index={true} element={<DashboardStaff />} />
            <Route path="order" element={<Order />} />
            <Route path="customer" element={<Customer />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;