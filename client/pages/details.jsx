import React from 'react';
import parseRoute from '../lib/parse-route';
import DOMPurify from 'dompurify';
const apiKey = process.env.API_KEY;
export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      isSaved: false,
      isError: false,
      inputValue: null,
      result: null,
      info: null
    };
    this.handleAuthor = this.handleAuthor.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.rendered = this.renderedDescription.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleHeading = this.handleHeading.bind(this);
  }

  handleAuthor(author) {
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
          const authors = this.handleAuthor(result.volumeInfo.authors);
          this.setState({
            inputValue: query,
            result: result,
            info: {
              title: result.volumeInfo.title,
              author: authors,
              coverUrl: result.volumeInfo.imageLinks.thumbnail,
              googleId: result.id
            }
          });
        }
      )
      .catch(error => console.error(error));
  }

  renderDescription() {
    const book = this.state.result;
    if (!book) return null;
    const text = book.volumeInfo.description;
    const clean = DOMPurify.sanitize(text);
    return { __html: clean };
  }

  renderedDescription() {
    return <p dangerouslySetInnerHTML={this.renderDescription()} />;
  }

  handleSave() {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.info)
    };
    fetch('/api/bookShelf', req)
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

  handleHeading() {
    const { isSaved, isError } = this.state;
    if (isSaved) {
      return (
        <div className="save-header heading five">
          <div className="save-title">Nice! It is Now Saved in Your Library!</div>
        </div>
      );
    } else if (isError) {
      return (
        <div className="error-header heading five">
          <div className="error-title">Already Added to Library</div>
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

  render() {
    const book = this.state.result;
    if (!book) return null;
    const title = book.volumeInfo.title;
    const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
    const author = book.volumeInfo.authors;
    const authors = this.handleAuthor(author);
    const year = parseInt(book.volumeInfo.publishedDate, 10);
    const isbn = book.volumeInfo.industryIdentifiers[0].identifier;
    const subTitle = book.volumeInfo.subtitle;
    const category = book.volumeInfo.categories;
    const pages = book.volumeInfo.pageCount;
    return (
      <>
          {this.handleHeading()}
        <div className="details-page">
          <div className="details-container">
            <div className='details-pic-container'>
              <img src={thumbNail} alt={title} />
            </div>
            <div className="book-details">
              <div className="heading one-blue">{title}</div>
              <div className="heading sub">{subTitle}</div>
              <div className="heading four">by {authors}</div>
              <div className="small-details">
                <div className="heading four bold">Book Details</div>
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
                </div>
                <div className="description-container">
                  <div className="heading four bold">Description</div>
                  {this.renderedDescription()}
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="details-button add-list">Add to List</button>
              <button className="details-button add-lib" onClick={this.handleSave}>{(this.state.isSaved) ? <i className="fas fa-heart fa-2x"></i> : 'Read it!'}</button>
            </div>
          </div>
        </div>
      </>

    );
  }
}
