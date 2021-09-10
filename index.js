const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const qs = require('qs');

require('dotenv').config();

app.use(express.static('../client/build'));

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

app.get('/api/genrelist/:genres', async (req, res) => {
    const genres = req.params.genres.split('&&');
    
    const query_1 = `q=genre:"${genres[0]}"&type=artist`;
    const query_2 = `q=genre:"${genres[1]}"&type=artist`;
    const query_3 = `q=genre:"${genres[2]}"&type=artist`;

    const [one, two, three] = 
        await Promise.all([getGenreArtists(query_1), getGenreArtists(query_2), getGenreArtists(query_3)]);
        
    const artists = [...one, ...two, ...three];
    console.log('alllll', artists)
    res.send(artists);
    // const results_1 = getGenreArtists(query_1);
    // const results_2 = getGenreArtists(query_2);
    // const results_3 = getGenreArtists(query_3);
    // const results_2 = genres[1] ? getGenreArtists(query_2) : [];
    // const results_3 = genres[2] ? getGenreArtists(query_3) : [];
    // results_1.then( response => {
    //     console.log('results 1', response);
    //     res.send(response);
        
    // });
    // results_1.then((response) => {
    //     // console.log('results 1', response)
    //     res.write(response);
    // });
    // results_2.then((response) => {
    //     // console.log('results 1', response)
    //     res.write(response);
    // });
    // results_3.then((response) => {
    //     // console.log('results 1', response)
    //     res.write(response);
    // });

    // res.end();
    // console.log('results 2', results_2);
    // console.log('results 3', results_3);


    // const address = fetch("https://jsonplaceholder.typicode.com/users/1")
    //     .then((response) => response.json())
    //     .then((user) => {
    //         return user.address;
    //     });

    // const printAddress = async () => {
    //     const a = await address;
    //     console.log(a);
    // };

    // printAddress();


    // res.send(results_1);

});

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
            url: 'https://api.spotify.com/v1/search?' + query,
        }
        return axios(getOptions)
            .then((response) => {
                const artistsList = response.data.artists.items;
                // console.log('artist list', artistsList);
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

// router.get('/artist/:artistname', function(req, res, next) {

//     const artistname = req.params.artistname;
//     const query = `q=${artistname}&type=artist`;
    
//     const getAuth = getAccessToken();

//     getAuth.then((token) => {
//         const getOptions = {
//             method: 'GET',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             },
//             url: 'https://api.spotify.com/v1/search?' + query,
//         }
//         axios(getOptions)
//             .then((response) => {
//                 // displaySearch(response.data);
//                 const artists = response.data.artists.items;
//                 artists.forEach(item => console.log('images', item.images[0]));
//                 return artists.map(artist => {
//                     return {
//                         name: artist.name,
//                         image: artist?.images[0]?.url ?? "",
//                         id: artist.id
//                     }
//                 });
//             })
//             .then((data) => {
//                 res.render('music', { artists: data });
//             })
//             .catch((err) => {
//                 if (err.repsonse) {
//                     console.log('Error in Search Response');
//                 } else if (err.request) {
//                     console.log('Error in Search Request');
//                 } else {
//                     console.log('Error retrieving search result');
//                 }
//             });
//     });

// });

// function selectArtist(artist) {
//     console.log('artist selected', artist);
// }

// function displaySearch(data) {
//     const artists = data.artists.items;
//     console.log('artists: ', artists);
//     const artistNames = artists.map(artist => { return artist.name });
//     rend
// }










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