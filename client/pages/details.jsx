import React from 'react';
import parseRoute from '../lib/parse-route';
import DOMPurify from 'dompurify';
const apiKey = process.env.API_KEY;
export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      isSaveClicked: false,
      inputValue: null,
      result: null
    };
    this.handleAuthor = this.handleAuthor.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.rendered = this.renderedDescription.bind(this);
    this.handleSave = this.handleSave.bind(this);
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
          this.setState({
            inputValue: query,
            result: result
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
    const clicked = this.state.isSaveClicked;
    if (!clicked) {
      this.setState({ isSaveClicked: true });
      setTimeout(() => {
        this.setState({ isSaveClicked: false });
      }, 4000);
    }
  }

  render() {
    const saveClick = this.state.isSaveClicked;
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
      {(saveClick) &&
      <div className="save-header header">
          <div className="details-title">Nice! <span className="italic">{title} </span>is Now Saved in Your Library!</div>
        </div>}
        {(!saveClick) &&
          <div className="details-title">
            <div className="heading two-white">Details</div>
          </div>}

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
              <button className="details-button add-lib" onClick={this.handleSave}>Read it!</button>
            </div>
          </div>
        </div>
      </>

    );
  }
}
