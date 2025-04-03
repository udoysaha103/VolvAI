import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home/Home.jsx';
import Features from './pages/Features/Features.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/features" element={<Features />}></Route>
    </Routes>
  )
}

export default App