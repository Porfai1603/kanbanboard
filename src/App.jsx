import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";

function App() {
  // Read user data from localStorage when the app first loads
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            currentUser ? (
              // ถ้า login แล้ว กลับไปหน้าเดิม (dashboard)
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/register" />
            )
          }
        />

        {/* Register and Login */}
        <Route path="/register" element={<Register setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />

        {/* Dashboard protected */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard currentUser={currentUser} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* BoardPage protected */}
        <Route
          path="/board/:boardId"
          element={
            currentUser ? (
              <BoardPage currentUser={currentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
