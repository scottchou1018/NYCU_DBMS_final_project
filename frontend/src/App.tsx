// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/Home';
import NotFound from './assets/NotFound';
import './App.css';
import Login from './assets/Login';
import Logout from './assets/Logout';
import Analysis from './assets/Analysis';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;