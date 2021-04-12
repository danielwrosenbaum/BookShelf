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
            return (

              <div key={index} id={googleId} className="library-card">
                <a className="no-underline library-click" href={`#details?bookId=${googleId}`}>
                  <div className="lib-info no-outline">
                    <img className="thumbnail" src={thumbNail} alt={title} />
                    <div className="lib-col">
                      <div>
                        <div className="heading six">{title}</div>
                        <h4 className="heading three no-top no-bottom">by {author}</h4>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="rating-container">
                  <div>Rate This Book: </div>
                  <div className='star-container'>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>

                </div>

                <div className="heading bold delete-container">
                  X
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
