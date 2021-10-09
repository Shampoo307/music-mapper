import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';

import Genres from './Genres.jsx';
import Artists from './Artists.jsx';

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
                <h1 className="form-header">Music Mapper</h1>
                <Container>
                    <Row className="form-intro">
                        <Col>Select three music genres and see on a map the starting-areas for the most popular artists of those genres</Col>
                        <Col>or</Col>
                        <Col>Select an artist and see on a map the starting-areas for that artist and artists similar to the chosen one</Col>
                    </Row>
                </Container>
                
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