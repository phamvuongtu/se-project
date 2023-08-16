import React, { useEffect, useState } from "react";
import axios from "axios";

const Shipper = () => {
  //Validation functions and other constants
  const [shipperList, setShipperList] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");

  //Logical function => Check input
  const isValidPhoneNumber = (input) => {
    return /^0\d{9}$/.test(input);
  };

  const isValidName = (input) => {
    //return /^[A-Za-zÀ-ỹ\s]+$/.test(input);
    return /^[A-Za-zÀ-ỹ\s'".-]+$/.test(input);
  };  

  //Event handler: Submit button/ Update buton
  const handleSubmit = async (e) => {
    e.preventDefault();

    //validation checks
    if (!name || !phoneNumber) {
      setErrorMsg("Name and Phone Number are required fields");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorMsg(
        "Invalid phone number format (should start with 0 and have 10 digits)"
      );
      return;
    }

    if (!isValidName(name)) {
      setErrorMsg("Invalid name format (should contain only characters)");
      return;
    }

    if (editIndex === -1) {
      try {
        const newShipper = {name, phoneNumber };
        const response = await axios.post(
          "http://localhost:4000/create",
          newShipper
        );
        
        const insertedShipper = {
          shipperID: response.data.shipperID,
          name: response.data.name,
          phoneNumber: response.data.phoneNumber,
        };
        // Update the state
        setShipperList((prevShipperList) => [...prevShipperList, insertedShipper]);
      } catch (error) {
        console.error("Error adding shipper:", error);
      }
    } else {
      //Update existing shipper
      try {
        const updatedShipper = {name, phoneNumber };
        await axios.put(
          `http://localhost:4000/update/${shipperList[editIndex].shipperID}`,
          updatedShipper
        );               
        const updatedShipperList = shipperList.map((shipper, index) =>
          index === editIndex ? { ...shipper, name, phoneNumber } : shipper
        );
        setShipperList(updatedShipperList);
        setEditIndex(-1);
      } catch (error) {
        console.error("Error updating shipper:", error);
      }
    }

    setName("");
    setPhoneNumber("");
    setErrorMsg("");
  };

  const handleEdit = (index) => {
    const shipper = shipperList[index];
    setName(shipper.name);
    setPhoneNumber(shipper.phoneNumber);
    setEditIndex(index);
  };

  const handleDelete = async (shipperID) => {
    try {
      // Fetch initial shipper data
      await axios.delete(`http://localhost:4000/delete/${shipperID}`);
      const updatedShipperList = shipperList.filter(
        (shipper) => shipper.shipperID !== shipperID
      );
      setShipperList(updatedShipperList);
    } catch (error) {
      console.error("Error deleting shipper:", error);
    }
  };
  

  useEffect(() => {
    axios
      .get("http://localhost:4000/all")
      .then((response) => {
        setShipperList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shipper data:", error);
      });
  }, []);

  return (
    //Return right-hand page
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shipper Management</h1>
      {/* Form */}
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
          {editIndex === -1 ? "Add Shipper" : "Update Shipper"}
        </button>
      </form>

      {/* Table */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Shipper ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipperList.length > 0 &&
              shipperList.slice(0, 15).map((shipper, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-4 py-2">{shipper.shipperID}</td>
                  <td className="px-4 py-2">{shipper.name}</td>
                  <td className="px-4 py-2">{shipper.phoneNumber}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shipper.shipperID)}
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

export default Shipper;
