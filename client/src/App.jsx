import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="bg-black min-h-screen overflow-y-hidden overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <footer className="text-md font-mono pt-10 pb-5 text-center font-medium text-gray-50 m-5">
        <p className="mb-3 mt-2">
          Made with 💖 by Arun Singh Bisht a.k.a mrBoB 🗿 - Original Gangster.
        </p>
        <span className="font-bold">&copy; 2025 | All rights reserved.</span>
      </footer>
    </div>
  );
}
