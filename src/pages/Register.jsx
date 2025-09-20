import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    // New Password Validation Logic
    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    const passwordRequirements = [];
    if (password.length < 6) {
      passwordRequirements.push("at least 6 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      passwordRequirements.push("at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      passwordRequirements.push("at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      passwordRequirements.push("at least one number");
    }
    // ใช้ Regular Expression เพื่อตรวจสอบอักขระพิเศษ
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordRequirements.push("at least one special character (e.g., !@#$)");
    }

    if (passwordRequirements.length > 0) {
      newErrors.password = "Password must contain: " + passwordRequirements.join(", ");
    }

    if (!email.includes("@") || !email.includes(".com")) {
      newErrors.email = "Email must contain '@' and '.com'";
    }
    
    return newErrors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setSuccessMessage(""); // Clear previous success message

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      setErrors({ email: "Email already exists" });
      return;
    }

    const newUser = { id: Date.now(), username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccessMessage("Register successful! Redirecting to login page...");
    // You can remove this alert
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Redirect after 2 seconds
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="flex w-full max-w-5xl">
        {/* Left Section */}
        <div className="flex flex-col items-start justify-center w-full lg:w-1/2 p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Kanban Board
          </h1>
          <p className="text-base text-gray-600">
            Already have an account?{" "}
            <span
              className="text-purple-700 hover:text-pink-500 font-bold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
          <div className="mt-8 flex justify-center w-full">
            <img
              src="https://illustrations.popsy.co/pink/idea-launch.svg"
              alt="3D illustration"
              className="w-full h-auto max-w-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleRegister} className="space-y-6">
            <h2 className="text-3xl font-bold text-start text-gray-800 mb-10">
              Start Using Kanban
              <br />
              <span className="text-gray-500 font-bold text-lg">Create Account</span>
            </h2>

            {/* Success Message Box */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Success! </strong>
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            {/* Username */}
            <div className="relative w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                className={`block w-full text-lg text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none focus:border-pink-500 peer ${
                  errors.username ? "border-red-500" : "border-gray-400"
                }`}
                required
              />
              <label className="absolute left-0 -top-6 text-gray-500 text-sm transition-all 
                               peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                               peer-focus:-top-6 peer-focus:text-pink-500 peer-focus:text-sm">
                Username
              </label>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className={`block w-full text-lg text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none focus:border-pink-500 peer ${
                  errors.email ? "border-red-500" : "border-gray-400"
                }`}
                required
              />
              <label className="absolute left-0 -top-6 text-gray-500 text-sm transition-all 
                               peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                               peer-focus:-top-6 peer-focus:text-pink-500 peer-focus:text-sm">
                Email
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className={`block w-full text-lg text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none focus:border-pink-500 peer ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
                required
              />
              <label className="absolute left-0 -top-6 text-gray-500 text-sm transition-all 
                               peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                               peer-focus:-top-6 peer-focus:text-pink-500 peer-focus:text-sm">
                Password
              </label>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-full font-semibold hover:bg-pink-500 transition-colors shadow-md"
            >
              Sign Up
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
      </div>
    </div>
  );
}