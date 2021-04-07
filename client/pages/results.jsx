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
                <img className="thumbnail" src={thumbNail} alt={title} />
                <div className="book-info">
                  <h2 className="heading three no-top">{title}</h2>
                  <h3 className="heading three no-bottom">by {author}</h3>
                  <div className="heading three">{year}</div>
                  <button className="info button">More Info</button>
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
