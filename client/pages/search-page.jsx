import React from 'react';
import AdvancedSearch from './advanced-search';
import AppContext from '../lib/app-context';
import Results from './results';

const apiKey = process.env.API_KEY;
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

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
    const query = this.state.inputValue;
    fetch(bookURL + query + '&' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            data: result,
            results: true
          });
        }
      )
      .catch(error => console.error(error));

  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleAdvancedButton() {
    this.setState({ isClicked: true });

  }

  render() {

    if (this.state.data) return <Results value={this.state.data} />;
    if (this.state.isClicked) return <AdvancedSearch />;
    return (
         <div className="search-container home">
          <form className="search-form" onSubmit={this.handleSubmit}>
            <label>
              <div className="heading one">Search</div>
              <input placeholder="Search Books" required className="text-box" type="text" name="search" onChange={this.handleChange} />
            </label>
            <div>
              <a href ="#results">
                <input className="button submit" type="submit" value="Submit" />
              </a>
            </div>
          </form>
          <a href="#advanced-search">
            <button onClick={this.handleAdvancedButton} className="button advanced-btn">Advanced Search</button>
          </a>
        </div>

    );
  }
}
SearchPage.contextType = AppContext;
