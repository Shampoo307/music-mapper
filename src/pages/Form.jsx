import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Genres from './Genres.jsx';
import Artists from './Artists.jsx';


// search genres & countries with most artists of that genre
// search artists and reveal artists similar to that one and their location 



export default function Form(props) {
    const [ view, setView ] = useState('genres');

    return (
        <main className="form">
            <div>
                <h1>Music Mapper</h1>
                <p>Welcome to Music Mapper!</p>
                <p>Select up to three genres and see the regions with the most popular from each genre</p>
                <p>or</p>
                <p>Search for an artist and see the regions with the most artists similar to the one you searched for</p>
                
                <h2>Search by Genres</h2>
                <h2>Search by Artists</h2>
                <Container>
                { view === 'genres' && <Genres /> }
                { view === 'artists' && <Artists /> }
                </Container>

                <Link to="/map">Map</Link>
            </div>
        </main>
    );
}