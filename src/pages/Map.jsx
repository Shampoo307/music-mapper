import  React, { useState, useEffect, useMemo } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import { useParams, useLocation } from 'react-router';
import { parse } from 'qs';

function MapContainer() {
    const [ markers, setMarkers ] = useState([]);
    const [ activeMarker, setActiveMarker ] = useState(null);
    const [ results, setResults ] = useState([]);

    const params = parse(new URLSearchParams(useLocation()).toString()).search;
    const separatedParams =  params.replace('?', '&').split('&genres%5B');
    const genres = separatedParams.map(str => str.slice(10)).filter(str => str !== "");
    
    const queryString = genres.join('&&');
    useMemo(() => {
        // retrieve artist info
        fetch(`/api/genrelist/${queryString}`)
        .then(res => res.json())
        .then(res => {
            const artists = res;
            console.log('artists', artists);
            setResults(artists);
            return artists;
        })
        // Make markers from artist results
        .then((artists) => {
            // get distinct list of coords

            // for each distinct pair of coords,
            // return the artist obj
            // 
            const markers = artists.map((artist, index) => {
                const embedurl = artist.spotify.external_urls.spotify.replace('.com/', '.com/embed/')
                const info = {
                    name: artist.spotify.name,
                    followers: artist.spotify.followers.total,
                    embed: embedurl,
                    lifespan: artist?.musicbrainz['life-span'],
                }
                return {
                    id: index,
                    name: artist.location,
                    position: artist.latlng,
                    info: info
                }
            });
            // check if any 
            setMarkers(markers);
        });
    }, [queryString]);
    

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

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
  
    // replace????
    const defaultCenter = {
        lat: 37.09024,
        lng: -95.712891
    }
  
    return (
        <LoadScript
            googleMapsApiKey='AIzaSyClO2KIxeZAEFpz8uNCdDpgBVtbW7GgKL0'>
                <GoogleMap
                    options={options}
                    mapContainerStyle={mapStyles}
                    zoom={2}
                    center={defaultCenter}
                    onClick={() => setActiveMarker(null)}
                >
                    {markers.map((props) => (
                        <Marker
                            key={props.id}
                            position={props.position}
                            onClick={() => handleActiveMarker(props.id)}
                        >
                            {activeMarker === props.id ? (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <div>
                                        <h2>{props.info.name}</h2>
                                        <h4>{props.info.lifespan?.begin ?? "N/A"} - {props.info.lifespan?.ended ?? "N/A"}</h4>
                                        <h4>Spotify Followers: {props.info.followers}</h4>
                                        <iframe 
                                            title={props.id}
                                            src={props.info.embed}
                                            width="300"
                                            height="80" 
                                            frameborder="0"
                                            allowtransparency="true"
                                            allow="encrypted-media"></iframe>
                                    </div>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    ))}
                </GoogleMap>
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