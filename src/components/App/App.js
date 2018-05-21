import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [], 
			playlistName: 'myPlayList', 
			playlistTracks: []
		};
		this.search = this.search.bind(this);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
	}
	
	addTrack(track) {
		if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
			return;
		}

		this.setState(prevState => ({
			playlistTracks: [...prevState.playlistTracks, track]
		}));
	}
	
	removeTrack(track) {
		let filteredPlaylistTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
		this.setState({playlistTracks: filteredPlaylistTracks});
	}
	
	search(term) {
		Spotify.search(term).then(searchResults => {
			this.setState({searchResults: searchResults});
		});
	}
	
	updatePlaylistName(name) {
		this.setState({playlistName: name});
	}
	
	savePlaylist() {
		Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks);
		this.setState({playlistName: "New Playlist", playlistTracks: []});
	}
	
  render() {
    return (
		<div>
			<h1>Ja<span className="highlight">mmm</span>ing</h1>
			<div className="App">
				<SearchBar onSearch={this.search}/>
				<div className="App-playlist">
					<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
					<Playlist playlistName={this.state.playlistNames} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
				</div>
			</div>
		</div>	  
    );
  }
}

export default App;
