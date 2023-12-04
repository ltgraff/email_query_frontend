//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';

//import { createRoot } from 'react-dom/client';
//const container = document.getElementById('app');
//const root = createRoot(container);
//root.render(<App tab="home" />);


import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

//ReactDOM.render(<App />, document.getElementById('root'));



//
//const express = require('express')

//const app = express()
//const port = 3001

//const sql_queries = require('./sql_queries')

//app.use(express.json())
//app.use(function (req, res, next) {
//  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
 // next();
//});

/*
app.get('/', (req, res) => {
  sql_queries.display_contacts()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
*/


/*
app.post('/merchants', (req, res) => {
  merchant_model.createMerchant(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/merchants/:id', (req, res) => {
  merchant_model.deleteMerchant(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
*/



