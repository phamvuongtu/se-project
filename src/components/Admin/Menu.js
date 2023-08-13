import React, { useState } from 'react';

const Menu = () => {
  const [productList, setProductList] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Drink');
  const [size, setSize] = useState('S');
  const [price, setPrice] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidPrice = (input) => {
    return /^\d+$/.test(input);
  };

  const generateProductID = () => {
    const currentCount = productList.length + 1;
    return `Pr${currentCount.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      setErrorMsg('Name and Price are required fields');
      return;
    }

    if (!isValidPrice(price)) {
      setErrorMsg('Invalid price format (should be a positive integer)');
      return;
    }

    if (editIndex === -1) {
      const newProduct = { productID: generateProductID(), name, description, type, size, price };
      setProductList([...productList, newProduct]);
    } else {
      const updatedProductList = productList.map((product, index) =>
        index === editIndex
          ? { ...product, name, description, type, size, price }
          : product
      );
      setProductList(updatedProductList);
      setEditIndex(-1);
    }

    setName('');
    setDescription('');
    setType('Drink');
    setSize('S');
    setPrice('');
    setErrorMsg('');
  };

  const handleEdit = (index) => {
    const product = productList[index];
    setName(product.name);
    setDescription(product.description);
    setType(product.type);
    setSize(product.size);
    setPrice(product.price);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedProductList = productList.filter((_, i) => i !== index);
    setProductList(updatedProductList);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSize(e.target.value === 'Drink' ? 'S' : '');
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
          <div className="w-1/3 pr-2">
            <label className="block mb-2 font-semibold">Type:</label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Drink">Drink</option>
              <option value="Topping">Topping</option>
            </select>
          </div>
          {type === 'Drink' && (
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
          )}
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
          {editIndex === -1 ? 'Add Product' : 'Update Product'}
        </button>
      </form>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Product ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.slice(0, 15).map((product, index) => (
              <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : ""}>
                <td className="px-4 py-2">{product.productID}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.type}</td>
                <td className="px-4 py-2">{product.type === 'Drink' ? product.size : '-'}</td>
                <td className="px-4 py-2">{product.price}</td>
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

export default Menu;
