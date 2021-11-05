import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <div className='App'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
