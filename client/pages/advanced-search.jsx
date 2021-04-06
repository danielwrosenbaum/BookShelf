import React from 'react';

export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitleValue: '',
      inputAuthorValue: '',
      inputIsbnValue: ''
    };
  }

  render() {
    return (
      <div className="search-container advanced">
        <div className="heading">Advanced Search</div>
        <form>
          <label>
            <div className="headingTwo">Search by Title</div>
            <input type="text" placeholder="Title Name..." required />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form>
          <label>
            <div className="headingTwo">Search by Author</div>
            <input type="text" placeholder="Author Name..." required />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
        <form>
          <label>
            <div className="headingTwo">Search by ISBN</div>
            <input type="text" placeholder="ISBN number..." required />
            <div>
              <input className="button submit" type="submit" value="Submit" />
            </div>
          </label>
        </form>
      </div>
    );
  }

}
