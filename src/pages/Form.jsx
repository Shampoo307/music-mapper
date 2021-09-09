import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';


// search genres & countries with most artists of that genre
// search artists and reveal artists similar to that one and their location 



export default function Form(props) {
    const [ genres, setGenres ] = useState([]);

    const searchGenre = (genre) => {
        fetch(`/api/genre/${genre}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setGenres(res);
            });
    }

    return (
        <main className="form">
            <div>
                <h1>Music Mapper</h1>
                <p>Welcome to Music Mapper!</p>
                <p>Select up to three genres and see the regions with the most popular from each genre</p>
                <p>or</p>
                <p>Search for an artist and see the regions with the most artists similar to the one you searched for</p>
                <Search handleSearch={searchGenre} />
                { genres && <SearchResults itemList={genres}/>}
                <Link to="/map">Map</Link>
            </div>
        </main>
    );
}