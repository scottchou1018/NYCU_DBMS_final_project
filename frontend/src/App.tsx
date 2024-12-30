// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/Home';
import NotFound from './assets/NotFound';
import './App.css';
import Login from './assets/Login';
import Analysis from './assets/Analysis';
import Manage from './assets/manage';
import Navbar from './assets/Navbar';
import Register from './assets/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/manage" element={<Manage/>}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;