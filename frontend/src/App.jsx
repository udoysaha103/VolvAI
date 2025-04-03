import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home/Home.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  )
}

export default App