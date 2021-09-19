import  React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


import Form from "./pages/Form";
import GenreMap from "./pages/GenreMap";
import ArtistMap from "./pages/ArtistMap";

function App() {
  return (
    <Router>
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Form/>
                </Route>
				<Route exact path="/map/genre">
                    <GenreMap/>
                </Route>
                <Route exact path="/map/artist">
                    <ArtistMap/>
                </Route>
            </Switch>            
        </div>
    </Router>
  );
}

export default App;
