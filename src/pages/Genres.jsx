import  React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';
import Selected from '../components/Selected.jsx';


export default function Genres(props) {
    const [ genresList, setGenresList ] = useState([]);
    const [ selected, setSelected ] = useState([]);
    const [ error, setError ] = useState('');

    const [ genreSearch, setGenreSearch ] = useState('');
    const [ searchError, setSearchError ] = useState('');

    const handleSearchChange = (event) => {
        setGenreSearch(event.target.value);
    };
    
    const handleSearch = (event) => {
        event.preventDefault();
        if (searchError) {
            setError('');
        }
        if (genreSearch.trim() !== '') {
            searchGenre(genreSearch);
        } else {
            setSearchError('Please enter a valid search!');
        }
    }

    const searchGenre = (genre) => {
        if (error) {
            setError('');
        }
        fetch(`/api/genre/${genre}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setGenresList(res);
            });
    };

    const makeSelection = (event) => {
        event.preventDefault();
        if (selected.length > 2) {
            setError('Unable to select more than three genres!');
        } else {
            setSelected([...selected, event.target.textContent]);
            setGenresList([]);
            setGenreSearch('');
        }
    };

    const removeSelection = (event) => {
        const toRemove = event.target.textContent;
        const updatedSelection = selected.filter(x => x !== toRemove);
        setSelected(updatedSelection);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Selected selection={selected} onClose={removeSelection} />
                </Col>
            </Row>
            <Row>
                <Col>
                    { error && <Alert variant="danger">{error}</Alert>}
                    <Search 
                        handleChange={handleSearchChange}
                        handleSearch={handleSearch}
                        search={genreSearch}
                        error={searchError}
                    />
                    { genresList && <SearchResults itemList={genresList} onClick={makeSelection} /> }
                </Col>
            </Row>
            
            <Link to="/map">Map</Link>
        </Container>
    );  
}


