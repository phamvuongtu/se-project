import React from "react";

const Dashboard = () => {
  return (
    <div className="h-screen flex bg-primary-grey">
      <main className="flex-grow bg-primary-grey">
        <div className="flex bg-white p-4">
          <div className="bg-gray-300 rounded p-4 mb-4">
            <div className="text-lg font-medium">Welcome come back</div>
            <div className="text-base">This is the administration page for admin</div>
          </div>
        </div>
      </main>
    </div>
  );

};

export default Dashboard;
