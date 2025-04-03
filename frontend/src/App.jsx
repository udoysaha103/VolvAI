import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home/Home.jsx';
import Features from './pages/Features/Features.jsx';
import Chatbot from './pages/Chatbot/Chatbot.jsx';
import  TermsOfService from './pages/TermsOfService/TermsOfService.jsx';
import FAQ from './pages/FAQ/FAQ.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/features" element={<Features />}></Route>
      <Route path="/chatbot" element={<Chatbot />}></Route>
      <Route path="/terms-of-service" element={<TermsOfService />}></Route>
      <Route path="/faq" element={<FAQ />}></Route>
    </Routes>
  )
}

export default App