import  React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';



export default function Search(props) {
    return (
        <div>
            <Form onSubmit={props.handleSearch}>
                { props.error && <p className="errorMsg">{props.error}</p>}
                <Form.Group>
                    <Form.Label>{props.searchText}</Form.Label>
                    <Row>
                        <Col>
                            <Form.Control
                                type="search"
                                name="searchTerm"
                                value={props.search}
                                placeholder={props.searchText}
                                onChange={props.handleChange}
                                autoComplete="off"
                            />
                        </Col>
                        <Col xs="auto">
                            <Button variant="info" type="submit">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </div>
    );
}