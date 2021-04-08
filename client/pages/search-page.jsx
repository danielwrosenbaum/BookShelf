import React from 'react';
import AdvancedSearch from './advanced-search';
import AppContext from '../lib/app-context';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isClicked: false,
      results: false,
      data: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdvancedButton = this.handleAdvancedButton.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    window.location.hash = 'results?search=' + this.state.inputValue;

  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleAdvancedButton() {
    this.setState({ isClicked: true });
  }

  render() {
    if (this.state.isClicked) return <AdvancedSearch />;
    return (
       <div className="search-container home">
          <form className="search-form" onSubmit={this.handleSubmit}>
            <label>
              <div className="heading one">Search</div>
              <input placeholder="Search Books" required className="text-box" type="text" name="search" onChange={this.handleChange} />
            </label>
            <a href="#results">
              <input className="button submit" type="submit" value="Submit" />
            </a>
          </form>
          <a href="#advanced-search">
            <button onClick={this.handleAdvancedButton} className="button advanced-btn">Advanced Search</button>
          </a>
        </div>

    );
  }
}
SearchPage.contextType = AppContext;
