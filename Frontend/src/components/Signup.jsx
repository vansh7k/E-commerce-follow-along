import { useState } from "react";
import Login from "./Login";
import { IoCamera } from "react-icons/io5";

const Signup = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = (userDetails) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userDetails.name || userDetails.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!userDetails.email || !emailRegex.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!userDetails.password || userDetails.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userDetails = {
      name: formData.get("user"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (!validateForm(userDetails)) {
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setIsRegistered(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during signup", error);
      alert("Something went wrong, please try again :(");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  if (isRegistered) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSignupSubmit}
        className="p-8 bg-gray-800/70 rounded-lg shadow-2xl flex flex-col gap-6 w-full max-w-md border border-gray-600 backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Create an Account
        </h1>
        <p className="text-sm text-gray-400 text-center">
          Please fill in the details to sign up
        </p>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="border-2 border-gray-400 rounded-full w-20 h-20 ml-[40%] flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <IoCamera className="text-gray-400 text-2xl absolute" />
                  <input
                    type="file"
                    id="image-upload"
                    name="image"
                    accept="image/*"
                    className="opacity-0 w-0 h-0"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="user"
              className="text-sm font-medium text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              name="user"
              className="p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-900 text-gray-300"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address (e.g., user@example.com)"
              className="p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-900 text-gray-300"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              minLength="8"
              pattern="(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}"
              title="Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character"
              className="p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-900 text-gray-300"
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => setIsRegistered(true)}
            className="text-indigo-400 hover:underline"
          >
            Log in here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;