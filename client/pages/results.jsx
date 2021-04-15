import React from 'react';
import parseRoute from '../lib/parse-route';
import Header from '../components/header';
import Loader from '../components/loader';
const apiKey = process.env.API_KEY;
const bookURL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: false,
      isError: false,
      isAdded: false,
      isLoading: true,
      route: parseRoute(window.location.hash),
      inputValue: null,
      results: null,
      info: null
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
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
    fetch(bookURL + query + '&maxResults=40&' + 'key=' + apiKey)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoading: false,
            inputValue: query,
            results: result
          });
        }
      )
      .catch(error => console.error(error));
  }

  componentWillUnmount() {
    clearTimeout(this.errorSaveTimer);
    clearTimeout(this.errorAddTimer);
    clearTimeout(this.saveTimer);
    clearTimeout(this.addTimer);
  }

  renderDescription(text) {
    if (!text) {
      return 'No Description Available';
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

  getAuthor(author) {
    return author.join(', ');
  }

  getSavedItem(target) {
    const { results } = this.state;
    const books = results.items;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === target.id) {
        const info = {
          title: books[i].volumeInfo.title,
          googleId: books[i].id,
          coverUrl: (books[i].volumeInfo.imageLinks) ? books[i].volumeInfo.imageLinks.thumbnail : null,
          author: this.getAuthor(books[i].volumeInfo.authors)
        };
        return info;
      }
    }
  }

  handleSave(event) {
    const target = event.target;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.getSavedItem(target))
    };
    fetch('/api/bookShelf/library', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          this.errorSaveTimer = setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isSaved: true
          });
          this.saveTimer = setTimeout(() => {
            this.setState({
              isSaved: false
            });
          }, 3000);
        }
      })
      .catch(error => console.error(error));
  }

  handleAdd(event) {
    const target = event.target;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.getSavedItem(target))
    };
    fetch('/api/bookShelf/readingList', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          this.setState({
            isError: true
          });
          this.errorAddTimer = setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 3000);
        } else {
          this.setState({
            isAdded: true
          });
          this.addTimer = setTimeout(() => {
            this.setState({
              isAdded: false
            });
          }, 3000);
        }
      })
      .catch(error => console.error(error));
  }

  renderHeading() {
    const { isSaved, isError, inputValue, isAdded } = this.state;
    if (isSaved) {
      return (
        <div className="save-header heading five">
          <div className="save-title">Saved to Your Library!</div>
        </div>
      );
    } else if (isError) {
      return (
        <div className="error-header heading five">
          <div className="error-title">Already Added!</div>
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
        <div className="result-title">
          <div className="heading two-white">Results</div>
          <div className="heading">for {inputValue}</div>
        </div>
      );
    }
  }

  renderModal() {
    const { isSaved, isAdded } = this.state;
    if (isSaved) {
      return (
        <div className='pop-up saved'>Saved!</div>
      );
    } else if (isAdded) {
      return (
        <div className='pop-up added'>Added!</div>
      );
    } else {
      return null;
    }
  }

  getResults() {
    const { results } = this.state;
    const books = results.items;
    const bookResults = (
      <div className="results-container">
        {
          books.map((book, index) => {
            const title = book.volumeInfo.title;
            const thumbNail = (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null;
            const author = (book.volumeInfo.authors) ? book.volumeInfo.authors : null;
            const authors = (author) ? this.getAuthor(author) : null;
            const year = parseInt(book.volumeInfo.publishedDate, 10);
            const text = book.volumeInfo.description;
            const description = this.renderDescription(text);
            const googleId = book.id;
            const oneBook = (
              <div key={index} name={title} className="card">
                <div className="result-info">
                  <div className='pic-container'>
                    <img className="thumbnail" src={thumbNail} alt={title} />
                  </div>
                  <div className="book-col">
                    <div className="sub-col">
                      <div className="sub-heading six">{title}</div>
                      <div className="sub-heading three">by {authors}</div>
                      <div className="sub-heading three">{year}</div>
                      <a className="button-anchor" href={`#details?bookId=${googleId}`}>
                        <button id={googleId} name={title} className="lib-details button">Details</button>
                      </a>
                    </div>
                  </div>
                  <div className="description">{description}</div>
                </div>
                <div className="card-icons" >
                  <i className="plus-icon fas fa-plus fa-1x" id={googleId} onClick={this.handleAdd}></i>
                  <i className="heart-icon far fa-heart fa-1x" id={googleId} onClick={this.handleSave} ></i>
                </div>
              </div>
            );
            return oneBook;
          })
        }
      </div>
    );
    return bookResults;
  }

  render() {
    const { results, isLoading } = this.state;
    if (isLoading) {
      return <Loader />;
    }
    if (!this.state.results) {
      return null;
    }
    const books = results.items;
    if (!books) {
      return <div className="results-container heading two">Try again!</div>;
    }
    return (
      <>
        <Header />
        {this.renderHeading()}
        <div className="results-page">
          {this.getResults()}
        </div>
        {this.renderModal()}
      </>
    );
  }
}
