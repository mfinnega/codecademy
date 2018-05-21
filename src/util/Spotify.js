const clientID = 'ff45636426ae4b228fd35a6ffc48b1c5';
const redirectURI = 'http://localhost:3000/';
let accessToken = null;
let expiresIn = null;

let Spotify = {
	
	getAccessToken() {
		if(accessToken !== null) {
			return accessToken;
		}
		else {
			if(window.location.href.match(/access_token=([^&]*)/) === null) {
				const url = `https://accounts.spotify.com/authorize?client_id=${clientID}&scope=playlist-modify-public&response_type=token&redirect_uri=${redirectURI}`;
				window.location.replace(url);
			}
			else {
				accessToken = window.location.href.match(/access_token=([^&]*)/);
				expiresIn = window.location.href.match(/expires_in=([^&]*)/);
				
				window.setTimeout(() => accessToken = '', expiresIn * 1000);
				window.history.pushState('Access Token', null, '/');
			}
		}
	},
	
	search(term) {
		this.getAccessToken();
		
		return fetch(
			`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=${term}&type=track`,
			{
				headers: {
					Authorization: `Bearer ${accessToken[1]}`
				}
			}
		).then(response => 
			{
				return response.json();	
			}
		).then(jsonResponse => {
				console.log(jsonResponse);
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
	
	savePlaylist(name, trackURIs) {
		if(!name || !trackURIs) {
			return;
		}
		else {
			this.getAccessToken();
			let headers = {Authorization: accessToken};
			let user_id;
			let playlistID;
			
			//do I need return fetch( ?
			fetch(
				`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`,
				{
					headers: {
						Authorization: `Bearer ${accessToken[1]}`
					}
				}
			).then(response => 
				{
					return response.json();	
				}
			).then(jsonResponse => {
				user_id = jsonResponse.id;
			});
			
			fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/{user_id}/playlists`,
				{
					method: 'POST',
					headers: {
						"Content-type": "application/json"
					}, 
					body: JSON.stringify({name: name})
				}
			).then(response => {
				if (response.ok) {
					let jsonResponse = response.json();
					playlistID = jsonResponse.id;
				}
			});
			
			fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/{user_id}/playlists/{playlistID}/tracks`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken[1]}`
					},
					body: {uris: trackURIs}
				}
			).then(response => {
				if (response.ok) {
					let jsonResponse = response.json();
					playlistID = jsonResponse.id;
				}
			});
		}
	}
};

export default Spotify;