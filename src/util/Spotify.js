const clientID = 'ff45636426ae4b228fd35a6ffc48b1c5';
const redirectURI = 'http://localhost:3000/';
let accessToken = undefined;
let expiresIn = undefined;

let Spotify = {
	
	getAccessToken() {
		if(accessToken) {
			return accessToken;
		}
		else {
			let urlAccessToken =  window.location.href.match(/access_token=([^&]*)/);
			let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
			
			if(urlAccessToken && urlExpiresIn) {
				accessToken = urlAccessToken[1];
				expiresIn = urlExpiresIn[1];
				window.setTimeout(() => accessToken = '', expiresIn * 1000);
				window.history.pushState('Access Token', null, '/');
			}
			else {
				const url = `https://accounts.spotify.com/authorize?client_id=${clientID}&scope=playlist-modify-public&response_type=token&redirect_uri=${redirectURI}`;
				window.location.replace(url);
			}
		}
	},
	
	search(term) {
		this.getAccessToken();
		
		return fetch(
			`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=${term}&type=track`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		).then(response => 
			{
				return response.json();	
			}
		).then(jsonResponse => {
				if(jsonResponse.tracks.items) {
					return jsonResponse.tracks.items.map(track => (
						{
							id: track.id,
							name: track.name,
							artist: track.artists[0].name,
							album: track.album.name,
							uri: track.uri
						}
					));
				}
				else {
					return [];
				}
			}
		);
	},
	
	savePlaylist(name, tracks) {
		if(!name || !tracks) {
			return;
		}
		else {
			let user_id = undefined;
			let playlistID = undefined;
			let trackURIs = tracks.map(track => track.uri);
			let addTracksJSON = JSON.stringify({"uris": trackURIs});
			
			fetch(
				`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			).then(response => 
				{
					return response.json();	
				}
			).then(jsonResponse => {
				user_id = jsonResponse.id;
			}).then(() => {
				fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${user_id}/playlists`,
					{
						method: 'POST',
						headers: {
							"Authorization": `Bearer ${accessToken}`,
							"Content-type": "application/json"
						}, 
						body: JSON.stringify({name: name})
					}
				)
				.then(response => {
					if(response.ok) return response.json()
				})
				.then(jsonResponse => {
					playlistID = jsonResponse.id
				})
				.then(() => { 
					fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${user_id}/playlists/${playlistID}/tracks`,
						{
							method: 'POST',
							headers: {
								"Authorization": `Bearer ${accessToken}`,
								"Content-type": "application/json"
							},
							body: addTracksJSON
						}
					)
					.then(response => {
						if(response.ok) return response.json()
					})
					.then(jsonResponse => {
						playlistID = jsonResponse.id
					})
				})
			})
		}
	}
};

export default Spotify;