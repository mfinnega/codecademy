import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {	
	constructor(props) {
		super(props);

		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {"term": ''};
	}

	handleTermChange(event) {
		this.setState({term: event.target.value});
	}
	
	handleSearch(event) {
		this.props.onSearch(this.state.term);
		event.preventDefault();
	}
	
	search() {
		this.props.onSearch(this.state.term);
	}

	render() {
		return (
			<div className="SearchBar">
			  <input placeholder="Enter A Song Title"  onChange={this.handleTermChange}/>
			  <a onClick={this.handleSearch}>SEARCH</a>
			</div>
		);
	}
}

export default SearchBar;