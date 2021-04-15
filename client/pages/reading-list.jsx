import React from 'react';
import Header from '../components/header';

export default class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBuyClicked: false,
      result: null,
      targetTitle: null
    };
    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    fetch('/api/bookShelf/readingList')
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
        // console.log('result:', result);
      })
      .catch(error => console.error(error));
  }

  handleBuyClick(event) {
    this.setState({
      isBuyClicked: true,
      targetTitle: event.target.value

    });
  }

  handleClickBack() {
    this.setState({
      isBuyClicked: false,
      targetTitle: null
    });
  }

  handleDelete(event) {
    const googleId = event.target.id;
    const req = {
      method: 'DELETE'
    };
    fetch(`/api/bookShelf/readingList/${googleId}`, req)
      .then(result => {
        return result;
      })
      .catch(error => console.error(error));
    fetch('/api/bookShelf/readingList')
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
      })
      .catch(error => console.error(error));
  }

  renderPopUp() {
    const { isBuyClicked, targetTitle } = this.state;
    const title = targetTitle;
    const indieBound = 'https://www.indiebound.org/search/book?keys=';
    if (isBuyClicked) {
      return (
        <div className="buy-overlay">
          <div className='buy-modal'>
            <div className='sub-heading buy-question'> Search indiebound.com for a copy of this book?</div>
            <div className='buy-buttons'>
              <button className="buy-no" onClick={this.handleClickBack}>No</button>
              <a href={`${indieBound}${title}`} target="_blank" rel='noreferrer'>
                <button className="buy-yes" onClick={this.handleClickBack}>Yes</button>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { result } = this.state;
    if (!result) return null;
    const books = result;
    const bookResults = (
      <div className="rl-container">
        {
          books.map(book => {
            const title = book.title;
            const thumbNail = book.coverUrl;
            const googleId = book.googleId;
            const author = book.author;
            return (
              <div key={googleId} className="rl-card">
                <div className="rl-card-info">
                  <div className='pic-container'>
                    <img className="thumbnail" src={thumbNail} alt={title} />
                  </div>
                  <div className="rl-col">
                    <div className="sub-heading six">{title}</div>
                    <div className="sub-heading three">by {author}</div>
                    <div className="rl-button-container">
                      <button value={title} className="rl-buy" onClick={this.handleBuyClick}>Buy It!</button>
                      <a href={`#details?bookId=${googleId}`}>
                        <button className="rl-info">Details</button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="delete-container">
                  <i id={googleId} className="delete-button fas fa-times" onClick={this.handleDelete}></i>
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
          <div className="heading two-white">Reading List</div>
        </div>
        <div className="rl-page">
          {this.renderPopUp()}
          {bookResults}
        </div>
      </>
    );
  }
}
