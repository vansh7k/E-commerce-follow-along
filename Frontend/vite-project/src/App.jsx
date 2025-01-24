import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import React from "react";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;