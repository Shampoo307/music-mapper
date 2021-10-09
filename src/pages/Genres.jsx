import  React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';
import Selected from '../components/Selected.jsx';


export default function Genres(props) {
    const [ searchResults, setSearchResults ] = useState([]);
    const [ selectedGenres, setSelectedGenres ] = useState([]);
    const [ error, setError ] = useState('');

    const [ searchValue, setSearchValue ] = useState('');
    const [ searchError, setSearchError ] = useState('');

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };
    
    const handleSearch = (event) => {
        event.preventDefault();
        if (searchError) {
            setError('');
        }
        if (searchValue.trim() !== '') {
            searchGenre(searchValue);
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
                setSearchResults(res);
            });
    };

    const makeSelection = (event) => {
        event.preventDefault();
        if (selectedGenres.length > 2) {
            setError('Unable to select more than three genres!');
        } else if (selectedGenres.includes(event.target.textContent)) {
            setError('Cannot select the same genre twice');
        } else {
            setSelectedGenres([...selectedGenres, event.target.textContent]);
            setSearchResults([]);
            setSearchValue('');
        }
    };

    const removeSelection = (event) => {
        const toRemove = event.target.textContent;
        const updatedSelection = selectedGenres.filter(x => x !== toRemove);
        setSelectedGenres(updatedSelection);
    };

    const MapLink = () => {
        return (
            <Button>
                <Link to={{ pathname: '/map/genre', search: stringify({genres: {
                    genre1: selectedGenres[0],
                    genre2: selectedGenres[1],
                    genre3: selectedGenres[2]
                    }}) 
                }}>Show results on a map!</Link>
            </Button>
        )
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Selected selection={selectedGenres} onClose={removeSelection} />
                    { selectedGenres.length === 3 && <MapLink />}
                </Col>
            </Row>
            <Row>
                <Col>
                    { error && <Alert variant="danger">{error}</Alert>}
                    <Search 
                        handleChange={handleSearchChange}
                        handleSearch={handleSearch}
                        searchText="Search for a genre"
                        search={searchValue}
                        error={searchError}
                    />
                    { searchResults && <SearchResults itemList={searchResults} onClick={makeSelection} /> }
                </Col>
            </Row>
        </Container>
    );  
}


