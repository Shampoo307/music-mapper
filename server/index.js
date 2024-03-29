const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const qs = require('qs');
const { response } = require('express');

require('dotenv').config();

app.use(express.static('../client/build'));

// Search for a genre
app.get('/api/genre/:genre', (req, res) => {
    const genrename = req.params.genre;
    const query = `q=genre:"${genrename}"&type=artist`;
    const getAuth = getAccessToken();

    getAuth.then((token) => {
        const getOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            url: 'https://api.spotify.com/v1/search?' + query,
        }
        // Get results from spotify
        axios(getOptions)
            .then((response) => {
                const artists = response.data.artists.items;
                const genresList = artists.map(artist => {
                    return artist.genres;
                });
                const genres = [...new Set(genresList.flat())];
                res.send(genres);
            })
            .catch((err) => {
                if (err.repsonse) {
                    console.log('Error in Search Response');
                } else if (err.request) {
                    console.log('Error in Search Request');
                } else {
                    console.log('Error retrieving search result');
                }
            });
    });
});

// Get artists of given genres
app.get('/api/genrelist/:genres', async (req, res) => {
    const genres = req.params.genres.split('&&');
    
    const query_1 = `q=genre:"${genres[0]}"&type=artist`;
    const query_2 = `q=genre:"${genres[1]}"&type=artist`;
    const query_3 = `q=genre:"${genres[2]}"&type=artist`;

    // get genre artists from spotify API
    const [one, two, three] = 
        await Promise.all([getGenreArtists(query_1), getGenreArtists(query_2), getGenreArtists(query_3)]);
    const artists = [...one, ...two, ...three];

    // get artist info from musicbrainz API
    const artistsInfo = await Promise.all(
        artists.map(async (artist) => {
            const artistInfo = await searchArtistInfo(artist.name);
            
            const beginarea = artistInfo['begin-area']?.name ?? "";
            const area = artistInfo?.area?.name ?? "";

            let location;
            if (beginarea === "") {
                location = area;
            } else if (area !== "") {
                location = beginarea + ", " + area;
            }
            return {
                spotify: artist,
                musicbrainz: artistInfo,
                location: location
            };
        })
    );
    
    // get geolocations
    const artistsWithLatLongs = await Promise.all(
        artistsInfo.map(async (artist) => {
            const location = artist.location;
            const latlong = 
                location
                ? await retrieveLatLong(location)
                : { lat: 0, lng: 0 };
            return {
                ...artist,
                latlng: latlong
            };
        })
    );

    res.send(artistsWithLatLongs);
});

function retrieveLatLong(address) {
    const maps_key = process.env.MAPS_KEY;
    const getOptions = {
        method: 'GET',
        headers: { 
            'User-Agent': 'MusicMapper/0.1.0 ( tc99@live.com.au, n9960783@qut.edu.au )',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${maps_key}`,
    }
    return axios(getOptions)
        .then(res => {
            const latlng = res?.data?.results[0]?.geometry?.location ?? { lat: 0, lng: 0 };
            return latlng;
        });
}

function searchArtistInfo(artist) {
    const getOptions = {
        method: 'GET',
        headers: { 
            'User-Agent': 'MusicMapper/0.1.0 ( tc99@live.com.au, n9960783@qut.edu.au )',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        url: `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&limit=3&fmt=json&dismax=true`,
    }
    return axios(getOptions)
        .then((res) => {
            const highestScore = Math.max.apply(Math, res.data.artists.map(artist => {return artist.score}));
            const artist = res.data.artists.filter(artist => artist.score === highestScore);
            return artist[0];
        })
        .catch(err => {
            console.log('Error in searchArtistInfo!', err);
        });
}

function getGenreArtists(query) {
    const getAuth = getAccessToken();

    return getAuth.then((token) => {
        const getOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            url: 'https://api.spotify.com/v1/search?' + query + '&limit=4',
        }
        return axios(getOptions)
            .then((response) => {
                const artistsList = response.data.artists.items;
                return artistsList;
            })
            .catch((err) => {
                if (err.repsonse) {
                    console.log('Error in Search Response');
                } else if (err.request) {
                    console.log('Error in Search Request');
                } else {
                    console.log('Error retrieving search result');
                }
            });
    });
}

app.get('/api/artistsearch/:artistname', function(req, res) {
    const artistname = req.params.artistname;
    const query = `q=${artistname}&type=artist`;
    
    const getAuth = getAccessToken();

    getAuth.then((token) => {
        const getOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            url: 'https://api.spotify.com/v1/search?' + query,
        }
        axios(getOptions)
            .then((response) => {
                const artists = response.data.artists.items;
                const artistInfo = artists.map(artist => {
                    return {
                        name: artist.name,
                        image: artist?.images[0]?.url ?? "",
                        id: artist.id
                    }
                });
                res.send(artistInfo);
            })
            .catch((err) => {
                if (err.repsonse) {
                    console.log('Error in Search Response');
                } else if (err.request) {
                    console.log('Error in Search Request');
                } else {
                    console.log('Error retrieving search result');
                }
            });
    });

});

// Retrieve artists similar to the selected one
app.get('/api/artists/:artistId', function(req, res) {
    const artistId= req.params.artistId;
    console.log('artist id', artistId)
    
    const getAuth = getAccessToken();

    getAuth.then((token) => {
        const getOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
        }
        // Get similar artists from spotify
        axios(getOptions)
            .then((response) => {
                const artists = response.data.artists;
                return artists.slice(0, 10);
            })
            // Get info from musicbrainz
            .then(async (artists) => {
                const artistsInfo = await Promise.all(
                    artists.map(async (artist) => {
                        const artistInfo = await searchArtistInfo(artist.name);

                        const beginarea = artistInfo['begin-area']?.name ?? "";
                        const area = artistInfo?.area?.name ?? "";

                        let location;
                        if (beginarea === "") {
                            location = area;
                        } else if (area !== "") {
                            location = beginarea + ", " + area;
                        }
                        console.log('loication', location);
                        return {
                            spotify: artist,
                            musicbrainz: artistInfo,
                            location: location
                        };
                    })
                );
                return artistsInfo;
            })
            // Retrieve lat/lng from google geocode api
            .then(async (artistsInfo) => {
                const artistsWithLatLongs = await Promise.all(
                    artistsInfo.map(async (artist) => {
                        const location = artist.location;
                        const latlong = 
                            location
                            ? await retrieveLatLong(location)
                            : { lat: 0, lng: 0 };
                        return {
                            ...artist,
                            latlng: latlong
                        };
                    })
                );
                res.send(artistsWithLatLongs);
            })
            .catch((err) => {
                if (err.repsonse) {
                    console.log('Error in Search Response');
                } else if (err.request) {
                    console.log('Error in Search Request');
                } else {
                    console.log('Error retrieving search result');
                }
            });
    });

});


async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const authOptions = {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') },
        data: qs.stringify({ grant_type: 'client_credentials' }),
        url: 'https://accounts.spotify.com/api/token'
    }
    return await axios(authOptions)
            .then((response) => {
                return response.data.access_token;
            })
            .catch((err) => {
                if (err.repsonse) {
                    console.log('Error in Auth Response');
                } else if (err.request) {
                    console.log('Error in Auth Request');
                } else {
                    console.log('Error retrieving Access Token');
                }
            });
}


app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {

});