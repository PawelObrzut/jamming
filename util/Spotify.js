const clientID = '5ff15a5f9a144496a85f8820eee41418';
const redirectURI = 'http://Pawel_app_createYourSpotifyPlaylist.surge.sh';

let userAccessToken;

export const Spotify = {
    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expriationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expriationTimeMatch) {
            userAccessToken = accessTokenMatch[1];
            const expireIn = Number(expriationTimeMatch[1]);
            window.setTimeout(()=>userAccessToken = '', expireIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
        
    },
    search(searchTerm) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            { 
                headers: {
                   Authorization: `Bearer ${this.getAccessToken()}` 
                }
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.tracks) {
                      return jsonResponse.tracks.items.map(item => {
                            return {
                                id: item.id,
                                name: item.name,
                                artist: item.artists[0].name,
                                album: item.album.name,
                                uri: item.uri
                            }
                        });
                    } else {
                        return []
                    }
        });
    },
    // this method saves created playlist to user's spotify account
    savePlaylist(nameOfThePlaylist,trackURIs) {
        const accessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        let playlistID;
        if (trackURIs.length===0 || nameOfThePlaylist.length===0) {
            return;
        } else {
            return fetch(`https://api.spotify.com/v1/me`,{headers:headers})
                .then(response=> response.json())
                .then(jsonResponse=>{
                    userID = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
                        method: 'POST',
                        headers: headers,
                        'content-Type': 'application/json',
                        body: JSON.stringify({name: nameOfThePlaylist})
                    })
                        .then(response=>response.json())
                        .then(jsonResponse=>{
                            playlistID = jsonResponse.id;
                            
                            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                                method: 'POST',
                                headers: headers,
                                'content-Type': 'application/json',
                                body: JSON.stringify({uris: trackURIs})
                            })
                                .then(response=> response.json())
                                .then(jsonResponse=>{
                                    playlistID = jsonResponse.id;
                            })
                    })
            })
        };
    }

};

export default Spotify;