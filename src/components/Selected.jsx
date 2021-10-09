import  React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';



export default function Selected(props) {

    const items = props.selection.map(element => {
        return (
            <Col className="selected-genres">
                <Button variant="outline-dark" onClick={props.onClose}>
                    {element}
                </Button>
            </Col>
        );
    });

    return (
        <Row className="selections">
            {items}
        </Row>
    )
}