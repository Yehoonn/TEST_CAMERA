import React from 'react';
import './App.css';
import Test from 'pages/Test';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Test></Test>
      </div>
    </BrowserRouter>
  );
}

export default App;
