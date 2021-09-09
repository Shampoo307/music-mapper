import  React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';



export default function  SearchResults(props) {

    const items = props.itemList.map(element => {
        return <ListGroup.Item>{element}</ListGroup.Item>
    });

    return (
        <ListGroup>
            {items}
        </ListGroup>
    )
}