import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';


export default function Artists(props) {
    const [ artists, setArtists ] = useState([]);

    const searchGenre = (genre) => {
        fetch(`/api/genre/${genre}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setArtists(res);
            });
    }

    return (
        <main className="form">
            <div>
                <Search handleSearch={searchGenre} />
                { artists && <SearchResults itemList={artists}/>}
                <Link to="/map">Map</Link>
            </div>
        </main>
    );
}


