import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Esimerkki Axios-kutsusta backend-palvelimelle
axios.get('http://localhost:3000/')  // Tarkista, että tämä URL on serverin osoite
  .then(response => {
    console.log(response.data);  // Tulosta palvelimen data tai muuta tarpeen mukaan
  })
  .catch(error => {
    console.error('There was an error fetching data from the server!', error);
  });

reportWebVitals();
