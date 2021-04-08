import React from 'react';

export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitleValue: '',
      inputAuthorValue: '',
      inputIsbnValue: '',
      searchTerm: '',
      results: false,
      data: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let query;
    let terms;
    const name = event.target.name;
    if (name === 'title') {
      query = this.state.inputTitleValue;
      terms = 'intitle';
    } else if (name === 'author') {
      query = this.state.inputAuthorValue;
      terms = 'inauthor';
    } else if (name === 'ISBN') {
      query = this.state.inputIsbnValue;
      terms = 'isbn';
    }
    window.location.hash = 'results?advsearch=' + terms + ':' + query;
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'title') {
      this.setState({
        inputTitleValue: value,
        searchTerm: value
      });
    } else if (name === 'author') {
      this.setState({
        inputAuthorValue: value,
        searchTerm: value
      });
    } else if (name === 'ISBN') {
      this.setState({
        inputIsbnValue: value,
        searchTerm: value
      });

    }

  }

  render() {
    return (
      <div className="search-container advanced">
        <div className="heading two">Advanced Search</div>
        <form name="title" className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="heading three">Search by Title</div>
            <input name="title" className="text-box" type="text" placeholder="Title Name..." required onChange={this.handleChange} />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form name="author" className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="heading three">Search by Author</div>
            <input name="author" className="text-box" type="text" placeholder="Author Name..." required onChange={this.handleChange} />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form name="ISBN" className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="heading three">Search by ISBN</div>
            <input name="ISBN" className="text-box" type="text" placeholder="ISBN number..." required onChange={this.handleChange} />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
      </div>
    );
  }

}
