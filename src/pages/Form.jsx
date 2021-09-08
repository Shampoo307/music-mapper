import  React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



export default function Form(props) {
    return (
        <main className="form">
            <div>
                <p>home</p>
                <Link to="/map">Map</Link>
            </div>
        </main>
    );
}