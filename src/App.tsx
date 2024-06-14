import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Camera from 'pages/Camera';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" Component={Camera}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
