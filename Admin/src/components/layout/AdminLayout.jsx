import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1">

        <Navbar />

        <div className="p-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;