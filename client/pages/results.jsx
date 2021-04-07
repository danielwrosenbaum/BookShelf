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
            const title = books.volumeInfo.title;
            const thumbNail = books.volumeInfo.imageLinks.thumbnail;
            const author = books.volumeInfo.authors;
            const year = parseInt(books.volumeInfo.publishedDate, 10);
            return (
              <div key={index} className="card">
                <img src={thumbNail} alt={title} />
                <div className="book-info">
                <div>{title}</div>
                <div>{author}</div>
                <div>{year}</div>
                </div>

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
