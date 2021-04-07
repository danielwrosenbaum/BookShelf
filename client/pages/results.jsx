import React from 'react';
import AppContext from '../lib/app-context';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const searchResults = this.props.value;
    const books = searchResults.items;
    // console.log(books);
    const bookResults = (
      <div className="results-container">
        {
          books.map((books, index) => {
            return (
              <div key={index} className="card">
                {books.volumeInfo.title}
              </div>
            );
          })
        }
      </div>
    );
    return (
      <div>
        { bookResults}
      </div>

    );
  }
}
Results.contextType = AppContext;
