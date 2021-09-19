import  React, { useState, useEffect } from 'react';
import { ListGroup, Button, Image } from 'react-bootstrap';



export default function  SearchResults(props) {
    const items = props.itemList.map(item => {
        return (
            <ListGroup.Item>
                <Button onClick={props.onClick} className="list-group-item list-group-item-action action">
                        {
                            item.image
                            ?
                                <div>
                                    <Image src={item.image} />
                                    <p>{item.name}</p>
                                </div>
                            :   
                                <div>
                                    <p className="image-placeholder">&nbsp;</p>
                                    <p className="artist-with-placeholder">{item.name}</p>    
                                </div>
                        }
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