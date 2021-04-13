import React from 'react';
import GetRating from '../components/get-rating';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      rating: null
    };
    // this.handleRating = this.handleRating.bind(this);
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
    // console.log(result);
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
            const rating = book.stars;
            return (
              <div key={index} id={googleId} className="library-card">
                <a className="no-underline library-click" href={`#details?bookId=${googleId}`}>
                  <div className="lib-info no-outline">
                    <div className='pic-container'>
                      <img className="thumbnail" src={thumbNail} alt={title} />
                    </div>

                    <div className="lib-col">
                      <div>
                        <div className="heading six">{title}</div>
                        <div className="heading three no-top no-bottom lib-author">by {author}</div>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="rating-container">
                  <div>Rate This Book: </div>
                  <div className='star-container'>
                    <GetRating id={googleId} value={rating}/>
                  </div>
                </div>
                <div className="delete-container">
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
