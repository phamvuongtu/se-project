import React, { useState, useEffect } from 'react';
import axios from 'axios';

  const Orders = () => {
    const [orderList, setOrderList] = useState([]);
    const [customerID, setCustomerID] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [orderType, setOrderType] = useState('In-store');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shipperID, setShipperID] = useState('');
    const [status, setStatus] = useState('Prepare');
    const [orderRows, setOrderRows] = useState([{ fProductID: '', quantity: '', fever: '' }]);
    const [editIndex, setEditIndex] = useState(-1);
  
    const fetchOrderList = async () => {
      try {
        const response = await axios.get('http://localhost:4000/order/all');
        setOrderList(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    useEffect(() => {
      fetchOrderList();
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const newOrder = {
        customerID,
        shipperID: orderType === 'Delivery' ? shipperID : null,
        shipType: orderType,
        totalPrice: 0, // You need to calculate the total price
        status,
        customerName: '', // Add customer name
        phoneNumber,
        address: orderType === 'Delivery' ? shippingAddress : '',
        deliveryNote: '', // Add delivery note
        orderRows: orderRows.filter(row => row.fProductID !== ''),
      };
  
      try {
        if (editIndex === -1) {
          await axios.post('http://localhost:4000/order/create', newOrder);
        } else {
          await axios.put(`http://localhost:4000/order/update/${orderList[editIndex].orderID}`, newOrder);
        }
  
        resetForm();
        fetchOrderList();
      } catch (error) {
        console.error('Error submitting order:', error);
      }
    };
  
    const resetForm = () => {
      setCustomerID('');
      setPhoneNumber('');
      setOrderType('In-store');
      setShippingAddress('');
      setShipperID('');
      setStatus('Prepare');
      setOrderRows([{ fProductID: '', quantity: '', fever: '' }]);
    };

  const handleAddRow = () => {
    setOrderRows([...orderRows, { drink: '', size: 'S', topping: '', quantity: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...orderRows];
    updatedRows.splice(index, 1);
    setOrderRows(updatedRows);
  };

  const handleEdit = (index) => {
    const order = orderList[index];
    setCustomerID(order.customerID);
    setPhoneNumber(order.phoneNumber);
    setOrderType(order.orderType);
    setShippingAddress(order.shippingAddress);
    setShipperID(order.shipperID);
    setStatus(order.status);
    setOrderRows(order.orderRows);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedOrderList = orderList.filter((_, i) => i !== index);
    setOrderList(updatedOrderList);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form */}
      <h1 className="text-3xl font-bold mb-4">Order Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block mb-2 font-semibold">CustomerID:</label>
            <input
              type="text"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Order Type:</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="In-store">In-store</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          {orderType === 'Delivery' && (
            <div>
              <label className="block mb-2 font-semibold">Shipping Address:</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}
          {orderType === 'Delivery' && (
            <div>
              <label className="block mb-2 font-semibold">Shipper ID:</label>
              <input
                type="text"
                value={shipperID}
                onChange={(e) => setShipperID(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-semibold">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Prepare">Prepare</option>
              <option value="Delivering">Delivering</option>
              <option value="Success">Success</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
          {orderRows.map((row, index) => (
            <div key={index} className="col-span-2">
              <div className="grid grid-cols-4 gap-4 mb-2">
                <div>
                  <label className="block mb-2 font-semibold">Drink:</label>
                  <input
                    type="text"
                    value={row.drink}
                    onChange={(e) => {
                      const updatedRows = [...orderRows];
                      updatedRows[index].drink = e.target.value;
                      setOrderRows(updatedRows);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Size:</label>
                  <select
                    value={row.size}
                    onChange={(e) => {
                      const updatedRows = [...orderRows];
                      updatedRows[index].size = e.target.value;
                      setOrderRows(updatedRows);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Topping:</label>
                  <input
                    type="text"
                    value={row.topping}
                    onChange={(e) => {
                      const updatedRows = [...orderRows];
                      updatedRows[index].topping = e.target.value;
                      setOrderRows(updatedRows);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Quantity:</label>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => {
                      const updatedRows = [...orderRows];
                      updatedRows[index].quantity = e.target.value;
                      setOrderRows(updatedRows);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="col-span-4 text-right">
                {index === orderRows.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    More Drink
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteRow(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editIndex !== -1 ? 'Save' : 'Create Order'}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <h2 className="text-xl font-semibold mb-2">Order List</h2>
      <div className="max-h-96 overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">Shipper ID</th>
              <th className="px-4 py-2">Creation Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order, index) => (
              <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : ""}>
                <td className="px-4 py-2">{order.orderID}</td>
                <td className="px-4 py-2">{order.customerID}</td>
                <td className="px-4 py-2">{order.shipperID}</td>
                <td className="px-4 py-2">{new Date(order.order_time).toLocaleString()}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
