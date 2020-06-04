import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }
    
    updatePlaylistName(name) {
        this.setState({playlistName:name});
    }
    
    savePlaylist() {
        let trackURIs = []
        for (let i=0; i< this.state.playlistTracks.length;i++) {
            trackURIs.push(this.state.playlistTracks[i].uri);
        };
        Spotify.savePlaylist(this.state.playlistName,trackURIs);
        this.setState({playlistName:'New Playlist',playlistTracks:[]});
    }
    
    addTrack(track) {
        let idList = [];
        let updatedPlaylistTracks = this.state.playlistTracks;
        for (let i=0;i<this.state.playlistTracks.length;i++) {
          idList.push(this.state.playlistTracks[i].id);
        };
        if (idList.indexOf(track.id) === -1) {
            updatedPlaylistTracks.push(track);
            this.setState({playlistTracks: updatedPlaylistTracks});
        }
    }
    
    removeTrack(track) {
        let updatedPlaylistTracks = this.state.playlistTracks.filter(playlistTrack=>{
            if (track.id !== playlistTrack.id){
                return true;
            };
        });
        this.setState({playlistTracks: updatedPlaylistTracks});
    }
    
    search(term) {
        Spotify.search(term).then(searchResults => {
            this.setState({searchResults: searchResults});
        });
    }
    
    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar onSearch={this.search}/>
                <div className="App-playlist">
            
                    <SearchResults 
                        onAdd={this.addTrack} 
                        searchResults={this.state.searchResults}/>
            
                    <Playlist 
                        onSave={this.savePlaylist}
                        onNameChange={this.updatePlaylistName}
                        onRemove={this.removeTrack}
                        playlistTracks={this.state.playlistTracks} 
                        playlistName={this.state.playlistName}/>
                </div>
              </div>
            </div>
          );
    }
}

export default App;