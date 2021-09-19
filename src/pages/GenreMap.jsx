import  React, { useState, useEffect, useMemo } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import { useParams, useLocation } from 'react-router';
import { parse } from 'qs';


const ArtistInfo = (props) => {
    const artist = props.artist;
    return (
        <div>
            <h2>{artist.info.name}</h2>
            <h4>{artist.info.lifespan?.begin ?? "N/A"} - {artist.info.lifespan?.ended ?? "N/A"}</h4>
            <h4>Spotify Followers: {artist.info.followers}</h4>
            <iframe 
                title={artist.info.followers}
                src={artist.info.embed}
                width="300"
                height="80" 
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media"></iframe>
        </div>
    );
}



function MapContainer() {
    const [ markers, setMarkers ] = useState([]);
    const [ activeMarker, setActiveMarker ] = useState(null);
    // const [ results, setResults ] = useState([]);

    const params = parse(new URLSearchParams(useLocation()).toString()).search;
    const separatedParams =  params.replace('?', '&').split('&genres%5B');
    const genres = separatedParams.map(str => str.slice(10)).filter(str => str !== "");
    
    const queryString = genres.join('&&');
    useMemo(() => {
        // retrieve artist info
        fetch(`/api/genrelist/${queryString}`)
        .then(res => res.json())
        // .then(res => {
        //     const artists = res;
        //     // setResults(artists);
        //     return artists;
        // })
        // Make markers from artist results
        .then((res) => {
            const allArtists = res;
            // get distinct list of coords
            const distinctCoords = [...new Set(allArtists.map(artist => artist.latlng))];
            const markers = distinctCoords.map((coords, index) => {
                // get artists with same latlng
                const dupeArtists = allArtists.filter(artist => artist.latlng.lat === coords.lat && artist.latlng.lng === coords.lng);
                
                let markerInfo;

                // if multiple artists with same coords
                if (dupeArtists?.length !== undefined) {
                    markerInfo = dupeArtists.map(artist => {
                        // get array of individual artist info
                            const embedurl = artist.spotify.external_urls.spotify.replace('.com/', '.com/embed/')
                            const info = {
                                name: artist.spotify.name,
                                followers: artist.spotify.followers.total,
                                embed: embedurl,
                                lifespan: artist?.musicbrainz['life-span'],
                            }
                            return {
                                name: artist.name,
                                info: info
                            };
                    });
                } else {
                    // else return single artist's info in array
                    markerInfo = [{
                        name: dupeArtists.name,
                        info: dupeArtists.info
                    }];
                }

                return {
                    id: index,
                    position: coords,
                    artists: markerInfo
                }
            });
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
                                        {props.artists.map(artist => {
                                            return (
                                                <ArtistInfo artist={artist} />
                                            )
                                        })}
                                    </div>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    ))}
                </GoogleMap>
        </LoadScript>
    )
}

export default function GenreMap(props) {
    return (
        <main className="form">
            <div>
                <MapContainer />
            </div>
        </main>
    );
}