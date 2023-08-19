import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [productList, setProductList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("S");
  const [price, setPrice] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/product/all"); // Update the endpoint accordingly
      setProductList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const isValidPrice = (input) => {
    //return /^\d+$/.test(input);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!name || !price) {
      setErrorMsg("Name and Price are required fields");
      return;
    }

    if (!isValidPrice(price)) {
      setErrorMsg("Invalid price format (should be a positive integer)");
      return;
    }

    const requestData = {
      name,
      description,
      size,
      price,
    };

    try {
      if (editIndex === -1) {
        await axios.post("http://localhost:4000/product/create", requestData);
      } else {
        const productID = productList[editIndex].productID;
        const updatedData = {
          name,
          description,
          size: size !== null ? size : "", // Send empty string if size is null
          price: price !== "" ? parseFloat(price) : null, // Send null if price is empty
        };
        await axios.put(
          `http://localhost:4000/product/update/${productID}`,
          updatedData
        );
      }

      // Fetch the updated product list after updating
      await fetchProducts();

      setName("");
      setDescription("");
      setSize("S");
      setPrice("");
      setEditIndex(-1);
      setErrorMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    const product = productList[index];
    setName(product.name);
    setDescription(product.description);
    setSize(product.fProducts[0]?.size || "S");
    setPrice(product.fProducts[0]?.price.toString() || "");
    setEditIndex(index);
  };

  const handleDelete = async (productID) => {
    try {
      await axios.delete(`http://localhost:4000/product/delete/${productID}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product Management</h1>
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
            <label className="block mb-2 font-semibold">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex mb-2">
          <div className="w-1/3 px-2">
            <label className="block mb-2 font-semibold">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>
          <div className="w-1/3 pl-2">
            <label className="block mb-2 font-semibold">Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editIndex === -1 ? "Add Product" : "Update Product"}
        </button>
      </form>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border">
          <thead>
          <tr className="bg-gray-200" style={{ position: 'sticky', top: 0, zIndex: 1 }}>

              <th className="px-4 py-2">Product ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.slice(0, 100).map((product, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="px-4 py-2">{product.productID}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  {product.fProducts.length > 0
                    ? product.fProducts[0].size
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {product.fProducts.length > 0
                    ? product.fProducts[0].price
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.productID)}
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

export default Menu;
