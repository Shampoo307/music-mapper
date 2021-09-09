import  React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';



export default function Search(props) {
    
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const handleChange = (event) => {
        setSearch(event.target.value);
    };
    
    const handleSearch = (event) => {
        event.preventDefault();
        if (search.trim() !== '') {
            props.handleSearch(search);
        } else {
            setError('Please enter a valid search');
        }
    };


    return (
        <div>
            <Form onSubmit={handleSearch}>
                { error && <p className="errorMsg">{error}</p>}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Enter search term</Form.Label>
                    <Form.Control
                        type="search"
                        name="searchTerm"
                        value={search}
                        placeholder="Search for a genre"
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </Form.Group>
                <Button variant="info" type="submit">
                    Search
                </Button>
            </Form>
        </div>
    );
}