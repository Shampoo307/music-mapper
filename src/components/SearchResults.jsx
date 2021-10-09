import  React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';



export default function  SearchResults(props) {
    const items = props.itemList.map(element => {
        return (
            <ListGroup.Item>
                <Button onClick={props.onClick}>
                    {element}
                </Button>
            </ListGroup.Item>
        );
    });

    return (
        <ListGroup>
            {items}
        </ListGroup>
    )
}