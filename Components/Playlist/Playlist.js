import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(e) {
        this.props.onNameChange(e.target.value);        
    }
    
    render() {
        return (
            <div className="Playlist">
              <input 
                    onChange={this.handleNameChange} 
                    value={this.props.playlistName}/>
                <TrackList 
                    isRemoval={true}
                    onRemove={this.props.onRemove}
                    tracks={this.props.playlistTracks} />
              <button 
                    className="Playlist-save"
                    onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}

export default Playlist;