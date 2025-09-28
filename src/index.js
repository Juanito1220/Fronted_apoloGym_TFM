import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { AuthProvider } from "./Auth/AuthContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
// index.js (antes de ReactDOM.createRoot)
try {
  const raw = localStorage.getItem("users");
  if (raw && !Array.isArray(JSON.parse(raw))) {
    localStorage.setItem("users", JSON.stringify([]));
  }
} catch {}

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// src/index.js
