import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Homepage from "./components/pages/HomePage"; // Ensure you have a Homepage component
import MyViewPage from "./components/pages/MyViewPage";
import AdminPage from "./components/pages/AdminPage";
import SuperAdminPage from "./components/pages/SuperAdminPage";
import ApiViewPage from "./components/pages/ApiViewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/my-view" element={<MyViewPage />} />
        <Route path="/admin-view" element={<AdminPage />} />
        <Route path="/super-admin-view" element={<SuperAdminPage />} />
        <Route path="/api-view" element={<ApiViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
