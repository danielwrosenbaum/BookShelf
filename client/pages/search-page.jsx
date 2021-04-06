import React from 'react';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

  }

  handleChange() {
    this.setState({ inputValue: event.target.value });

  }

  render() {
    return (
      <div className="search-container">
        <form className="search-form" onSubmit={this.handleSubmit}>
          <label>
            <h1>Search</h1>
            <input type="text" name="search" onChange={this.handleChange} />
          </label>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}
