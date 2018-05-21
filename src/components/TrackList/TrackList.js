import React from 'react';
import './TrackList.css';
import Track from '../../components/Track/Track';

class TrackList extends React.Component {	
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this);
		return (
			<div className="TrackList">
			{
				this.props.tracks.map(track => <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>)
			}
			</div>
		);
	}
}

export default TrackList;