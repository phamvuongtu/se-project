import React from "react";

const Dashboard = () => {
  return (
    <div className="h-screen">
      <main className="flex-grow bg-primary-grey">
        <div className="flex-1 bg-white p-4">
          <div className="bg-gray-300 rounded p-4 mb-4">
            <div className="text-lg font-medium">Welcome come back</div>
            <div className="text-base">This is the administration page for admin</div>
          </div>
          <div className="flex mb-4">
            <div className="flex-1 bg-gray-800 text-white p-4 rounded">
              <div className="text-xl font-medium">Total Staffs</div>
              <div className="text-3xl">1000</div>
            </div>
            <div className="ml-4 flex-1 bg-gray-800 text-white p-4 rounded">
              <div className="text-xl font-medium">Total Shippers</div>
              <div className="text-3xl">1000</div>
            </div>
            <div className="ml-4 flex-1 bg-gray-800 text-white p-4 rounded">
              <div className="text-xl font-medium">Total Customers</div>
              <div className="text-3xl">1000</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
