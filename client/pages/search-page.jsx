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

  handleSubmit() {

  }

  handleChange() {

  }

  render() {
    return (
      <div className = "container">
        <form>
          <label>
            Search
            <input type="text" name="search" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
