import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { stringify } from 'qs';

import Search from '../components/Search.jsx';
import SearchResultArtist from '../components/SearchResultArtist.jsx';


export default function Artists(props) {
    const [ searchResults, setSearchResults ] = useState([]);
    const [ selectedArtist, setSelectedArtist ] = useState('');
    const [ selectedArtistId, setSelectedArtistId ] = useState('');

    const [ error, setError ] = useState('');

    const [ searchValue, setSearchValue ] = useState('');
    const [ searchError, setSearchError ] = useState('');

    const searchArtist = (artist) => {
        fetch(`/api/artistsearch/${artist}`)
            .then(res => res.json())
            .then(res => {
                setSearchResults(res);
            });
    }

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };
    
    const handleSearch = (event) => {
        event.preventDefault();
        if (searchError) {
            setError('');
        }
        if (searchValue.trim() !== '') {
            searchArtist(searchValue);
        } else {
            setSearchError('Please enter a valid search!');
        }
    }

    const makeSelection = (id, name) => {
        if (selectedArtist !== '') {
            setError('Unable to select more than artist!');
        } else {            
            setSelectedArtist(name);
            setSelectedArtistId(id);
            setSearchResults([]);
            setSearchValue('');
        }
    };

    const removeSelection = (event) => {
        setSelectedArtist('');
        setSelectedArtistId('');
    };

    const MapLink = () => {
        return (
            <Button>
                <Link 
                to={{
                    pathname: '/map/artist', 
                    search: stringify({artist: selectedArtistId}) 
                }}>
                        Show results on a map!
                </Link>
            </Button>
        )
    }

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
                                {selectedArtist && <MapLink />}
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
                        search={searchValue}
                        error={searchError}
                    />
                    { searchResults && <SearchResultArtist itemList={searchResults} onClick={makeSelection} /> }
                </Col>
            </Row>
        </Container>
    );
}


