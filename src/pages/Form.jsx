import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import Genres from './Genres.jsx';
import Artists from './Artists.jsx';


// search genres & countries with most artists of that genre
// search artists and reveal artists similar to that one and their location 



export default function Form(props) {
    const [ view, setView ] = useState(true);

    const setViewGenre = () => {
        setView(true)
    }
    const setViewArtist = () => {
        setView(false)
    }

    return (
        <main className="form">
            <div>
                <h1>Music Mapper</h1>
                <p>Welcome to Music Mapper!</p>
                <p>Select up to three genres and see the regions with the most popular from each genre</p>
                <p>or</p>
                <p>Search for an artist and see the regions with the most artists similar to the one you searched for</p>
                
                <Button
                    onClick={setViewGenre}
                    className="form-view-button"
                >
                    Search by Genres
                </Button>
                <Button 
                    onClick={setViewArtist}
                    className="form-view-button"
                >
                    Search by Artists
                </Button>
                <Container>
                { view && <Genres /> }
                { !view && <Artists /> }
                </Container>

                <Link to="/map">Map</Link>
            </div>
        </main>
    );
}