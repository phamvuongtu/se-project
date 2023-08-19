import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    const data={email,password}
    try {
      const response = await axios.post("http://localhost:4000/auth/login", data);
      console.log('check',response.data.userData.errCode)
      if(response.data.userData.errCode === 0){
        if(response.data.userData.user.role === "Admin")
          navigate("/")
        else navigate('/customer')
      }else{
        // Handle error messages based on errCode
        switch (response.data.userData.errCode) {
          case 1:
            setErrorMessage("Username does not exist");
            break;
          case 2:
            setErrorMessage("User not found");
            break;
          case 3:
            setErrorMessage("Wrong password");
            break;
          default:
            setErrorMessage("An error occurred");
      }}

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("An error occurred");
    } 
    if (!email || !password) {
      setErrorMessage("Email, Password are required fields");
      return;
    }
    
    //console.log(email)
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <img
          className="w-20 mr-30 items-center justify-center"
          src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/294429033_466041908859354_6964179608400976606_n.png?_nc_cat=104&cb=99be929b-59f725be&ccb=1-7&_nc_sid=be3454&_nc_ohc=OCEyNd7uzpgAX9l4Oft&_nc_ht=scontent.fhan19-1.fna&oh=00_AfCZYJZSzDHcfrin_zRhgdHC0vTbg3IJrtq7hcB1o79WOQ&oe=64DDE271"
          alt="logo"
        />

        <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white text-3B2415">
          YoTea Management System
        </h1>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="http://localhost:4000/auth/login"
              method="post"
              onSubmit={handleFormSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="xxx@yyy.zzz"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-FFE3B8 bg-3B2415 hover:bg-392614 focus:ring-4 focus:outline-none focus:ring-392614 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-3B2415 dark:hover:bg-392614 dark:focus:ring-392614"
              >
                Sign in
              </button>
              {errorMessage && (
                <p className="text-sm font-light text-red-500">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;