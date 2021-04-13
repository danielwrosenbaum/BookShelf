import React from 'react';

export default class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }

  componentDidMount() {
    fetch('/api/bookShelf/readingList')
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
      <div className="reading-list-container">
        {
          books.map((book, index) => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const googleId = book.googleId;
            const author = book.author;
            return (
              <div key={index} id={googleId} className="reading-list-card">
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
          <div className="heading two-white">Reading List</div>
        </div>
        <div className="reading-list-page">
          {bookResults}
        </div>
      </>
    );
  }
}
