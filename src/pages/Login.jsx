import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // สำหรับกล่อง alert
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // หา user ที่ตรงกับ username หรือ email และ password
    const user = users.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      setError("Invalid username or email or password!"); // แสดงกล่อง error
      return;
    }

    // เมื่อ login สำเร็จ
    sessionStorage.setItem("currentUser", JSON.stringify(user)); // เก็บเฉพาะ session
    setCurrentUser(user);
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="flex w-full max-w-5xl">

        {/* Left Section: Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-3xl font-bold text-start text-gray-800 mb-10">
              Welcome Back
              <br />
              <span className="text-gray-500 font-bold text-lg">Login to Kanban</span>
            </h2>

            {/* Alert Box */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <span 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                  onClick={() => setError("")} // ปิดกล่อง
                >
                  ❌
                </span>
              </div>
            )}

            {/* Username or Email */}
            <div className="relative w-full mb-6">
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" " 
                  className="block w-full text-lg text-gray-900 bg-transparent border-b-2 border-gray-400 appearance-none focus:outline-none focus:border-pink-500 peer"
                  required
              />
              <label className="absolute left-0 -top-5 text-gray-500 text-sm transition-all 
                                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                                  peer-focus:-top-3.5 peer-focus:text-pink-500 peer-focus:text-sm">
                  Username or Email
              </label>
            </div>

            {/* Password */}
            <div className="relative w-full mb-6 top-2">
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="block w-full text-lg text-gray-900 bg-transparent border-b-2 border-gray-400 appearance-none focus:outline-none focus:border-pink-500 peer"
                  required
              />
              <label className="absolute left-0 -top-5 text-gray-500 text-sm transition-all 
                                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                                  peer-focus:-top-3.5 peer-focus:text-pink-500 peer-focus:text-sm">
                  Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-full font-semibold hover:bg-pink-500 transition-colors shadow-md"
            >
              Login
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-6 h-6" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome Back to Kanbarn!</h1>
          <p className="text-base text-gray-600 mb-8">
            Don’t have an account?{" "}
            <span
              className="text-purple-700 hover:text-pink-500 font-bold cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
          <img 
            src="https://illustrations.popsy.co/pink/taking-notes.svg" 
            alt="3D illustration" 
            className="w-full h-auto max-w-sm" 
          />
        </div>
      </div>
    </div>
  );
}
