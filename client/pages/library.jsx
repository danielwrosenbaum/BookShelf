import React from 'react';
import GetRating from '../components/get-rating';
import Header from '../components/header';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      targetId: null,
      isDeleteClicked: false,
      rating: null
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  componentDidMount() {
    fetch('/api/bookShelf/library')
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
      })
      .catch(error => console.error(error));
  }

  handleClick(event) {

    this.setState({
      isDeleteClicked: true,
      targetId: event.target.id
    });

  }

  renderDeleteModal() {
    const { isDeleteClicked, targetId } = this.state;
    if (isDeleteClicked) {
      return (
        <div className="delete-overlay">
          <div className='delete-modal'>
            <div className='sub-heading buy-question'> Delete this book from your Library?</div>
            <div className='delete-buttons'>
              <button className="delete-no" onClick={this.handleClickBack}>No</button>
              <button id={targetId} className="delete-yes" onClick={this.handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      );
    }
  }

  handleClickBack() {
    this.setState({
      taregetId: null,
      isDeleteClicked: false
    });
  }

  handleDelete(event) {
    const { targetId } = this.state;
    const googleId = targetId;
    this.setState({ isDeleteClicked: false });
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/bookShelf/library/${googleId}`, req)
      .then(result => {
        return result;
      })
      .catch(error => console.error(error));
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
          books.map(book => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const googleId = book.googleId;
            const author = book.author;
            const rating = book.stars;
            return (
              <div key={googleId} id={googleId} className="library-card">
                <div className="lib-info">
                  <div className='pic-container'>
                    <img className="thumbnail" src={thumbNail} alt={title} />
                  </div>
                  <div className="lib-col">
                    <div className="sub-col">
                      <div className="sub-heading six">{title}</div>
                      <div className="sub-heading three">by {author}</div>
                      <a className="button-anchor" href={`#details?bookId=${googleId}`}>
                        <button className="lib-details button">Details</button>
                      </a>
                    </div>
                    <div id="rate" className="rating-container">
                      <div>Rate This Book: </div>
                      <div className='star-container'>
                        <GetRating id={googleId} value={rating} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="delete-container">
                  <i id={googleId} className="delete-button fas fa-times" onClick={this.handleClick}></i>
                </div>
              </div>
            );
          })
        }
      </div>
    );
    return (
      <>
      <Header />
        <div className="details-title">
          <div className="heading two-white">Library</div>
        </div>
        <div className="library-page">
          {this.renderDeleteModal()}
          {bookResults}
        </div>
      </>
    );
  }
}
