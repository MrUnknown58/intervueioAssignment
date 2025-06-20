import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import App from "./App";
import TeacherApp from "./pages/TeacherApp";
import Kicked from "./pages/Kicked";

const RootRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student/*" element={<App />} />
      <Route path="/teacher/*" element={<TeacherApp />} />
      <Route path="/student/kicked" element={<Kicked />} />
    </Routes>
  </Router>
);

export default RootRouter;
