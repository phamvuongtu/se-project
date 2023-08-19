import React, { useState,useEffect } from 'react';
import axios from "axios";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidPhoneNumber = (input) => {
    return /^0\d{9}$/.test(input);
  };

  const isValidName = (input) => {
    return /^[A-Za-zÀ-ỹ\s]+$/.test(input);
  };

  // const generateStaffID = () => {
  //   const currentCount = staffList.length + 1;
  //   return `St${currentCount.toString().padStart(3, '0')}`;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber) {
      setErrorMsg('Name, Email, and Phone Number are required fields');
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

    if (editIndex === -1) {
      try {
        const newStaff = {name,email, phoneNumber };
        const response = await axios.post(
          "http://localhost:4000/staff/create",
          newStaff
        );
        
        const insertedStaff = {
          staffID: response.data.staffID,
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        };
        // Update the state
        setStaffList((prevStaffList) => [...prevStaffList, insertedStaff]);
      } catch (error) {
        console.error("Error adding staff:", error);
      }
    } else {
      //Update existing staff
      try {
        const updatedStaff = {name, email, phoneNumber };
        await axios.put(
          `http://localhost:4000/staff/update/${staffList[editIndex].staffID}`,
          updatedStaff
        );               
        const updatedStaffList = staffList.map((staff, index) =>
          index === editIndex ? { ...staff, name, email, phoneNumber } : staff
        );
        setStaffList(updatedStaffList);
        setEditIndex(-1);
      } catch (error) {
        console.error("Error updating staff:", error);
      }
    }

    setName('');
    setEmail('');
    setPhoneNumber('');
    setErrorMsg('');
  };

  const handleEdit = (index) => {
    const staff = staffList[index];
    setName(staff.name);
    setEmail(staff.email);
    setPhoneNumber(staff.phoneNumber);
    setEditIndex(index);
  };

  const handleDelete = async (staffID) => {
    try {
      // Fetch initial staff data
      await axios.delete(`http://localhost:4000/staff/delete/${staffID}`);
      const updatedStaffList = staffList.filter(
        (staff) => staff.staffID !== staffID
      );
      setStaffList(updatedStaffList);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/staff/all")
      .then((response) => {
        setStaffList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff data:", error);
      });
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Staff Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex mb-2">
          <div className="w-1/2 pr-2">
            <label className="block mb-2 font-semibold">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block mb-2 font-semibold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex mb-2">
          <div className="w-1/2 pr-2">
            <label className="block mb-2 font-semibold">Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editIndex === -1 ? 'Add Staff' : 'Update Staff'}
        </button>
      </form>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border">
          <thead>
          <tr className="bg-gray-200" style={{ position: 'sticky', top: 0, zIndex: 1 }}>

              <th className="px-4 py-2">Staff ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.slice(0, 200).map((staff, index) => (
              <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : ""}>
                <td className="px-4 py-2">{staff.staffID}</td>
                <td className="px-4 py-2">{staff.name}</td>
                <td className="px-4 py-2">{staff.email}</td>
                <td className="px-4 py-2">{staff.phoneNumber}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staff.staffID)}
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

export default Staff;