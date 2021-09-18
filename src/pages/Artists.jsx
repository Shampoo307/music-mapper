import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';
import Selected from '../components/Selected.jsx';


export default function Artists(props) {
    const [ artistsList, setArtists ] = useState([]);
    const [ selectedArtist, setSelectedArtist ] = useState('');
    const [ error, setError ] = useState('');

    const [ artistSearch, setArtistSearch ] = useState('');
    const [ searchError, setSearchError ] = useState('');

    const [ results, setResults ] = useState('');

    const searchArtist = (artist) => {
        fetch(`/api/artist/${artist}`)
            .then(res => res.json())
            .then(res => {
                console.log('res from artist search', res);
                // setArtists(res);
            });
    }

    const handleSearchChange = (event) => {
        setArtistSearch(event.target.value);
    };
    
    const handleSearch = (event) => {
        event.preventDefault();
        if (searchError) {
            setError('');
        }
        if (artistSearch.trim() !== '') {
            searchArtist(artistSearch);
        } else {
            setSearchError('Please enter a valid search!');
        }
    }

    const makeSelection = (event) => {
        event.preventDefault();
        if (selectedArtist !== '') {
            setError('Unable to select more than artist!');
        } else {
            setSelectedArtist(null);
            setArtists('');
            setArtistSearch('');
        }
    };

    const removeSelection = (event) => {
        setSelectedArtist('');
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Row className="selections">
                        {selectedArtist !== '' && 
                            <Col className="selected-genres">
                                <Button variant="outline-dark" onClick={removeSelection}>
                                    {selectedArtist}
                                </Button>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    { error && <Alert variant="danger">{error}</Alert>}
                    <Search 
                        handleChange={handleSearchChange}
                        handleSearch={handleSearch}
                        searchText="Search for an artist"
                        search={artistSearch}
                        error={searchError}
                    />
                    { artistsList && <SearchResults itemList={artistsList} onClick={makeSelection} /> }
                </Col>
            </Row>
            {/* <Button onClick={showOnMap}>
                Display results!
            </Button> */}
            {/* <Link to={{ pathname: '/map', search: stringify({genres: {
                    genre1: selectedGenres[0],
                    genre2: selectedGenres[1],
                    genre3: selectedGenres[2]
                }}) 
            }}>Show results on a map!</Link> */}

            {/* { results && <Results />} */}

        </Container>
    );
}


