const clientID='cf652029a92e4c6a9388a36dcb48164f';
const redirectURI='http://localhost:3000/';
let accessToken;

const Spotify={
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        
        const location=window.location.href;

        if(location.match(/access_token=([^&]*)/) && location.match(/expires_in=([^&]*)/)){

            accessToken=location.match(/access_token=([^&]*)/);
            accessToken=accessToken[0].replace('access_token=','');



            let expirationTime=location.match(/expires_in=([^&]*)/);

            expirationTime=expirationTime[0].replace('expires_in=','');

            window.setTimeout(() => accessToken = '', Number(expirationTime) * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;

        } else {
            window.location=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    search(searchTerm){

        console.log(searchTerm);
        const accessToken = Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response=>{

            return response.json();
        }).then(jsonResponse=>{

            if (!jsonResponse.tracks) {
                return [];
              }

            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },
    savePlaylist(playlistName,trackURIs){

        if(playlistName==='' && trackURIs.length===0){
            return;
        }
        
        const accessToken=Spotify.getAccessToken();
        const headers={
            Authorization: `Bearer ${accessToken}`
        }
        let userID;

        return fetch('https://api.spotify.com/v1/me',{
            headers:headers
        }).then(response=>response.json()).then(jsonResponse=>{

            userID = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {

                const playlistId = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                });
            });
        })
    }
}

export default Spotify;