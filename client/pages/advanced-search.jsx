import React from 'react';

export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitleValue: '',
      inputAuthorValue: '',
      inputIsbnValue: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(event) {
    const name = event.target.name;
    if (name === 'title') {
      this.setState({ inputTitleValue: event.target.value });

    } else if (name === 'author') {
      this.setState({ inputAuthorValue: event.target.value });

    } else if (name === 'ISBN') {
      this.setState({ inputIsbnValue: event.target.value });

    }

  }

  render() {
    return (
      <div className="search-container advanced">
        <div className="adv-heading">Advanced Search</div>
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="search-heading">Search by Title</div>
            <input name="title" className="text-box" type="text" placeholder="Title Name..." required onChange={this.handleChange} />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="search-heading">Search by Author</div>
            <input name="author" className="text-box" type="text" placeholder="Author Name..." required onChange={this.handleChange} />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <div className="search-heading">Search by ISBN</div>
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
