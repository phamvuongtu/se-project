import React from 'react';

const Statistic = () => {
  return (
    <div className="index">
      <div className="overlap-wrapper">

        <div className="header-dashboard bg-white w-full h-1/3 px-6 py-8">
          <div className="overlap-group-2 bg-gray-300 rounded-lg p-4">
            <div className="text-wrapper-8 text-2xl font-semibold mb-2">
              Welcome, ...
            </div>
            <div className="text-wrapper-9 text-lg">Description ...</div>
          </div>
        </div>

        {/* Total Staffs */}
        <div className="total-staffs bg-white w-64 h-1/6 px-6 py-4">
          <div className="overlap-2 bg-gray-600 rounded-lg p-4">
            <div className="text-wrapper-10 text-lg font-semibold mb-1">
              Total Staffs
            </div>
            <div className="text-wrapper-11 text-2xl font-bold">1000</div>
          </div>
        </div>

        {/* Total Shippers */}
        <div className="total-shippers bg-white w-64 h-1/6 px-6 py-4">
          <div className="overlap-2 bg-gray-600 rounded-lg p-4">
            <div className="text-wrapper-10 text-lg font-semibold mb-1">
              Total Shippers
            </div>
            <div className="text-wrapper-12 text-2xl font-bold">1000</div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="total-customers bg-white w-64 h-1/6 px-6 py-4">
          <div className="overlap-2 bg-gray-600 rounded-lg p-4">
            <div className="text-wrapper-10 text-lg font-semibold mb-1">
              Total Customers
            </div>
            <div className="text-wrapper-12 text-2xl font-bold">1000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
