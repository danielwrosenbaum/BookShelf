import React from 'react';
import parseRoute from '../lib/parse-route';
const apiKey = process.env.API_KEY;
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: false,
      isError: false,
      route: parseRoute(window.location.hash),
      inputValue: null,
      results: null,
      info: null
    };
    this.handleDescription = this.handleDescription.bind(this);
    this.handleAuthor = this.handleAuthor.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleHeading = this.handleHeading.bind(this);
    this.handleSavedItem = this.handleSavedItem.bind(this);
    // this.handleClickedBook = this.handleClickedBook.bind(this);
  }

  componentDidMount() {
    const searchTerms = this.state.route.params;
    function getParams() {
      const newArr = [];
      for (const term of searchTerms) {
        if (term[0] === 'search') {
          newArr.push(term[1]);
        } else {
          const splitTerm = term[1].split(':');
          newArr.push(splitTerm[1]);
        }
      }
      return newArr;
    }
    const query = getParams();
    fetch(bookURL + query + '&' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            inputValue: query,
            results: result
          });
        }
      )
      .catch(error => console.error(error));
  }

  componentDidUpdate() {
    if (this.state.info) {
      this.handleSavedItem();
      this.setState({ info: null });
    }
  }

  handleDescription(text) {
    if (!text) {
      return '';
    }
    const newText = text.split(' ').slice(0, 60);
    if (newText.length === 60) {
      const joined = newText.join(' ');
      return joined + '... (Click "Details" to read more)';
    } else {
      const joined = newText.join(' ');
      return joined;
    }
  }

  handleAuthor(author) {
    return author.join(', ');
  }

  handleSave(event) {
    const { results } = this.state;
    const books = results.items;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === event.target.id) {
        this.setState({
          info: {
            title: books[i].volumeInfo.title,
            googleId: books[i].id,
            coverUrl: books[i].volumeInfo.imageLinks.thumbnail,
            author: this.handleAuthor(books[i].volumeInfo.authors)
          }
        });
      }
    }
  }

  handleSavedItem() {
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
    const { isSaved, isError, inputValue } = this.state;
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
        <div className="result-title">
          <div className="heading two-white">Results</div>
          <div className="heading">for {inputValue}</div>
        </div>
      );
    }
  }

  render() {

    const { results } = this.state;
    if (!this.state.results) {
      return null;
    }
    const books = results.items;
    if (!books) {
      return <div className="results-container heading two">Try again!</div>;
    }
    const bookResults = (
      <div className="results-container">
        {
          books.map((book, index) => {
            const title = book.volumeInfo.title;
            const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
            const author = book.volumeInfo.authors;
            const authors = this.handleAuthor(author);
            const year = parseInt(book.volumeInfo.publishedDate, 10);
            const text = book.volumeInfo.description;
            const description = this.handleDescription(text);
            const googleId = book.id;
            return (
              <div key={index} name={title} className="card">
                <div className="result-info">
                  <img className="thumbnail" src={thumbNail} alt={title} />
                  <div className="book-col">
                    <div className="book-info">
                      <h3 className="heading three no-top">{title}</h3>
                      <h4 className="heading three no-top no-bottom">by {authors}</h4>
                      <div className="heading three">{year}</div>
                    </div>
                    <a href={`#details?bookId=${googleId}`}>
                      <button id={googleId} name={title} className="info button">Details</button>
                    </a>
                  </div>
                  <div className="description">{description}</div>
                </div>
                <div className="card-icons" >
                  <i className="fas fa-plus fa-1x"></i>
                  <i className="far fa-heart fa-1x" id={googleId} onClick={this.handleSave} ></i>
                </div>
              </div>
            );
          })
        }
      </div>
    );
    return (
      <>
        {this.handleHeading()}
        <div>
          {bookResults}
        </div>
      </>
    );
  }
}
