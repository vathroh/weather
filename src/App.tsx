import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WeatherDashboard from "./pages/WeatherDashboard";
import { WeatherProvider } from "./context/WeatherContext";

export default function App(): React.ReactElement {
  return (
    <WeatherProvider>
      <Router>
        <Routes>
          {/* Main Dashboard route */}
          <Route path="/" element={<WeatherDashboard />} />

          {/* Catch-all route redirecting back to main page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}
