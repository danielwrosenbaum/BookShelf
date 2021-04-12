import React from 'react';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  componentDidMount() {
    fetch('/api/bookShelf/library')
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { result } = this.state;
    if (!result) return null;
    const books = result;

    const bookResults = (
      <div className="library-container">
        {
          books.map((book, index) => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const googleId = book.googleId;
            const author = book.author;
            // const libraryId = book.libraryId;
            return (

               <div key={index} id={googleId} className="library-card">
                <a className="no-underline" href={`#details?bookId=${googleId}`}>
                <div className="result-info no-outline">
                  <img className="thumbnail" src={thumbNail} alt={title} />
                  <div className="book-col">
                    <div className="book-info">
                      <h3 className="heading three no-top">{title}</h3>
                      <h4 className="heading three no-top no-bottom">by {author}</h4>

                    </div>

                      {/* <button id={googleId} name={title} className="info button">Details</button> */}

                  </div>
                </div>
                </a>
                <div className="heading rating-container">Rate This Book:
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>

                </div>
              </div>

            );
          })
        }
      </div>
    );

    return (
      <>
        <div className="details-title">
          <div className="heading two-white">Library</div>
        </div>
        <div className="library-page">
          {bookResults}
        </div>
      </>
    );
  }
}
