import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Homepage from "./components/pages/HomePage"; // Ensure you have a Homepage component
import MyViewPage from "./components/pages/MyViewPage";
import AdminPage from "./components/pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/my-view" element={<MyViewPage />} />
        <Route path="/admin-view" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
