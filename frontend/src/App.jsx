import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil/:slug" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
