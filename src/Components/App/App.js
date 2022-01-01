import React from 'react';

import './App.css';

import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchResults:[],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  search(term){
    console.log(term);
    Spotify.search(term).then(searchResults => {
      console.log(searchResults);
      this.setState({searchResults: searchResults});
    });
  }

  addTrack(track){

    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
  }

  removeTrack(track){

    this.state.playlistTracks = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: this.state.playlistTracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName:name});
  }

  savePlaylist(){

    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });

  }

    render() {
  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">

        <SearchBar onSearch={this.search} />

        <div className="App-playlist">

          <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />

          <Playlist onSave={this.savePlaylist} 
          onNameChange={this.updatePlaylistName} 
          onRemove={this.removeTrack} 
          playlistname={this.state.playlistName} 
          playlistTracks={this.state.playlistTracks} />

        </div>
      </div>
    </div>
  );
}
}

export default App;
