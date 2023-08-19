import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidPhoneNumber = (input) => {
    return /^0\d{9}$/.test(input);
  };

  const isValidName = (input) => {
    return /^[A-Za-zÀ-ỹ\s]+$/.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !address || !phoneNumber) {
      setErrorMsg('Missing required field');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorMsg('Invalid phone number format (should start with 0 and have 10 digits)');
      return;
    }

    if (!isValidName(name)) {
      setErrorMsg('Invalid name format (should contain only characters)');
      return;
    }

   
    if (editIndex === -1){
      try {
        const newCustomer = {name, phoneNumber, email, password, address};
        const response = await axios.post(
          "http://localhost:4000/customer/create",
          newCustomer
        );
        
        const insertedCustomer = {
          customerID: response.data.customerID,
          name: response.data.name,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
          password: response.data.password,
          address: response.data.address,
          rankID: 1,
          allSpend: 0
        };
        // Update the state
        setCustomerList((prevCustomerList) => [...prevCustomerList, insertedCustomer]);
      } catch (error) {
        console.error("Error adding customer:", error);
      }
    } else {
      //Update existing staff
      try {
        const updatedCustomer = {name, email, phoneNumber,password,address };
        await axios.put(
          `http://localhost:4000/customer/update/${customerList[editIndex].customerID}`,
          updatedCustomer
        );               
        const updatedCustomerList = customerList.map((customer, index) =>
          index === editIndex ? { ...customer, name, email, phoneNumber, password, address } : customer
        );
        setCustomerList(updatedCustomerList);
        setEditIndex(-1);
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    }

    // Clear form fields
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setAddress('');
  };

  const handleEdit = (index) => {
    const customer = customerList[index];
    setName(customer.name);
    setPhoneNumber(customer.phoneNumber);
    setEmail(customer.email);
    setPassword(customer.password);
    setAddress(customer.address);
    setEditIndex(index);
  };

  const handleDelete = async (customerID) => {
    try {
      // Fetch initial customer data
      await axios.delete(`http://localhost:4000/customer/delete/${customerID}`);
      const updatedCustomerList = customerList.filter(
        (customer) => customer.customerID !== customerID
      );
      setCustomerList(updatedCustomerList);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/customer/all")
      .then((response) => {
        setCustomerList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);
  return (
    <div className="container mx-auto p-4">
      {/* Form */}
      <h1 className="text-3xl font-bold mb-4">Customer Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block mb-2 font-semibold">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="block mb-2 font-semibold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 font-semibold">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editIndex === -1 ? 'Add Customer' : 'Update Customer'}
        </button>
      </form>


      {/* Table */}
      <h2 className="text-xl font-semibold mb-2">Customer List</h2>
      <div className="max-h-96 overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Password</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Total Order Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer, index) => (
              <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : ""}>
                <td className="px-4 py-2">{customer.customerID}</td>
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.phoneNumber}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2" style={{ maxWidth: '200px', wordWrap: 'break-word' }} >{customer.password}</td>
                <td className="px-4 py-2">{customer.address}</td>
                <td className="px-4 py-2">{customer.rankID}</td>
                <td className="px-4 py-2">{customer.allSpend}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.customerID)}
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

export default Customer;