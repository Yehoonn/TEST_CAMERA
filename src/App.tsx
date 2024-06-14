import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TestIOS from 'pages/TestIOS';
import TestAndroid from 'pages/TestAndroid';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/android" Component={TestAndroid}></Route>
          <Route path="/ios" Component={TestIOS}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
