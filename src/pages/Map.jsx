import  React, { useState, useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function MapContainer() {
    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
        mapTypeControl: true,
        rotateControl: true,
        fullscreenControl: true
    };
    const mapStyles = {        
        height: "100vh",
        width: "100%"
    };
  
    const defaultCenter = {
        lat: 41.3851, lng: 2.1734
    }
  
    return (
        <LoadScript
            googleMapsApiKey='AIzaSyClO2KIxeZAEFpz8uNCdDpgBVtbW7GgKL0'>
                <GoogleMap
                    options={options}
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={defaultCenter}
                />
        </LoadScript>
    )
}


export default function Map(props) {

  

    return (
        <main className="form">
            <div>
                <MapContainer />
            </div>
        </main>
    );
}