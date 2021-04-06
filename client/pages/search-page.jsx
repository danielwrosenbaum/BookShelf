import React from 'react';
import parseRoute from '../lib/parse-route';
import AdvancedSearch from './advanced-search';

const apiKey = 'key=AIzaSyAvazhS5IpqO0KVFL5XyOvDA-Gns7YyFJ8';
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isClicked: false,
      data: [],
      route: parseRoute(window.location.hash)
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdvancedButton = this.handleAdvancedButton.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    // this.setState({ submitted: true });
    // if (this.state.submitted) {
    const query = this.state.inputValue;
    fetch(bookURL + query + '&' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          // console.log(result);
          this.setState({
            data: result
          });
        }
      );
    // }

  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleAdvancedButton() {
    this.setState({ isClicked: true });

  }

  renderPage() {

  }

  render() {
    if (this.state.isClicked) return <AdvancedSearch />;
    return (
      <div className="search-container home">
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="heading">Search</div>
            <input placeholder="Search Books" required className="text-box" type="text" name="search" onChange={this.handleChange} />
          </label>
          <div>
            <input className="button submit" type="submit" value="Submit" />
          </div>
        </form>
        <button onClick={this.handleAdvancedButton} className="button advanced-btn">Advanced Search</button>
      </div>
    );
  }
}
