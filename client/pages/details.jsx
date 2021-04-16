import React from 'react';
import parseRoute from '../lib/parse-route';
import DOMPurify from 'dompurify';
import Header from '../components/header';
import Loader from '../components/loader';
const apiKey = process.env.API_KEY;
export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      isSaved: false,
      isError: false,
      isAdded: false,
      isBuyClicked: false,
      isLoading: true,
      inputValue: null,
      target: null,
      result: null,
      info: null
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  getAuthor(author) {
    return author.join(', ');
  }

  componentDidMount() {
    const searchTerms = this.state.route.params;
    function getParams() {
      const newArr = [];
      for (const term of searchTerms) {
        newArr.push(term[1]);
      }
      return newArr;
    }

    const query = getParams();
    fetch('https://www.googleapis.com/books/v1/volumes/' + query + '?' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          const authors = this.getAuthor(result.volumeInfo.authors);
          const thumbNail = (result.volumeInfo.imageLinks) ? result.volumeInfo.imageLinks.thumbnail : null;
          this.setState({
            isLoading: false,
            inputValue: query,
            result: result,
            info: {
              title: result.volumeInfo.title,
              author: authors,
              coverUrl: thumbNail,
              bookId: result.id,
              rating: null
            }
          });
        }
      )
      .catch(error => console.error(error));
  }

  renderDescription() {
    const book = this.state.result;
    if (!book) return null;
    const text = (book.volumeInfo.description) ? book.volumeInfo.description : 'No Description Available.';
    const clean = DOMPurify.sanitize(text);
    return { __html: clean };
  }

  renderedDescription() {
    return <p dangerouslySetInnerHTML={this.renderDescription()} />;
  }

  handleSave(event) {
    this.setState({ target: 'Library' });
    const { info } = this.state;
    info.isRead = true;
    info.rating = 0;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    };
    fetch('/api/bookShelf/', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isSaved: true
          });
          setTimeout(() => {
            this.setState({
              isSaved: false
            });
          }, 3000);
        }
      })
      .catch(error => console.error(error));
  }

  getIsbn(isbn) {
    let x;
    for (let i = 0; i < isbn.length; i++) {
      if (isbn[i].type === 'ISBN_13') {
        x = isbn[i].identifier;
      } else {
        x = isbn[i].identifier;
      }
    }
    return x;
  }

  handleAdd() {
    this.setState({ target: 'Reading List' });
    const { info } = this.state;
    info.isRead = 'false';
    info.rating = null;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    };
    fetch('/api/bookShelf/', req)
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isAdded: true
          });
          setTimeout(() => {
            this.setState({
              isAdded: false
            });
          }, 3000);
        }
      })
      .catch(error => console.error(error));
  }

  renderHeading() {
    const { isSaved, isError, isAdded, target } = this.state;
    if (isSaved) {
      return (
        <div className="save-header heading five">
          <div className="save-title">Saved to Your Library!</div>
        </div>
      );
    } else if (isError) {
      return (
        <div className="error-header heading five">
          <div className="error-title">{`Already Added to ${target}`}</div>
        </div>
      );
    } else if (isAdded) {
      return (
        <div className="add-header heading five">
          <div className="add-title">Added to Your Reading List!</div>
        </div>
      );
    } else {
      return (
        <div className="details-title">
          <div className="heading two-white">Details</div>
        </div>
      );
    }
  }

  handleBuyClick() {
    this.setState({ isBuyClicked: true });
  }

  handleClickBack() {
    this.setState({ isBuyClicked: false });
  }

  renderPopUp() {
    const { isBuyClicked, info } = this.state;
    const { title } = info;
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
    const { isLoading } = this.state;
    if (isLoading) {
      return <Loader />;
    }
    const book = this.state.result;
    if (!book) return null;
    const title = book.volumeInfo.title;
    const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
    const author = book.volumeInfo.authors;
    const authors = this.getAuthor(author);
    const year = parseInt(book.volumeInfo.publishedDate, 10);
    const isbn = (book.volumeInfo.industryIdentifiers) ? this.getIsbn(book.volumeInfo.industryIdentifiers) : 'N/A';
    const subTitle = book.volumeInfo.subtitle;
    const category = book.volumeInfo.categories;
    const pages = book.volumeInfo.pageCount;
    return (
      <>
      <Header />
        {this.renderHeading()}
        <div className="details-page">
          {this.renderPopUp()}
          <div className="details-container">
            <div className='details-pic-container'>
              <img src={thumbNail} alt={title} />
            </div>
            <div className="book-details">
              <div className="heading one-blue">{title}</div>
              <div className="heading sub">{subTitle}</div>
              <div className="heading four">by {authors}</div>
              <div className="small-details">
                <div className="sub-heading four bold">Book Details</div>
                <div className="small-details-insert">
                  <div className="three">
                    <span className="semi-bold">Genre: </span>
                    {category}</div>
                  <div className="three">
                    <span className="semi-bold">Published: </span>
                    {year}</div>
                  <div className="three">
                    <span className="semi-bold">Pages: </span>
                    {pages}</div>
                  <div className="three">
                    <span className="semi-bold">ISBN: </span>
                    {isbn}</div>
                  <button className="details-buy sub-heading three bold" onClick={this.handleBuyClick}>Buy Here</button>
                </div>
                <div className="description-container">
                  <div className="sub-heading four bold">Description</div>
                  {this.renderedDescription()}
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="details-button add-list" onClick={this.handleAdd}>{(this.state.isAdded) ? <i className="blue fas fa-check fa-2x"></i> : 'Add to List'}</button>
              <button className="details-button add-lib" onClick={this.handleSave}>{(this.state.isSaved) ? <i className="fas fa-heart fa-2x"></i> : 'Read it!'}</button>
            </div>
          </div>
        </div>
      </>

    );
  }
}
