import  React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


import Form from "./pages/Form";
import Map from "./pages/Map";

function App() {
  return (
    <Router>
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Form/>
                </Route>
				<Route exact path="/map">
                    <Map/>
                </Route>
            </Switch>            
        </div>
    </Router>
  );
}

export default App;
