import  React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

import Search from '../components/Search.jsx';
import SearchResults from '../components/SearchResults.jsx';
import Selected from '../components/Selected.jsx';


export default function Genres(props) {
    const [ genresList, setGenresList ] = useState([]);
    const [ selectedGenres, setSelectedGenres ] = useState([]);
    const [ error, setError ] = useState('');

    const [ genreSearch, setGenreSearch ] = useState('');
    const [ searchError, setSearchError ] = useState('');

    const [ results, setResults ] = useState([]);

    const [ mapQuery, setMapQuery ] = useState('');

    const Results = () => {
        const divs = results.map(item => {
            return (
                <li>
                    <Row>
                        <p>Artist Name: {item.name}</p>
                        <p>AREA: {item.area.name}</p>
                        <p>BEGIN AREA: {item["begin-area"]?.name ?? item?.area?.name ?? "" } </p>
                    </Row>
                </li>
            );
        })
        return (
            <ul>
                {divs}
            </ul>
        )
    }

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
                setGenresList(res);
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
            setGenresList([]);
            setGenreSearch('');
        }
    };

    const removeSelection = (event) => {
        const toRemove = event.target.textContent;
        const updatedSelection = selectedGenres.filter(x => x !== toRemove);
        setSelectedGenres(updatedSelection);
    };

    const displayResults = () => {
        if (selectedGenres.length !== 3) {
            setError('Please select three genres!');
        } else {
            const queryString = selectedGenres.join('&&');
            fetch(`/api/genrelist/${queryString}`)
                .then(res => res.json())
                .then(res => {
                    const artists = res;
                    console.log('the artists', artists);
                    setResults(artists);
                });
        }
    };

    const showOnMap = () => {
        // const queryParam = 
        // dispac
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Selected selection={selectedGenres} onClose={removeSelection} />
                </Col>
            </Row>
            <Row>
                <Col>
                    { error && <Alert variant="danger">{error}</Alert>}
                    <Search 
                        handleChange={handleSearchChange}
                        handleSearch={handleSearch}
                        searchText="Search for a genre"
                        search={genreSearch}
                        error={searchError}
                    />
                    { genresList && <SearchResults itemList={genresList} onClick={makeSelection} /> }
                </Col>
            </Row>
            {/* <Button onClick={showOnMap}>
                Display results!
            </Button> */}
            <Link to={{ pathname: '/map', search: stringify({genres: {
                    genre1: selectedGenres[0],
                    genre2: selectedGenres[1],
                    genre3: selectedGenres[2]
                }}) 
            }}>Show results on a map!</Link>

            { results && <Results />}

        </Container>
    );  
}


